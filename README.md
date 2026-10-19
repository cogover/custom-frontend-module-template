# custom-module-template

Read the Vietnamese documentation [here](README.vi.md).

A template for developing Custom Modules for Cogover. Customize the sample page, add new pages, and call APIs for your selected workspace.

## Run locally

Requires Node.js and an account with access to your Cogover workspace. This project has been tested with Node.js `20.19.6`.

1. Clone the project to your machine.
2. Copy `.env.sample` to `.env.local` and enter your workspace name. For example, for `https://company.cogover.com`:

    ```dotenv
    VITE_WORKSPACE_NAME=company
    ```

3. Install dependencies:

    ```bash
    npm i
    ```

4. Run the project locally:

    ```bash
    npm run dev
    ```

## Develop a Custom Page

Follow the project's [custom-module-foundation](.agents/skills/custom-module-foundation/SKILL.md) skill to develop a Custom Page.

**Keep the mapping `'./CustomApp': './src/App.tsx'` unchanged in `exposes` in `vite.config.ts`. Do not delete it, rename `./CustomApp`, or change the `./src/App.tsx` path, even when developing only Form Builder components.**

## Develop local components in Form Builder

Follow the project's [custom-module-form-builder](.agents/skills/custom-module-form-builder/SKILL.md) skill to develop components for Form Builder.

After installing dependencies and configuring your workspace above, use this workflow to test components directly on Cogover.

1. Watch for source changes and rebuild automatically:

    ```bash
    npm run build-watch
    ```

2. Wait for the first build to finish, then open another terminal and run:

    ```bash
    npm run preview
    ```

    Keep both commands running while developing.

3. In the `npm run preview` terminal, find `Components/DemoCounter` under **Federation components:**:

    ```text
    Federation components:
    Components/DemoCounter
         -> http://localhost:5101/#./Components/DemoCounter
    ```

    Copy the full URL after `->`. In the **Object's layout configuration**, select the **Federation component** and paste it into the **URL** field. Use this localhost URL only for local debugging.

4. Open the Form Builder preview. If your browser requests permission to **“Access other apps and services on this device”**, choose **Allow** so Cogover can load the component from your machine.
5. Edit `src/components/DemoCounter.tsx`, save, and wait for a successful build to view the updated component in Form Builder.
6. Once development is complete and the new build is deployed to Cogover, **replace the localhost URL in the layout configuration with the actual deployment path** described in the [custom-module-form-builder](.agents/skills/custom-module-form-builder/SKILL.md#2-xuất-component-cho-form-builder) skill. For example, if the demo is deployed in slot `_cm_1`, use `_cm_1/Components/DemoCounter`. Use the slot assigned to your module.

## Receive Custom Backend Module push messages

A Custom Backend Module sends pushes with `push.refreshRecords`, `push.toast` and `push.message`. Receive them with the `useSocketListener` hook from `@cogover/client-sdk` (`0.3.0` or later), subscribing and unsubscribing in `useEffect`:

```tsx
import { useSocketListener } from '@cogover/client-sdk';
import { useEffect } from 'react';

const { subscribe, unsubscribe, status } = useSocketListener();

useEffect(() => {
    const onRefresh = () => refetch();
    subscribe('refreshRecords', onRefresh, { objectSlug: 'lead', recordId });
    return () => unsubscribe('refreshRecords', onRefresh);
}, [recordId, refetch, subscribe, unsubscribe]);
```

Pass `objectSlug` + `recordId` to receive pushes sent to the viewers of that record (`recordId` comes from the route, for example `useParams()` in a Form Builder component; `refetch` reloads the module's data). Events, payloads and rules: skill [custom-module-api](.agents/skills/custom-module-api/SKILL.md#14-nhận-push-message-từ-custom-backend-module).

## Run on mobile

The Cogover mobile app opens Custom Pages and Form Builder components inside an embedded web page. To make your module behave the same as on the web, follow these rules (details: [custom-module-foundation](.agents/skills/custom-module-foundation/SKILL.md#11-chạy-trên-mobile)):

1. Use the Cogover platform only through its public contract: `useLibrary()` from `@cogover/client-sdk` (language, theme, workspace, current user, apps) and the `formBuilder` prop with exactly five members: `execScript`, `refreshRecordDetail` (view and edit screens only), `record`, `mode`, `objectSlug`. Do not read page globals, and do not call `window.CogoverWebView`, `flutter_inappwebview`, or `CogoverEmbed`.
2. Check that a feature exists before using it, and always provide a fallback (on the web, on older app versions).
3. Navigate within the module with the project's `Link` and `useNavigate`; leave the module with a full URL.
4. Components on a layout must not use viewport-based heights (`100vh`, `h-screen`) or `position: fixed`; use `Modal` or `Popper` from `@cogover/client-sdk` for overlays.
5. Do not use `alert`, `confirm`, `prompt`, or `window.print`; notify with `showToastMessage` and ask for confirmation with `ConfirmModal`.
6. Download files through the API's download link; do not create `blob:` URLs yourself.
7. Do not read or store tokens, and do not store sensitive data in `localStorage`; call external services through a Custom Backend Module.

`npm run lint` reports violations of rules 1, 4 (in `src/components`), and 5.

The new contract APIs (the `formBuilder` prop's `record`, `mode`, `objectSlug`; `commonSettings.apps` from `useLibrary()`) require the Cogover platform released with `@cogover/client-sdk` 0.4.0. On older platforms these APIs are `undefined`: check that they exist before using them (for example `formBuilder?.mode`, `useLibrary().commonSettings?.apps ?? []`) and provide a fallback.

Why: `window.CogoverWebView`, `CogoverEmbed`, `flutter_inappwebview`, `__COGOVER_FEDERATION_HOST__` and the `@cogover/client-sdk/embed-bridge` package are the internal channel between the Cogover page and the Cogover mobile app. The platform uses it to pass `formBuilder`, settings and navigation; its format can change with any app version and it does not exist on the web, so modules that call it directly break. `npm run lint` blocks these names.

```tsx
// Wrong: calling the internal channel directly.
(window as any).CogoverWebView.postMessage(JSON.stringify({ type: 'nav.open', url }));

// Right: use the public contract.
<Link to={url}>Open record</Link>;
await formBuilder?.execScript(({ screen }) => {
    const field = screen.get('name');
    if (field) field.value = 'Test';
});
```

## Files commonly used during development

1. `src/pages/WelcomePage/index.tsx`: the sample page to start customizing.
2. `src/pages/`: new pages.
3. `src/routes.tsx`: page paths and their corresponding components in `APP_ROUTES`.
4. `src/components/`: shared UI components, including `Link` and `Avatar`.
5. `src/apis/`: API functions and related data types.
6. `src/assets/`: images, videos, audio, and downloadable files.
7. `src/languages/locales/`: translation files.

### Add a page

Create a page in `src/pages/`, then add it to `APP_ROUTES` in `src/routes.tsx`. Declare paths without a leading `/`, such as `customers` or `customers/:customerId`. Set `name` to show the page in the sidebar during `npm run dev`; this header + sidebar layout only simulates Cogover while developing.

### Link between pages

Always use the project's `Link` component:

```tsx
import Link from 'src/components/Link';
```

This component handles application paths when running within Cogover. For programmatic navigation, use the project's `useNavigate` (`import useNavigate from 'src/hooks/useNavigate';`). Do not import `Link` or `useNavigate` directly from `react-router-dom`, manually add the application identifier to URLs, or use `<a>` tags or `window.open` to navigate between pages within the module; to open a new tab, set `target='_blank'` on `Link`. External links (`https://`, `mailto:`, `tel:`) also use `Link`, e.g. `<Link to='https://…' target='_blank'>`; do not use `window.open` or assign `window.location` even for external links, because the Cogover platform needs to receive the navigation so the mobile app can open the destination itself.

### Images, videos, and other files

Place assets in `src/assets` and import them where needed. For example:

```tsx
import logoUrl from 'src/assets/cogover-logo.svg';

<img src={logoUrl} alt='Cogover' />;
```

Keep `base: './'` in `vite.config.ts` so assets load relative to the location serving the module. Do not hardcode paths such as `/images/banner.png` in the UI, as they may resolve to the wrong address when the module is embedded in Cogover. See the [static asset guide](.agents/skills/custom-module-foundation/SKILL.md#9-static-asset--critical).

### Translations

For multilingual interfaces, follow the project's [custom-module-i18n guide](.agents/skills/custom-module-i18n/SKILL.md). Write new content in Vietnamese by default; add translations only when requested.

### UI conventions

1. Use the existing colors, spacing, and typography described in the [custom-module-foundation guide](.agents/skills/custom-module-foundation/SKILL.md).
2. Run `npm run lint` to check for code issues after making changes.
