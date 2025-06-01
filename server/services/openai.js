import OpenAI from 'openai';
import logger from '../config/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeContract(code) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Move smart contract security auditor. Analyze the provided contract for vulnerabilities, focusing on security issues specific to Move and the Aptos blockchain. Consider access control, resource management, arithmetic operations, and other common attack vectors."
        },
        {
          role: "user",
          content: `Analyze this Move smart contract for security vulnerabilities:\n\n${code}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const analysis = completion.choices[0].message.content;
    
    // Parse the analysis to extract structured information
    const vulnerabilities = extractVulnerabilities(analysis);
    const riskScore = calculateRiskScore(vulnerabilities);
    
    return {
      vulnerabilities,
      riskScore,
      summary: analysis
    };
  } catch (error) {
    logger.error('OpenAI API error:', error);
    throw new Error('Failed to analyze contract with AI');
  }
}

function extractVulnerabilities(analysis) {
  // Implement vulnerability extraction logic based on AI response
  // This is a placeholder - you would need to implement proper parsing
  const vulnerabilities = [];
  
  // Example parsing logic (you would need to adapt this based on your AI's output format)
  const sections = analysis.split('\n\n');
  for (const section of sections) {
    if (section.toLowerCase().includes('vulnerability') || 
        section.toLowerCase().includes('issue') ||
        section.toLowerCase().includes('risk')) {
      
      // Attempt to determine severity
      let severity = 'medium';
      if (section.toLowerCase().includes('critical')) severity = 'critical';
      else if (section.toLowerCase().includes('high')) severity = 'high';
      else if (section.toLowerCase().includes('low')) severity = 'low';
      
      vulnerabilities.push({
        type: 'Security Issue',
        severity,
        description: section,
        location: 'Contract Analysis',
        recommendation: 'Review AI suggestions and implement security improvements'
      });
    }
  }
  
  return vulnerabilities;
}

function calculateRiskScore(vulnerabilities) {
  // Calculate risk score based on vulnerability severity
  const weights = {
    critical: 30,
    high: 15,
    medium: 7,
    low: 3
  };
  
  let score = 0;
  for (const vuln of vulnerabilities) {
    score += weights[vuln.severity] || 0;
  }
  
  // Normalize score to 0-100 range
  return Math.min(100, score);
}

export default {
  analyzeContract
};