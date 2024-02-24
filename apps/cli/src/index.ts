import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { findUpSync } from "find-up";
import { DoneraIntegrationConfig, doneraIntegrationSchema } from "@donera/integrations";
import { fromZodError } from "zod-validation-error";

function tryLoadConfig(config: unknown): DoneraIntegrationConfig {
  try {
    return doneraIntegrationSchema.parse(config) as DoneraIntegrationConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const validationError = fromZodError(e);
    console.error(validationError.toString());
    process.exit(1);
  }
}

function scriptName() {
  // TODO: append .exe on windows platforms
  return "donera";
}

const CONFIG_FILENAME = "donera.config.ts";
const configPath = findUpSync([CONFIG_FILENAME]);

if (!configPath) {
  console.log(`Failed to find configuration file '${CONFIG_FILENAME}'`);
  process.exit(1);
}

const config = await import(configPath);
const parsedConfig = tryLoadConfig(config);
console.log(parsedConfig);

// probably need to include network? so we can set node provider/explorer?
yargs(hideBin(process.argv))
  .scriptName(scriptName())
  .command({
    command: "run [module]",
    describe: "Runs the supplied module",
    builder: {
      module: {
        choices: ["integrations"],
        demandOption: true,
      },
    },
    // pass config, pass logger? probably just init logger in handler
    handler: (argv) => console.log(argv),
  })
  // log level
  .demandCommand()
  .help()
  .version(`donera version: ${process.env.DONERA_VERSION ?? "TODO"}`)
  .parse();
