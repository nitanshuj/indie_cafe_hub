Task: Fix the TanStack Start CSRF vulnerability and clean up the deprecated Vite tsconfig paths warning.

Please perform the following steps:

1. Inspect `src/start.ts`.
   - Import `createCsrfMiddleware` from `@tanstack/start/server`.
   - Instantiate the middleware:
     ```typescript
     const csrfMiddleware = createCsrfMiddleware({
       filter: (ctx) => ctx.handlerType === 'serverFn',
     })
     ```
   - Register it inside the `createStart` call under `requestMiddleware`:
     ```typescript
     export const startInstance = createStart(() => ({
       requestMiddleware: [csrfMiddleware],
     }))
     ```

2. Inspect `vite.config.ts`.
   - Look for the use of the "vite-tsconfig-paths" plugin.
   - Remove the `tsconfigPaths()` plugin import and usage.
   - Enable native tsconfig paths resolution inside the Vite config object by adding:
     ```typescript
     resolve: {
       tsconfigPaths: true
     }
     ```

3. Run `bun run dev` or `npm run dev` to verify that both warnings have disappeared and the application builds cleanly.