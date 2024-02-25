import packageJson from "../package.json";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { findUpSync } from "find-up";
import { fromZodError } from "zod-validation-error";
import { DoneraConfig, doneraConfigSchema } from "./config";
import alephiumConfig from "@donera/alephium-config/default";
import { web3 } from "@alephium/web3";
import * as run from "./cmds/run";

function tryLoadConfig(config: unknown): DoneraConfig {
  try {
    return doneraConfigSchema.parse(config) as DoneraConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const validationError = fromZodError(e);
    console.error(validationError.toString());
    process.exit(1);
  }
}

function setGlobals(config: DoneraConfig) {
  // TODO make nodeurl configurable
  const { nodeUrl } = alephiumConfig.networks[config.networkId];

  web3.setCurrentNodeProvider(nodeUrl);
}

function scriptName() {
  // TODO: append .exe on windows platforms
  return "donera";
}

async function init() {
  const CONFIG_FILENAME = "donera.config.ts";
  const configPath = findUpSync([CONFIG_FILENAME]);

  if (!configPath) {
    console.log(`Failed to find configuration file '${CONFIG_FILENAME}'`);
    process.exit(1);
  }

  const config = (await import(configPath)).default;
  const parsedConfig = tryLoadConfig(config);

  setGlobals(parsedConfig);

  return parsedConfig;
}

yargs(hideBin(process.argv))
  .scriptName(scriptName())
  .command(
    "run [module]",
    "Runs the supplied module",
    function (yargs) {
      return yargs.positional("module", {
        describe: "Runs the supplied module",
        choices: ["integrations"] as const,
        demandOption: true,
      });
    },
    async (argv) => run.handler(argv.module, await init())
  )
  .help()
  .version(`donera version: ${packageJson.version}`)
  .demandCommand()
  .parse();
