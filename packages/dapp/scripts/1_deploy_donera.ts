import { Deployer, DeployFunction } from "@alephium/cli";
import { Donera, DoneraTypes } from "../src/contracts/donera";
import { convertAlphAmountWithDecimals } from "@alephium/web3";

const deploy: DeployFunction = async (deployer: Deployer): Promise<void> => {
  const fundTemplateResult = deployer.getDeployContractResult("Fund");
  const initialFields: DoneraTypes.Fields = {
    selfFundTemplateId: fundTemplateResult.contractInstance.contractId,
    selfOwner: deployer.account.address,
    selfDeadlineLimit: 7889229n, // 3 months
    selfAttoListingFee: convertAlphAmountWithDecimals(2)!,
  };
  const result = await deployer.deployContract(Donera, {
    initialFields,
  });

  console.log("Deployed 'Donera' with initial state");
  console.table(initialFields);
  console.log(`Contract id: ${result.contractInstance.contractId}`);
  console.log(`Contract address: ${result.contractInstance.address}`);
  console.log(`Contract group: ${result.contractInstance.groupIndex}`);
};

export default deploy;
