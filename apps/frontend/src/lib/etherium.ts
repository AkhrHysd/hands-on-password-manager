// 必要な型定義をインポートします
import Web3 from 'web3';
import AbiItem from 'web3';
import { Contract } from 'web3-eth-contract';

// スマートコントラクトのJSONファイルをインポートします
import SimpleStorage from '../contracts/SimpleStorage.json';

declare global {
  interface Window {
    ethereum: any;
  }
}
// Web3インスタンスを生成します（これはMetaMaskのプロバイダーを使用する例です）
let web3: Web3 = new Web3(window.ethereum as any);

// スマートコントラクトのインスタンスを生成する関数を定義します
export const getContractInstance = async (): Promise<Contract<any>> => {
  // ユーザーにアカウントへのアクセスを要求します
  await window.ethereum.enable();

  // コントラクトのインスタンスを生成します
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = SimpleStorage.networks[networkId];
  const contractInstance = new web3.eth.Contract(
    SimpleStorage.abi as AbiItem[],
    deployedNetwork && deployedNetwork.address,
  );

  return contractInstance;
};

// スマートコントラクトとの対話を行うための関数を提供します
export const setValue = async (contract: Contract, value: number): Promise<void> => {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.set(value).send({ from: accounts[0] });
};

export const getValue = async (contract: Contract): Promise<number> => {
  const value = await contract.methods.get().call();
  return parseInt(value, 10);
};