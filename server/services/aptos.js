import { AptosClient, AptosAccount, HexString } from 'aptos';
import logger from '../config/logger.js';

// Network configurations
const NETWORKS = {
  mainnet: {
    nodeUrl: 'https://fullnode.mainnet.aptoslabs.com/v1',
  },
  testnet: {
    nodeUrl: 'https://fullnode.testnet.aptoslabs.com/v1',
  },
  devnet: {
    nodeUrl: 'https://fullnode.devnet.aptoslabs.com/v1',
  }
};

// Initialize Aptos client based on network
const getAptosClient = (network = 'testnet') => {
  const config = NETWORKS[network] || NETWORKS.testnet;
  return new AptosClient(config.nodeUrl);
};

// Create deployer account from private key
const PRIVATE_KEY = 'ed25519-priv-0x1c430f72d262ab89d2fd17dc8b7e971d6c56bf56cb6b5d1b82ec9907503c79ff';
const deployerAccount = new AptosAccount(new HexString(PRIVATE_KEY).toUint8Array());

export async function deployContract(moduleCode, network = 'testnet') {
  try {
    const client = getAptosClient(network);
    logger.info(`Deploying contract to ${network} with account: ${deployerAccount.address().hex()}`);

    // Prepare the module payload
    const payload = {
      type: 'module_bundle_payload',
      modules: [
        { bytecode: moduleCode }
      ],
    };

    // Generate, sign, and submit transaction
    const rawTxn = await client.generateTransaction(deployerAccount.address(), payload);
    const signedTxn = await client.signTransaction(deployerAccount, rawTxn);
    const pendingTxn = await client.submitTransaction(signedTxn);
    
    // Wait for transaction confirmation
    const txnResult = await client.waitForTransaction(pendingTxn.hash);

    logger.info(`Contract deployed successfully. Transaction hash: ${pendingTxn.hash}`);
    
    return {
      success: true,
      address: deployerAccount.address().hex(),
      txHash: pendingTxn.hash,
      status: txnResult.status
    };
  } catch (error) {
    logger.error('Contract deployment failed:', error);
    throw new Error(`Failed to deploy contract: ${error.message}`);
  }
}

export async function getAccountResources(address, network = 'testnet') {
  try {
    const client = getAptosClient(network);
    return await client.getAccountResources(address);
  } catch (error) {
    logger.error('Failed to get account resources:', error);
    throw error;
  }
}

export async function getAccountTransactions(address, network = 'testnet') {
  try {
    const client = getAptosClient(network);
    return await client.getAccountTransactions(address);
  } catch (error) {
    logger.error('Failed to get account transactions:', error);
    throw error;
  }
}

export async function monitorTransactions(address, callback, network = 'testnet') {
  const client = getAptosClient(network);
  let lastTxVersion = '0';

  // Poll for new transactions
  const interval = setInterval(async () => {
    try {
      const transactions = await client.getAccountTransactions(address, {
        start: parseInt(lastTxVersion)
      });

      for (const tx of transactions) {
        lastTxVersion = tx.version;
        callback({
          hash: tx.hash,
          type: tx.type,
          status: tx.success ? 'success' : 'failed',
          timestamp: tx.timestamp,
          from: tx.sender,
          to: address,
          value: tx.payload?.arguments?.[0] || '0'
        });
      }
    } catch (error) {
      logger.error('Transaction monitoring error:', error);
    }
  }, 5000); // Poll every 5 seconds

  return () => clearInterval(interval);
}

export default {
  deployContract,
  getAccountResources,
  getAccountTransactions,
  monitorTransactions,
  deployerAccount
};