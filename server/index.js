import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import logger from './config/logger.js';
import openai from './services/openai.js';
import aptos from './services/aptos.js';
import allora from './services/allora.js';

dotenv.config();

// Initialize Express app with security middleware
const app = express();
const server = http.createServer(app);

// Configure security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : '*'
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Socket.io setup with security options
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Deploy contract endpoint
app.post('/api/deploy', async (req, res) => {
  try {
    const { code, network = 'testnet' } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: 'Contract code is required' });
    }
    
    logger.info(`Deploying contract to ${network}`);
    const result = await aptos.deployContract(code, network);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Deployment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to deploy contract'
    });
  }
});

// Analyze contract endpoint with Allora AI
app.post('/api/analyze', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: 'Contract code is required' });
    }
    
    // Perform AI analysis using both OpenAI and Allora
    const [openaiAnalysis, alloraAnalysis] = await Promise.all([
      openai.analyzeContract(code),
      allora.analyzeContractWithAI(code)
    ]);
    
    // Combine and enhance analysis results
    const combinedAnalysis = {
      vulnerabilities: [...openaiAnalysis.vulnerabilities, ...alloraAnalysis.vulnerabilities],
      riskScore: Math.max(openaiAnalysis.riskScore, alloraAnalysis.riskScore),
      summary: `${openaiAnalysis.summary}\n\nAllora AI Analysis:\n${alloraAnalysis.summary}`,
      recommendations: alloraAnalysis.recommendations
    };
    
    res.json({
      success: true,
      ...combinedAnalysis
    });
  } catch (error) {
    logger.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze contract'
    });
  }
});

// Predict contract behavior endpoint
app.post('/api/predict', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: 'Contract code is required' });
    }
    
    const prediction = await allora.predictContractBehavior(code);
    
    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    logger.error('Prediction error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to predict contract behavior'
    });
  }
});

// Socket.IO for real-time transaction monitoring
io.on('connection', (socket) => {
  logger.info('Client connected');
  let cleanupMonitoring = null;
  
  socket.on('monitor', async (data) => {
    const { contractAddress, network = 'testnet' } = data;
    
    if (!contractAddress) {
      socket.emit('error', { message: 'Contract address is required' });
      return;
    }
    
    // Stop any existing monitoring
    if (cleanupMonitoring) {
      cleanupMonitoring();
    }
    
    try {
      // Set up both Aptos and Allora monitoring
      const [aptosCleanup, alloraMonitor] = await Promise.all([
        aptos.monitorTransactions(
          contractAddress,
          (transaction) => {
            socket.emit('transaction', transaction);
          },
          network
        ),
        allora.monitorContractActivity(contractAddress)
      ]);
      
      // Handle Allora events
      alloraMonitor.on('event', (event) => {
        socket.emit('alloraEvent', event);
      });
      
      cleanupMonitoring = () => {
        aptosCleanup();
        alloraMonitor.stop();
      };
    } catch (error) {
      logger.error('Monitoring setup error:', error);
      socket.emit('error', { message: 'Failed to set up monitoring' });
    }
  });
  
  socket.on('disconnect', () => {
    if (cleanupMonitoring) {
      cleanupMonitoring();
    }
    logger.info('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Deployer account address: ${aptos.deployerAccount.address().hex()}`);
});