import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:3001/api';

// Socket.io connection
let socket: any = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3001');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Contract deployment
export const deployContract = async (code: string, network: string = 'testnet') => {
  try {
    const response = await axios.post(`${API_URL}/deploy`, { code, network });
    return response.data;
  } catch (error) {
    console.error('Error deploying contract:', error);
    throw error;
  }
};

// Contract analysis
export const analyzeContract = async (code: string, contractId: string) => {
  try {
    const response = await axios.post(`${API_URL}/analyze`, { code, contractId });
    return response.data;
  } catch (error) {
    console.error('Error analyzing contract:', error);
    throw error;
  }
};

// Transaction monitoring
export const startMonitoring = (contractAddress: string, callback: (transaction: any) => void) => {
  const socket = connectSocket();
  
  socket.emit('monitor', { contractAddress });
  
  socket.on('transaction', (transaction: any) => {
    callback(transaction);
  });
  
  socket.on('error', (error: any) => {
    console.error('Socket error:', error);
  });
  
  return () => {
    socket.emit('stop-monitoring');
  };
};

// Mock functions for demo purposes
export const mockDeployContract = async (code: string, network: string = 'testnet') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a random address
  const address = `0x${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
  
  return {
    success: true,
    address,
    message: 'Contract deployed successfully'
  };
};

export const mockAnalyzeContract = async (code: string, contractId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock vulnerabilities based on common Move contract issues
  const vulnerabilities = [
    {
      contractId,
      type: 'Unauthorized Access',
      severity: 'critical',
      description: 'The contract does not properly check authorization for critical operations.',
      location: 'MyModule::transfer_tokens',
      recommendation: 'Implement proper access control checks using Aptos account-based authentication.'
    },
    {
      contractId,
      type: 'Resource Leak',
      severity: 'high',
      description: 'Resources are not properly handled, potentially leading to locked assets.',
      location: 'MyModule::initialize',
      recommendation: 'Ensure all resources are properly created and destroyed.'
    },
    {
      contractId,
      type: 'Integer Overflow',
      severity: 'medium',
      description: 'Arithmetic operations do not check for potential overflows.',
      location: 'MyModule::calculate_rewards',
      recommendation: 'Use Move\'s checked arithmetic operations or implement bounds checking.'
    },
    {
      contractId,
      type: 'Reentrancy',
      severity: 'low',
      description: 'Potential reentrancy vulnerability in external calls.',
      location: 'MyModule::external_interaction',
      recommendation: 'Implement checks-effects-interactions pattern and use reentrancy guards.'
    }
  ];
  
  return {
    success: true,
    vulnerabilities,
    riskScore: 65,
    summary: 'The contract has several security issues that need to be addressed before deployment to production.'
  };
};

export const mockStartMonitoring = (contractAddress: string, callback: (transaction: any) => void) => {
  const txTypes = ['transfer', 'call', 'deploy', 'execute'];
  const txStatuses = ['success', 'pending', 'failed'];
  
  // Simulate transaction events
  const interval = setInterval(() => {
    const randomTx = {
      hash: `0x${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      type: txTypes[Math.floor(Math.random() * txTypes.length)],
      status: txStatuses[Math.floor(Math.random() * txStatuses.length)],
      timestamp: new Date().toISOString(),
      from: `0x${Math.random().toString(36).substring(2, 10)}`,
      to: contractAddress,
      value: `${(Math.random() * 10).toFixed(4)} APT`
    };
    
    callback(randomTx);
  }, 5000);
  
  // Return a cleanup function
  return () => clearInterval(interval);
};