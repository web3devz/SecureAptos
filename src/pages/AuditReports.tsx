import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ReportCard from '../components/ReportCard';
import { FileText, Download, ArrowLeft } from 'lucide-react';

const AuditReports: React.FC = () => {
  const { reports, contracts, vulnerabilities } = useAppContext();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  
  const handleViewReport = (reportId: string) => {
    setSelectedReport(reportId);
  };
  
  const handleBackToList = () => {
    setSelectedReport(null);
  };
  
  const currentReport = selectedReport 
    ? reports.find(r => r.id === selectedReport)
    : null;
    
  const reportContract = currentReport 
    ? contracts.find(c => c.id === currentReport.contractId)
    : null;
    
  const reportVulnerabilities = currentReport 
    ? vulnerabilities.filter(v => v.contractId === currentReport.contractId)
    : [];
    
  const getSeverityCount = (severity: string) => {
    return reportVulnerabilities.filter(v => v.severity === severity).length;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Reports</h1>
      
      {!selectedReport ? (
        <>
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map(report => {
                const contract = contracts.find(c => c.id === report.contractId);
                const vulnCount = vulnerabilities.filter(v => v.contractId === report.contractId).length;
                
                return (
                  <ReportCard
                    key={report.id}
                    id={report.id}
                    contractName={contract?.name || 'Unknown Contract'}
                    createdAt={report.createdAt}
                    vulnerabilityCount={vulnCount}
                    riskScore={report.riskScore}
                    onClick={() => handleViewReport(report.id)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4">
                <FileText className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Audit Reports</h2>
              <p className="text-gray-600 mb-4">
                Analyze a contract in the Vulnerability Detection section to generate an audit report.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Reports
            </button>
            
            <button className="flex items-center text-blue-600 hover:text-blue-800">
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">
                Security Audit Report: {reportContract?.name || 'Unknown Contract'}
              </h2>
              <p className="text-sm text-gray-600">
                Generated on {currentReport ? new Date(currentReport.createdAt).toLocaleString() : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p className="text-sm text-gray-600">Risk Score</p>
                <p className={`text-2xl font-bold ${
                  (currentReport?.riskScore || 0) > 70 ? 'text-red-600' :
                  (currentReport?.riskScore || 0) > 40 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {currentReport?.riskScore || 0}/100
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{getSeverityCount('critical')}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p className="text-sm text-gray-600">High</p>
                <p className="text-2xl font-bold text-orange-600">{getSeverityCount('high')}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p className="text-sm text-gray-600">Medium/Low</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {getSeverityCount('medium') + getSeverityCount('low')}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">
                  {currentReport?.summary || 'No summary available.'}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Vulnerabilities</h3>
              {reportVulnerabilities.length > 0 ? (
                <div className="space-y-4">
                  {reportVulnerabilities.map(vuln => (
                    <div key={vuln.id} className={`border rounded-md p-4 ${
                      vuln.severity === 'critical' ? 'border-red-300 bg-red-50' :
                      vuln.severity === 'high' ? 'border-orange-300 bg-orange-50' :
                      vuln.severity === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                      'border-blue-300 bg-blue-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{vuln.type}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${
                          vuln.severity === 'critical' ? 'bg-red-200 text-red-800' :
                          vuln.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                          vuln.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{vuln.description}</p>
                      <div className="mb-2">
                        <p className="text-xs font-semibold">Location:</p>
                        <code className="text-xs bg-white bg-opacity-50 p-1 rounded block">{vuln.location}</code>
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Recommendation:</p>
                        <p className="text-xs">{vuln.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-800">No vulnerabilities detected.</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Implement proper access control mechanisms for all sensitive operations.</li>
                  <li>Use Move's type system to enforce invariants and prevent resource misuse.</li>
                  <li>Add comprehensive tests for all contract functions, especially edge cases.</li>
                  <li>Consider formal verification for critical contract components.</li>
                  <li>Follow the principle of least privilege when designing contract permissions.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditReports;