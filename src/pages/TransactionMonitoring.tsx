import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ContractSelector from '../components/ContractSelector';
import TransactionList from '../components/TransactionList';
import { Activity, RefreshCw } from 'lucide-react';

const TransactionMonitoring: React.FC = () => {
  const { selectedContract, addTransaction } = useAppContext();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
      }
    };
  }, [monitoringInterval]);

  const startMonitoring = () => {
    if (!selectedContract) return;
    
    setIsMonitoring(true);
    
    // Simulate real-time transaction monitoring with random transactions
    const interval = setInterval(() => {
      if (!selectedContract) return;
      
      const txTypes = ['transfer', 'call', 'deploy', 'execute'];
      const txStatuses = ['success', 'pending', 'failed'];
      
      const randomTx = {
        contractId: selectedContract.id,
        hash: `0x${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
        type: txTypes[Math.floor(Math.random() * txTypes.length)],
        status: txStatuses[Math.floor(Math.random() * txStatuses.length)] as 'pending' | 'success' | 'failed',
        timestamp: new Date().toISOString(),
        from: `0x${Math.random().toString(36).substring(2, 10)}`,
        to: selectedContract.address || `0x${Math.random().toString(36).substring(2, 10)}`,
        value: `${(Math.random() * 10).toFixed(4)} APT`
      };
      
      addTransaction(randomTx);
    }, 5000); // Add a new transaction every 5 seconds
    
    setMonitoringInterval(interval);
  };

  const stopMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
    setIsMonitoring(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transaction Monitoring</h1>
      
      <ContractSelector />
      
      {selectedContract ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{selectedContract.name}</h2>
                {selectedContract.address && (
                  <p className="text-sm text-gray-600 font-mono mt-1">{selectedContract.address}</p>
                )}
              </div>
              <div>
                {isMonitoring ? (
                  <button
                    onClick={stopMonitoring}
                    className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Stop Monitoring
                  </button>
                ) : (
                  <button
                    onClick={startMonitoring}
                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                  >
                    <Activity className="h-5 w-5 mr-2" />
                    Start Monitoring
                  </button>
                )}
              </div>
            </div>
            
            {isMonitoring && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center">
                <RefreshCw className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
                <p className="text-blue-700 text-sm">
                  Actively monitoring transactions for {selectedContract.name}
                </p>
              </div>
            )}
          </div>
          
          <TransactionList />
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mb-4">
            <Activity className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Contract Selected</h2>
          <p className="text-gray-600 mb-4">
            Please select a contract from the dropdown above to monitor its transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionMonitoring;