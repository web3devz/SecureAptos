import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Contract {
  id: string;
  name: string;
  address?: string;
  code: string;
  deployedAt?: string;
  status: 'draft' | 'deployed' | 'analyzed';
}

interface Vulnerability {
  id: string;
  contractId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  recommendation: string;
}

interface Transaction {
  id: string;
  contractId: string;
  hash: string;
  type: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  from: string;
  to: string;
  value: string;
}

interface Report {
  id: string;
  contractId: string;
  createdAt: string;
  vulnerabilities: Vulnerability[];
  riskScore: number;
  summary: string;
}

interface AppContextType {
  contracts: Contract[];
  vulnerabilities: Vulnerability[];
  transactions: Transaction[];
  reports: Report[];
  addContract: (contract: Omit<Contract, 'id'>) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  addVulnerability: (vulnerability: Omit<Vulnerability, 'id'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addReport: (report: Omit<Report, 'id'>) => void;
  selectedContract: Contract | null;
  setSelectedContract: (contract: Contract | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const addContract = (contract: Omit<Contract, 'id'>) => {
    const newContract = {
      ...contract,
      id: `contract-${Date.now()}`
    };
    setContracts([...contracts, newContract]);
  };

  const updateContract = (id: string, updates: Partial<Contract>) => {
    setContracts(contracts.map(contract => 
      contract.id === id ? { ...contract, ...updates } : contract
    ));
  };

  const addVulnerability = (vulnerability: Omit<Vulnerability, 'id'>) => {
    const newVulnerability = {
      ...vulnerability,
      id: `vuln-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setVulnerabilities([...vulnerabilities, newVulnerability]);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setTransactions([...transactions, newTransaction]);
  };

  const addReport = (report: Omit<Report, 'id'>) => {
    const newReport = {
      ...report,
      id: `report-${Date.now()}`
    };
    setReports([...reports, newReport]);
  };

  return (
    <AppContext.Provider
      value={{
        contracts,
        vulnerabilities,
        transactions,
        reports,
        addContract,
        updateContract,
        addVulnerability,
        addTransaction,
        addReport,
        selectedContract,
        setSelectedContract
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};