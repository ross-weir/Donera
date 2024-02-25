# `@donera/cli`

> Some information here is WIP and is definently not resillient or prod ready

This package contains the `Donera` cli application. The cli is a general purpose application anyone can use to run off-chain supporting infrastructure or pushing live updates to social media integrations, for example.

## Installation

The cli can be installed via NPM (soon) like so:

```sh
npm install @donera/cli
```

You can then verify your installation:

```sh
npx @donera/cli --version
```

## Configuration

Configuration is done via a `typescript` (todo, explain js took) configuration file called `donera.config.ts`.

Config file discovery uses the standard search parent approach, `Donera` will look for the config file starting in the current directory searching parent directories until the config file is found or the search reaches the root directory.

Example:

```ts
import { DoneraConfig } from "@donera/cli";

const config: DoneraConfig = {
  networkId: "devnet",
  integrations: {
    services: {
      discord: {},
    },
    filters: {},
  },
};

// a single `DoneraConfig` object is exported as `default`
export default config;
```

## Modules

The cli contains modules that are used to run various off-chain infrastructure and services.

### Integrations

The integrations module is used to publish live updates to various services such as discord and 𝕏.

The `Donera` cli can be configured to only watch configured fundraisers.

For example, a business might configure the CLI to only watch fundraisers created by them and push the updates to 𝕏.

```ts
import { DoneraConfig } from "@donera/cli";

const onlyMyFund = async ({ fundContractId }: { fundContractId: string }) =>
  fundContractId !== process.env.MY_FUND_ID;

const config: DoneraConfig = {
  networkId: "devnet",
  integrations: {
    services: {
      discord: { webhooks: ["MY_DISCORD_WEBHOOK"] },
    },
    filters: {
      // if a preddicate returns `true` the event will be filtered out and not passed to the services
      donation: [onlyMyFund],
      finalization: [onlyMyFund],
    },
  },
};

export default config;
```

Now run the integration module in the directory containing your `donera.config.ts` file:

```sh
npx @donera/cli run integrations
```
