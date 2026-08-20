# Definition of Done (DoD)

All tasks and features within this workspace must satisfy the following criteria before being considered complete:

## 1. Code Quality & Standards
- [ ] Code is written in clean, idiomatic TypeScript/React with strict type checking.
- [ ] No linting or TypeScript compiler warnings/errors (`tsc --noEmit`).
- [ ] Clean architecture with separation of concerns between UI components, context state, and storage services.

## 2. Testing & Verification
- [ ] Automated unit tests cover business logic (scoring algorithms, consensus gate rules, stage transition validation).
- [ ] Test suite runs and passes cleanly (`npm test`).
- [ ] Production build succeeds without error (`npm run build`).

## 3. User Experience & Accessibility
- [ ] Keyboard navigable workflows and logical heading structure (WCAG 2.2 AA compliant).
- [ ] High-contrast color themes, clear interactive states (hover, focus, disabled, active).
- [ ] Seamless responsive layout for laptop and desktop screens.
- [ ] Zero unhandled error states; loading and empty states provided for all views.

## 4. Security & Data Integrity
- [ ] All inputs properly handled; XSS-safe rendering.
- [ ] Data persisted safely to local storage with automated fallback and migration.
- [ ] Export/import validation for project data integrity.

## 5. Documentation & Delivery
- [ ] `docs/adr/` contains recorded Architecture Decision Records.
- [ ] `README.md` documents architecture, features, and quickstart instructions.
- [ ] `CHANGELOG.md` updated with release notes.
- [ ] Sprint retrospectives documented in `sprints/retros.md`.
