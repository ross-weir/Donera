import { Deployer, DeployFunction } from "@alephium/cli";
import { Fund } from "../src/contracts/fund";

const deploy: DeployFunction = async (deployer: Deployer): Promise<void> => {
  const initialFields = Fund.getInitialFieldsWithDefaultValues();
  const result = await deployer.deployContract(Fund, {
    initialFields,
  });

  console.log("Deployed 'Fund' contract template with initial state");
  console.table(initialFields);
  console.log(`Contract id: ${result.contractInstance.contractId}`);
  console.log(`Contract address: ${result.contractInstance.address}`);
  console.log(`Contract group: ${result.contractInstance.groupIndex}`);
};

export default deploy;
