import React from 'react';
import { useAppContext } from '../context/AppContext';

const ContractSelector: React.FC = () => {
  const { contracts, selectedContract, setSelectedContract } = useAppContext();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <label htmlFor="contractSelector" className="block text-sm font-medium text-gray-700 mb-2">
        Select Contract
      </label>
      <select
        id="contractSelector"
        value={selectedContract?.id || ''}
        onChange={(e) => {
          const selected = contracts.find(c => c.id === e.target.value) || null;
          setSelectedContract(selected);
        }}
        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a contract</option>
        {contracts.map((contract) => (
          <option key={contract.id} value={contract.id}>
            {contract.name} {contract.address ? `(${contract.address.substring(0, 8)}...)` : '(Draft)'}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ContractSelector;