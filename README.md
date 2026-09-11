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
    npm ci
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

## Files commonly used during development

1. `src/pages/WelcomePage/index.tsx`: the sample page to start customizing.
2. `src/pages/`: new pages.
3. `src/routes.tsx`: page paths and their corresponding components in `APP_ROUTES`.
4. `src/components/`: shared UI components, including `Link` and `Avatar`.
5. `src/apis/`: API functions and related data types.
6. `src/assets/`: images, videos, audio, and downloadable files.
7. `src/languages/locales/`: translation files.

### Add a page

Create a page in `src/pages/`, then add it to `APP_ROUTES` in `src/routes.tsx`. Declare paths without a leading `/`, such as `customers` or `customers/:customerId`.

### Link between pages

Always use the project's `Link` component:

```tsx
import Link from 'src/components/Link';
```

This component handles application paths when running within Cogover. Do not import `Link` directly from `react-router-dom`, manually add the application identifier to URLs, or use `<a>` tags to navigate between pages within the module.

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
