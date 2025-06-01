// This is a simplified mock implementation of a Move code analyzer
// In a real application, this would be much more sophisticated and likely
// would be implemented on the backend with proper parsing and analysis tools

export interface AnalysisResult {
  vulnerabilities: Vulnerability[];
  riskScore: number;
  summary: string;
}

export interface Vulnerability {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  location: string;
  recommendation: string;
}

// Common Move vulnerability patterns to check for
const vulnerabilityPatterns = [
  {
    pattern: /public\s+fun/g,
    type: 'Access Control',
    severity: 'medium',
    description: 'Public functions may allow unauthorized access',
    recommendation: 'Consider using access control modifiers or explicit checks'
  },
  {
    pattern: /assert\!/g,
    type: 'Error Handling',
    severity: 'low',
    description: 'Using assert! for validation may abort the transaction without proper error handling',
    recommendation: 'Consider using more specific error codes and handling'
  },
  {
    pattern: /borrow_global_mut/g,
    type: 'Mutable Global State',
    severity: 'medium',
    description: 'Mutable global state can lead to reentrancy vulnerabilities',
    recommendation: 'Ensure proper checks before and after mutable operations'
  },
  {
    pattern: /copy|move_from/g,
    type: 'Resource Management',
    severity: 'high',
    description: 'Improper resource handling can lead to resource leaks',
    recommendation: 'Ensure resources are properly created and destroyed'
  }
];

// Critical vulnerability patterns
const criticalPatterns = [
  {
    pattern: /signer::address_of.*==.*address/g,
    type: 'Authorization Bypass',
    severity: 'critical',
    description: 'Potential authorization bypass vulnerability',
    recommendation: 'Use proper authorization checks with Aptos account-based authentication'
  },
  {
    pattern: /while|loop/g,
    type: 'Infinite Loop',
    severity: 'critical',
    description: 'Potential infinite loop that could exhaust gas',
    recommendation: 'Ensure all loops have proper termination conditions'
  }
];

export const analyzeCode = (code: string): AnalysisResult => {
  const vulnerabilities: Vulnerability[] = [];
  
  // Check for common vulnerabilities
  vulnerabilityPatterns.forEach(({ pattern, type, severity, description, recommendation }) => {
    const matches = code.match(pattern);
    if (matches && matches.length > 0) {
      // Find the location of the first match
      const lines = code.split('\n');
      let lineNumber = 0;
      let found = false;
      
      for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
          lineNumber = i + 1;
          found = true;
          break;
        }
      }
      
      if (found) {
        vulnerabilities.push({
          type,
          severity,
          description,
          location: `Line ${lineNumber}`,
          recommendation
        });
      }
    }
  });
  
  // Check for critical vulnerabilities
  criticalPatterns.forEach(({ pattern, type, severity, description, recommendation }) => {
    const matches = code.match(pattern);
    if (matches && matches.length > 0) {
      // Find the location of the first match
      const lines = code.split('\n');
      let lineNumber = 0;
      let found = false;
      
      for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
          lineNumber = i + 1;
          found = true;
          break;
        }
      }
      
      if (found) {
        vulnerabilities.push({
          type,
          severity,
          description,
          location: `Line ${lineNumber}`,
          recommendation
        });
      }
    }
  });
  
  // Calculate risk score based on vulnerabilities
  let riskScore = 0;
  if (vulnerabilities.length > 0) {
    const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
    const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
    const mediumCount = vulnerabilities.filter(v => v.severity === 'medium').length;
    const lowCount = vulnerabilities.filter(v => v.severity === 'low').length;
    
    riskScore = Math.min(
      100,
      criticalCount * 30 + highCount * 15 + mediumCount * 7 + lowCount * 3
    );
  }
  
  // Generate summary
  let summary = '';
  if (vulnerabilities.length === 0) {
    summary = 'No vulnerabilities detected. The contract appears to be secure.';
  } else if (riskScore > 70) {
    summary = 'Critical security issues detected. This contract is not safe for deployment.';
  } else if (riskScore > 40) {
    summary = 'Significant security issues found. Address these vulnerabilities before deployment.';
  } else {
    summary = 'Minor security concerns detected. Consider addressing these issues for improved security.';
  }
  
  return {
    vulnerabilities,
    riskScore,
    summary
  };
};

// Sample Move code for testing
export const sampleMoveCode = `
module MyToken {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::account;
    
    struct MyToken has key {}
    
    struct TokenStore has key {
        balance: u64
    }
    
    public fun initialize(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<TokenStore>(addr)) {
            move_to(account, TokenStore { balance: 0 });
        }
    }
    
    public fun transfer(from: &signer, to: address, amount: u64) {
        let addr = signer::address_of(from);
        let from_store = borrow_global_mut<TokenStore>(addr);
        assert!(from_store.balance >= amount, 1);
        from_store.balance = from_store.balance - amount;
        
        let to_store = borrow_global_mut<TokenStore>(to);
        to_store.balance = to_store.balance + amount;
    }
}
`;