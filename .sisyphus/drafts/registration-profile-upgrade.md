# Draft: Registration & Profile Force-Update (Unified)

## Requirements (confirmed)
- **Database**: Add `full_name`, `is_okta_member`, etc. to `profiles`.
- **AuthContext**: 
  - Refactor to fetch FULL profile (`select *`), not just role.
  - Expose `userProfile` object.
- **ProfileEditModal**:
  - Add `force` prop.
  - If forced: No close button, click-outside disabled, specific title.
- **Header**:
  - Check `userProfile` for missing fields (`full_name`, `phone_number`).
  - If missing, trigger `ProfileEditModal` with `force={true}`.
- **SignUpModal**:
  - Collect new fields during signup.
  - Upsert to profiles.

## Technical Decisions
- **Enforcement Logic**: Placed in `Header.js` (global layout) rather than a separate wrapper, as Header is always present.
- **State Management**: `AuthContext` will be the source of truth for "is profile loaded".
- **UX**: Google OAuth users will land on the page, Header will detect missing profile, and immediately pop the modal.

## Scope Boundaries
- **INCLUDE**: Refactoring `AuthContext` to support profile data.
- **EXCLUDE**: Changing the underlying Auth provider (still Supabase).

## Gap Analysis (Self-Correction)
- **Race Condition**: `AuthContext` must explicitly expose `profileLoading`. `Header` must wait for `profileLoading` to complete before checking fields, otherwise the modal might flash or not trigger correctly.
- **Infinite Loop**: Ensure the `useEffect` in Header has correct dependencies `[userProfile, isProfileOpen]` and doesn't spam the modal if it's already open.
