# Registration & Profile Management Upgrade (Unified)

## TL;DR

> **Quick Summary**: comprehensive upgrade to enforce user profile completeness. Includes DB schema updates, AuthContext refactoring to load full profile data, and a "Force Update" UI flow for users with missing information (e.g., Google OAuth).
> 
> **Deliverables**:
> - `migration.sql`: Schema updates for `public.profiles`.
> - `AuthContext.js`: Refactored to fetch/cache full profile.
> - `ProfileEditModal.js`: New component with "Force" mode.
> - `Header.js`: Logic to detect missing data and enforce update.
> - `SignUpModal.js`: Updated with new fields.
> 
> **Estimated Effort**: Medium-High
> **Parallel Execution**: YES - 2 waves

---

## Context

### Original Request
User wants to capture detailed user data (`full_name`, `phone_number`, `okta_member` status) and **force** users to provide it if missing. This is critical for Google OAuth users who start with empty profiles.

### Technical Approach
1.  **DB**: Add columns.
2.  **State**: `AuthContext` becomes the "Profile Store", fetching `*` from `profiles`.
3.  **UI**: `ProfileEditModal` handles both voluntary edits and forced completion.
4.  **Enforcement**: `Header` watches `AuthContext` state and triggers the modal if requirements aren't met.

### Metis/Gap Review
-   **Risk**: `AuthContext` refactor might break existing `isAdmin` checks.
    -   *Mitigation*: Ensure `userRole` logic is preserved (derived from `userProfile.role`).
-   **Risk**: Modal might close unexpectedly.
    -   *Mitigation*: `force` prop completely disables closing mechanisms (mask click, close button, ESC key).
-   **UX**: Users need to know *why* they are forced.
    -   *Mitigation*: Modal title changes to "Please complete your profile to continue" when forced.

---

## Work Objectives

### Core Objective
Ensure every logged-in user has a complete profile (`full_name`, `phone_number`) before accessing the site features.

### Definition of Done
- [ ] `public.profiles` has new columns.
- [ ] `AuthContext` provides `userProfile` object.
- [ ] Users with missing `full_name` are blocked by a non-closable modal until they save.
- [ ] "Okta Chapter" fields are conditionally visible.
- [ ] Header shows "Profile" menu instead of just "Logout".

---

## Verification Strategy

### Manual Verification Procedures

**1. Database Verification**
```sql
SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles';
```

**2. Google OAuth Flow (The "Force" Test)**
- Login with a fresh Google account (or manually clear `full_name` in DB).
- **Expectation**: "Complete Profile" modal appears immediately.
- **Test**: Try to close it (Click outside, Press Esc). -> **Should NOT close**.
- **Test**: Fill details and Save. -> **Should close** and show "Profile" in header.

**3. Email Signup Flow**
- Sign up with new email.
- Fill all fields in `SignUpModal`.
- Submit.
- **Expectation**: Logged in, no "Force" modal appears (because data was saved during signup).

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation):
├── Task 1: Database Migration & RLS
└── Task 2: AuthContext Refactor (Fetch Logic)

Wave 2 (UI Components):
├── Task 3: ProfileEditModal (New + Force Logic)
└── Task 4: SignUpModal Update (New Fields)

Wave 3 (Integration):
└── Task 5: Header Implementation (Enforcement Logic)
```

---

## TODOs

- [ ] 1. Create Database Migration Script
  **What to do**:
  - Create `supabase_migration.sql`.
  - SQL: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ...` (full_name, phone_number, etc.).
  - SQL: `CREATE POLICY` for UPDATE using `auth.uid() = id`.
  **References**:
  - `src/context/AuthContext.js` (Existing table usage)
  **Recommended Agent**: `quick` + `writing`
  **Parallelization**: Wave 1

- [ ] 2. Refactor AuthContext.js
  **What to do**:
  - Rename `fetchUserRole` -> `fetchUserProfile`.
  - Update Query: `.select('*')` instead of `.select('role')`.
  - State: Add `const [userProfile, setUserProfile] = useState(null)`.
  - Compat: Derive `userRole` from `data.role`.
  - Return `userProfile` in the Context value.
  **References**:
  - `src/context/AuthContext.js`
  **Recommended Agent**: `refactor` or `visual-engineering`
  **Parallelization**: Wave 1

- [ ] 3. Create ProfileEditModal.js
  **What to do**:
  - Create new component.
  - Props: `({ isOpen, onClose, force })`.
  - **Force Logic**:
    - If `force` is true: Hide `CloseButton`, `Overlay` click does nothing.
    - Title: "회원가입 완료를 위해 정보를 입력해주세요" (if force) vs "프로필 수정" (default).
  - Form: Full Name, Phone, Kakao, Okta Member (checkbox), Chapter (conditional).
  - Save: `supabase.from('profiles').update(...)`.
  **References**:
  - `src/components/SignUpModal.js` (Style source)
  **Recommended Agent**: `visual-engineering`
  **Parallelization**: Wave 2

- [ ] 4. Update SignUpModal.js
  **What to do**:
  - Add new fields to the form.
  - Logic: After `auth.signUp` success, immediately run `profiles.upsert` with all form data.
  **References**:
  - `src/components/SignUpModal.js`
  **Recommended Agent**: `visual-engineering`
  **Parallelization**: Wave 2

- [ ] 5. Implement Header Enforcement Logic
  **What to do**:
  - Import `userProfile` from `useAuth`.
  - Add `useEffect`:
    ```javascript
    useEffect(() => {
      if (user && userProfile) {
        // Check required fields
        if (!userProfile.full_name || !userProfile.phone_number) {
          setIsProfileModalOpen(true);
          setForceProfileMode(true);
        }
      }
    }, [user, userProfile]);
    ```
  - Update UI: Replace "Logout" button with "Profile" dropdown/link.
  - Pass `force={forceProfileMode}` to `ProfileEditModal`.
  **References**:
  - `src/components/common/Header.js`
  **Recommended Agent**: `visual-engineering`
  **Parallelization**: Wave 3 (Depends on Context & Modal)

---

## Success Criteria

- [ ] Users cannot use the site without `full_name` and `phone_number`.
- [ ] Google Login flow seamlessly transitions to Profile Completion.
- [ ] Existing users are prompted to update data upon next login.
