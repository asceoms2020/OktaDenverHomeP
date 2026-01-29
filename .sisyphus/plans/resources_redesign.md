# Plan: Resources Page Redesign

## TL;DR

> **Quick Summary**: Redesign `Resources.js` to match the "About" page's modern aesthetic by migrating from CSS modules to `styled-components`. Focus on the MOU section and World Map presentation.
> 
> **Deliverables**:
> - New `src/styles/Resources.styles.js`
> - Refactored `src/pages/Resources.js`
> - (Optional) Deleted `src/pages/Resources.css`
> 
> **Estimated Effort**: Short
> **Parallel Execution**: Sequential

---

## Context

### Original Request
Redesign `Resources.js` to look "pretty" (modern, professional) and consistent with `About.js` styles. Current state is described as "lousy".

### Interview Summary
**Key Discussions**:
- **Styling Architecture**: Migrate to `styled-components` (User verified).
- **Scope**: Focus on MOU section and its benefits list; World Map presentation.
- **Visuals**: Use `About.styles.js` as the design system source of truth (Blues, Gradients, Noto Sans KR).

### Reference Styles (from `About.styles.js`)
- **Colors**: Blues (`#1e3a8a` to `#3b82f6`), Dark Text (`#1a1a1a`), Gray Text (`#4b5563`).
- **Gradients**: Linear gradients for titles and accents.
- **Shadows**: Soft, large shadows (`0 25px 50px rgba(0,0,0,0.04)`).
- **Cards**: White background, rounded corners (24px-40px), hover lift effects.

---

## Work Objectives

### Core Objective
Transform the Resources page into a polished, cohesive part of the site using the existing design system.

### Concrete Deliverables
- `src/styles/Resources.styles.js`: New styled components file.
- `src/pages/Resources.js`: Updated to use new components.

### Definition of Done
- [ ] No `className` strings used for core layout (replaced by styled components).
- [ ] MOU section matches the visual quality of `CEOSection` in About page.
- [ ] Benefits list has custom styled checkmarks/icons.
- [ ] Page is fully responsive (mobile/tablet stack correctly).

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1:
└── Task 1: Create Resources.styles.js (The foundation)

Wave 2:
└── Task 2: Refactor Resources.js (The implementation)

Wave 3:
└── Task 3: Cleanup Resources.css (The cleanup)
```

---

## TODOs

- [ ] 1. Create `src/styles/Resources.styles.js`

  **What to do**:
  - Define `ResourcesContainer` (can extend or reuse `AboutContainer`).
  - Define `MOUCard` (based on `CEOSection` style: white bg, shadow, rounded corners).
  - Define `MOUContent` (text side) and `MapContainer` (image side).
  - Define `BenefitList` and `BenefitItem` with custom pseudo-element checkmarks (using gradients).
  - Add `fadeIn` keyframe animation for entrance.

  **Must Have**:
  - Gradient text for the MOU title.
  - Hover effect on the MOU card (lift + shadow increase).
  - Responsive media query (stack vertically on mobile).

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `frontend-ui-ux`

  **References**:
  - `src/styles/About.styles.js`: COPY the shadow, border-radius, and gradient values from here.

- [ ] 2. Refactor `src/pages/Resources.js`

  **What to do**:
  - Import new components from `../styles/Resources.styles`.
  - Remove `import './Resources.css'`.
  - Replace HTML structure with styled components:
    - `<div className="mou-section">` → `<MOUCard>`
    - `<ul className="mou-benefits">` → `<BenefitList>`
  - Ensure the World Map image uses the new `MapImage` styled component (responsive width).

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `frontend-ui-ux`

- [ ] 3. Cleanup `src/pages/Resources.css`

  **What to do**:
  - Delete the file OR comment out contents to avoid unused CSS bloat.
  - Verify no other files were importing it.

  **Recommended Agent Profile**:
  - **Category**: `quick`

---

## Success Criteria

### Final Checklist
- [ ] MOU section looks like a "premium" feature card.
- [ ] Map image scales without distortion.
- [ ] Checkmarks on the list are styled (green/blue gradient), not default browser bullets.
- [ ] No visual regressions on the About page (since we reference its styles).
