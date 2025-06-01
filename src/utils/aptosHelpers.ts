import { AptosClient, AptosAccount, FaucetClient, Types } from 'aptos';

// Network configurations
const NETWORKS = {
  mainnet: {
    nodeUrl: 'https://fullnode.mainnet.aptoslabs.com/v1',
    faucetUrl: null, // No faucet for mainnet
  },
  testnet: {
    nodeUrl: 'https://fullnode.testnet.aptoslabs.com/v1',
    faucetUrl: 'https://faucet.testnet.aptoslabs.com',
  },
  devnet: {
    nodeUrl: 'https://fullnode.devnet.aptoslabs.com/v1',
    faucetUrl: 'https://faucet.devnet.aptoslabs.com',
  },
};

// Create Aptos client for the specified network
export const createAptosClient = (network: 'mainnet' | 'testnet' | 'devnet' = 'testnet') => {
  const config = NETWORKS[network];
  return new AptosClient(config.nodeUrl);
};

// Create a faucet client (for testnet/devnet only)
export const createFaucetClient = (network: 'testnet' | 'devnet' = 'testnet') => {
  const config = NETWORKS[network];
  if (!config.faucetUrl) {
    throw new Error(`Faucet not available for ${network}`);
  }
  return new FaucetClient(config.nodeUrl, config.faucetUrl);
};

// Create a new Aptos account
export const createAccount = () => {
  return new AptosAccount();
};

// Fund an account with test tokens (testnet/devnet only)
export const fundAccount = async (
  address: string,
  amount: number = 100_000_000,
  network: 'testnet' | 'devnet' = 'testnet'
) => {
  const faucetClient = createFaucetClient(network);
  await faucetClient.fundAccount(address, amount);
};

// Get account resources
export const getAccountResources = async (
  address: string,
  network: 'mainnet' | 'testnet' | 'devnet' = 'testnet'
) => {
  const client = createAptosClient(network);
  return await client.getAccountResources(address);
};

// Get account transactions
export const getAccountTransactions = async (
  address: string,
  network: 'mainnet' | 'testnet' | 'devnet' = 'testnet'
) => {
  const client = createAptosClient(network);
  return await client.getAccountTransactions(address);
};

// Simulate publishing a module
export const simulatePublishModule = async (
  account: AptosAccount,
  moduleHex: string,
  network: 'mainnet' | 'testnet' | 'devnet' = 'testnet'
) => {
  const client = createAptosClient(network);
  
  const payload: Types.TransactionPayload = {
    type: 'module_bundle_payload',
    modules: [
      { bytecode: moduleHex }
    ],
  };
  
  const rawTxn = await client.generateTransaction(account.address(), payload);
  const simulationResult = await client.simulateTransaction(account, rawTxn);
  
  return simulationResult;
};

// Publish a module to the blockchain
export const publishModule = async (
  account: AptosAccount,
  moduleHex: string,
  network: 'mainnet' | 'testnet' | 'devnet' = 'testnet'
) => {
  const client = createAptosClient(network);
  
  const payload: Types.TransactionPayload = {
    type: 'module_bundle_payload',
    modules: [
      { bytecode: moduleHex }
    ],
  };
  
  const rawTxn = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, rawTxn);
  const pendingTxn = await client.submitTransaction(signedTxn);
  const txnResult = await client.waitForTransaction(pendingTxn.hash);
  
  return txnResult;
};

// Get transaction by hash
export const getTransaction = async (
  txnHash: string,
  network: 'mainnet' | 'testnet' | 'devnet' = 'testnet'
) => {
  const client = createAptosClient(network);
  return await client.getTransactionByHash(txnHash);
};

// Mock function to simulate contract compilation
export const mockCompileContract = async (code: string) => {
  // In a real implementation, this would send the code to a Move compiler service
  // For this demo, we'll just simulate a successful compilation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a mock bytecode
  return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
};