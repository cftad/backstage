---
id: creating
title: Creating Utility APIs
sidebar_label: Creating APIs
# prettier-ignore
description: Creating new utility APIs in your plugins and app
---

## When to make a utility API

> TODO

## Creating the Utility API contract

The first step toward exposing a utility API is to define its TypeScript contract, and an API ref for consumers to find it via. This should be done in [your plugin's `-react` package](../../architecture-decisions/adr011-plugin-package-structure.md), so that it can be imported by other plugins. In this example, we have an Example plugin that wants to expose a utility API for performing some type of work.

```tsx title="in @internal/plugin-example-react"
import { createApiRef } from '@backstage/frontend-plugin-api';

/**
 * Performs some work.
 * @oublic
 */
export interface WorkApi {
  doWork(): Promise<void>;
}

/**
 * The work interface for the Example plugin.
 * @public
 */
export const workApiRef = createApiRef<WorkApi>({
  id: 'plugin.example.work',
});
```

Both of these are properly exported publicly from the package, so that consumers can reach them.

The plugin itself now wants to provide this API and its default implementation, in the form of an API extension. Doing so means that when users install the Example plugin, an instance of the Work utility API will also be automatically available in their apps - both to the Example plugin itself, and to others. We do this in the main plugin package, not the `-react` package.

```tsx title="in @internal/plugin-example"
import {
  createApiExtension,
  createApiFactory,
  createPlugin,
  configApiRef,
  ConfigApi,
} from '@backstage/frontend-plugin-api';
import { WorkApi, workApiRef } from '@internal/plugin-example-react';

class WorkImpl implements WorkApi {
  constructor(options: { configApi: ConfigApi }) {
    /* TODO */
  }
  async doWork() {
    /* TODO */
  }
}

const workApi = createApiExtension({
  api: workApiRef,
  factory: () =>
    createApiFactory({
      api: workApiRef,
      deps: {
        configApi: configApiRef,
      },
      factory: ({ configApi }) => {
        return new WorkImpl({ configApi });
      },
    }),
});

/**
 * The Example plugin.
 * @public
 */
export default createPlugin({
  id: 'example',
  extensions: [workApi],
});
```

For illustration we make a skeleton implementation class and the API extension and factory for it, in the same file. These are not exported to the public surface of the plugin package; only the plugin is, as the default export.

The code also illustrates how the API factory declares a dependency on another utility API - the core config API in this case. An instance of that utility API is then provided to the factory function.

The resulting extension ID of the work API will be the kind `api:` followed by the plugin ID as the namespace, in this case ending up as `api:plugin.example.work`. You can now use this ID to refer to the API in app-config and elsewhere.

## Next steps

See [the Consuming section](./03-consuming.md) to see how to consume this new utility API in various ways. If you wish to learn how to add configurability and inputs to it, check out [the Configuring section](./04-configuring.md).
