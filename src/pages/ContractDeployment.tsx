import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ContractEditor from '../components/ContractEditor';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

const ContractDeployment: React.FC = () => {
  const { addContract, contracts, updateContract } = useAppContext();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{
    success: boolean;
    message: string;
    address?: string;
  } | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const handleSaveContract = (code: string, name: string) => {
    addContract({
      name,
      code,
      status: 'draft'
    });
    setDeploymentResult(null);
  };

  const handleDeployContract = async () => {
    if (!selectedContractId) return;
    
    const contract = contracts.find(c => c.id === selectedContractId);
    if (!contract) return;
    
    setIsDeploying(true);
    setDeploymentResult(null);
    
    try {
      // Simulate API call to backend for deployment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful deployment
      const mockAddress = `0x${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
      
      updateContract(selectedContractId, {
        status: 'deployed',
        address: mockAddress,
        deployedAt: new Date().toISOString()
      });
      
      setDeploymentResult({
        success: true,
        message: 'Contract deployed successfully',
        address: mockAddress
      });
    } catch (error) {
      setDeploymentResult({
        success: false,
        message: 'Deployment failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contract Deployment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Create New Contract</h2>
          <ContractEditor onSave={handleSaveContract} />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Deploy Contract</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="mb-4">
              <label htmlFor="contractSelect" className="block text-sm font-medium text-gray-700 mb-1">
                Select Contract to Deploy
              </label>
              <select
                id="contractSelect"
                value={selectedContractId || ''}
                onChange={(e) => setSelectedContractId(e.target.value || null)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a contract</option>
                {contracts
                  .filter(c => c.status === 'draft')
                  .map(contract => (
                    <option key={contract.id} value={contract.id}>
                      {contract.name}
                    </option>
                  ))}
              </select>
            </div>
            
            {selectedContractId && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="testnet"
                >
                  <option value="testnet">Aptos Testnet</option>
                  <option value="devnet">Aptos Devnet</option>
                  <option value="mainnet">Aptos Mainnet</option>
                </select>
              </div>
            )}
            
            <button
              onClick={handleDeployContract}
              disabled={!selectedContractId || isDeploying}
              className={`w-full py-2 px-4 flex items-center justify-center rounded-md text-white font-medium ${
                !selectedContractId || isDeploying
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isDeploying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deploying...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Deploy Contract
                </>
              )}
            </button>
            
            {deploymentResult && (
              <div className={`mt-4 p-4 rounded-md ${
                deploymentResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex">
                  {deploymentResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${
                      deploymentResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {deploymentResult.message}
                    </p>
                    {deploymentResult.address && (
                      <p className="text-sm text-gray-600 mt-1">
                        Contract Address: <span className="font-mono">{deploymentResult.address}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-3">Deployed Contracts</h3>
            {contracts.filter(c => c.status === 'deployed').length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deployed At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contracts
                      .filter(c => c.status === 'deployed')
                      .map(contract => (
                        <tr key={contract.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{contract.address}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contract.deployedAt ? new Date(contract.deployedAt).toLocaleString() : 'Unknown'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                No contracts deployed yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDeployment;