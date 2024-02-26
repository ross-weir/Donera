import { Donera, DoneraInstance, loadDeployments } from "@donera/dapp";
import { DoneraConfig } from "../config";
import { DoneraIntegration } from "@donera/integrations";
import pino from "pino";
import { Lifecycle } from "@donera/core";

/** Get Donera instance by address if provided, otherwise fallback to network deployment */
function getDonera(config: DoneraConfig): DoneraInstance {
  const addr = config.doneraAddress;

  if (addr) {
    return Donera.at(addr);
  }

  const deploys = loadDeployments(config.networkId);

  return deploys.contracts.Donera.contractInstance;
}

// TODO: could also run instance.stop() on process exit
let instance: Lifecycle | undefined;

export function handler(module: "integrations", config: DoneraConfig) {
  const logger = pino().child({ module });
  const moduleConfig = config[module];

  if (!moduleConfig) {
    throw new Error(`module config not supplied ${module}`);
  }

  const donera = getDonera(config);
  instance = new DoneraIntegration(moduleConfig, logger, donera);
  logger.info("Starting donera integrations");

  instance.start();
}
