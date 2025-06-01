import { AlloraClient } from '@allora/sdk';
import logger from '../config/logger.js';

const client = new AlloraClient({
  apiKey: process.env.ALLORA_API_KEY,
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet'
});

export async function analyzeContractWithAI(code) {
  try {
    const analysis = await client.analyzeContract({
      code,
      language: 'Move'
    });

    return {
      vulnerabilities: analysis.vulnerabilities,
      riskScore: analysis.riskScore,
      summary: analysis.summary,
      recommendations: analysis.recommendations
    };
  } catch (error) {
    logger.error('Allora analysis error:', error);
    throw new Error('Failed to analyze contract with Allora AI');
  }
}

export async function monitorContractActivity(contractAddress) {
  try {
    const monitor = await client.monitorTransactions({
      contractAddress,
      eventTypes: ['Transfer', 'Approval', 'Mint', 'Burn']
    });

    return monitor;
  } catch (error) {
    logger.error('Allora monitoring error:', error);
    throw new Error('Failed to set up contract monitoring');
  }
}

export async function predictContractBehavior(code) {
  try {
    const prediction = await client.queryInference('contract-behavior');
    return prediction;
  } catch (error) {
    logger.error('Allora prediction error:', error);
    throw new Error('Failed to predict contract behavior');
  }
}

export default {
  analyzeContractWithAI,
  monitorContractActivity,
  predictContractBehavior
};