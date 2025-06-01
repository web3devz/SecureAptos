import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { contracts, vulnerabilities, transactions, reports } = useAppContext();

  // Add demo data for visualization
  useEffect(() => {
    // This would be removed in production and replaced with real data
    if (contracts.length === 0) {
      // Demo data would be added here in a real application
    }
  }, [contracts.length]);

  // Calculate statistics
  const totalContracts = contracts.length;
  const totalVulnerabilities = vulnerabilities.length;
  const criticalVulnerabilities = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highVulnerabilities = vulnerabilities.filter(v => v.severity === 'high').length;
  const mediumVulnerabilities = vulnerabilities.filter(v => v.severity === 'medium').length;
  const lowVulnerabilities = vulnerabilities.filter(v => v.severity === 'low').length;
  
  // Prepare chart data
  const vulnerabilityChartData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [criticalVulnerabilities, highVulnerabilities, mediumVulnerabilities, lowVulnerabilities],
        backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#3B82F6'],
        borderWidth: 0,
      },
    ],
  };

  const contractStatusChartData = {
    labels: ['Deployed', 'Analyzed', 'Draft'],
    datasets: [
      {
        data: [
          contracts.filter(c => c.status === 'deployed').length,
          contracts.filter(c => c.status === 'analyzed').length,
          contracts.filter(c => c.status === 'draft').length
        ],
        backgroundColor: ['#10B981', '#6366F1', '#9CA3AF'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Security Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Contracts</p>
              <p className="text-2xl font-bold">{totalContracts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Vulnerabilities</p>
              <p className="text-2xl font-bold">{totalVulnerabilities}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Audit Reports</p>
              <p className="text-2xl font-bold">{reports.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Transactions</p>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Vulnerability Severity</h2>
          <div className="h-64">
            {totalVulnerabilities > 0 ? (
              <Doughnut 
                data={vulnerabilityChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }} 
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No vulnerability data available
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Contract Status</h2>
          <div className="h-64">
            {totalContracts > 0 ? (
              <Doughnut 
                data={contractStatusChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }} 
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No contract data available
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.slice(0, 5).map((tx) => {
                  const contract = contracts.find(c => c.id === tx.contractId);
                  return (
                    <tr key={tx.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === 'success' ? 'bg-green-100 text-green-800' : 
                          tx.status === 'failed' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.timestamp).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;