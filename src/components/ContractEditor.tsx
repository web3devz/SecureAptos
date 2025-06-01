import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface ContractEditorProps {
  initialCode?: string;
  onSave: (code: string, name: string) => void;
}

const ContractEditor: React.FC<ContractEditorProps> = ({ initialCode = '', onSave }) => {
  const [code, setCode] = useState(initialCode || '// Enter your Move contract code here\nmodule MyModule {\n    // Your code\n}');
  const [name, setName] = useState('MyContract');

  const handleSave = () => {
    onSave(code, name);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <label htmlFor="contractName" className="block text-sm font-medium text-gray-700 mb-1">
          Contract Name
        </label>
        <input
          type="text"
          id="contractName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="contractCode" className="block text-sm font-medium text-gray-700 mb-1">
          Contract Code
        </label>
        <textarea
          id="contractCode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          spellCheck="false"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Contract
        </button>
      </div>
    </div>
  );
};

export default ContractEditor;