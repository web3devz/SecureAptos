import { AlloraAPIClient, ChainSlug, PriceInferenceToken, PriceInferenceTimeframe } from '@alloralabs/allora-sdk/v2';
import logger from '../config/logger.js';

const client = new AlloraAPIClient({
  apiKey: process.env.ALLORA_API_KEY,
  chainSlug: process.env.NODE_ENV === 'production' ? ChainSlug.MAINNET : ChainSlug.TESTNET,
});

export async function getAlloraTopics() {
  try {
    const topics = await client.getAllTopics();
    return topics;
  } catch (error) {
    logger.error('Failed to fetch Allora topics:', error);
    throw new Error('Failed to fetch Allora topics');
  }
}

export async function getInferenceByTopicID(topicID) {
  try {
    const inference = await client.getInferenceByTopicID(topicID);
    return inference;
  } catch (error) {
    logger.error(`Failed to fetch inference for topic ${topicID}:`, error);
    throw new Error('Failed to fetch topic inference');
  }
}

export async function getPriceInference(token = PriceInferenceToken.BTC, timeframe = PriceInferenceTimeframe.EIGHT_HOURS) {
  try {
    const price = await client.getPriceInference(token, timeframe);
    return price;
  } catch (error) {
    logger.error('Failed to fetch price inference:', error);
    throw new Error('Failed to fetch price inference');
  }
}

export default {
  getAlloraTopics,
  getInferenceByTopicID,
  getPriceInference,
};
