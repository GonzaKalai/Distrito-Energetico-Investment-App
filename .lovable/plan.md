## Fix the "this page didn't load" crash

**Root cause:** In `src/components/editor/CustomBlocks.tsx`, the Zustand selector returns `customBlocks ?? []`. When `customBlocks` is undefined on a tab, `[]` is a new array every render, so Zustand thinks the state changed, triggers a re-render, and loops until React throws "Maximum update depth exceeded". The root `errorComponent` then shows "This page didn't load".

### Change

In `src/components/editor/CustomBlocks.tsx`, split the selector so it returns a stable reference, then default outside the selector:

```ts
const rawBlocks = useApp((s) => s.content[s.sector][s.language][tabKey].customBlocks);
const blocks: CustomBlock[] = rawBlocks ?? EMPTY;
```

where `const EMPTY: CustomBlock[] = []` is a module-level constant (stable reference across renders).

That's the only required change — the rest of the component already handles an empty array correctly.

### Verification

- Reload preview, confirm the homepage renders instead of the error fallback.
- Check console: the "Maximum update depth exceeded" error should be gone.
- Switch tabs / toggle edit mode to confirm no regression.