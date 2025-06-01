import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Search, 
  Activity, 
  FileText, 
  ShieldAlert 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-8 w-8 text-blue-400" />
          <h1 className="text-xl font-bold">Aptos Security Auditor</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/deploy" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <Upload className="h-5 w-5 mr-3" />
              Contract Deployment
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/analyze" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <Search className="h-5 w-5 mr-3" />
              Vulnerability Detection
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/monitor" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <Activity className="h-5 w-5 mr-3" />
              Transaction Monitoring
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/reports" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <FileText className="h-5 w-5 mr-3" />
              Audit Reports
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="font-bold">AI</span>
          </div>
          <div>
            <p className="text-sm font-medium">AI Security Agent</p>
            <p className="text-xs text-gray-400">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;