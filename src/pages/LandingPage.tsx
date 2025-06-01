import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Activity, FileText, ArrowRight, Code, Zap, Lock, CheckCircle, Github, Twitter, Linkedin } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center">
          <div className="animate-float mb-8">
            <Shield className="h-20 w-20 text-blue-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            SecureAptos
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl animate-fade-in-delay">
            Powered by Allora AI and built for Aptos blockchain, SecureAptos provides enterprise-grade 
            security analysis and real-time monitoring for Move smart contracts. Protect your assets with 
            next-generation vulnerability detection.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-delay-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg 
                       flex items-center transition-all duration-300 transform hover:scale-105"
            >
              Launch Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/analyze')}
              className="bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 
                       font-bold py-4 px-8 rounded-lg flex items-center transition-all duration-300"
            >
              Try Demo
              <Code className="ml-2 h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Aptos-native Security
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Allora AI Integration
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Real-time Monitoring
            </div>
          </div>
        </div>
      </div>

      {/* Aptos & Allora Integration Section */}
      <div className="container mx-auto px-6 py-20 border-t border-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in">
            Powered by Aptos & Allora
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto animate-fade-in-delay">
            Combining Aptos's high-performance blockchain with Allora's advanced AI capabilities 
            for unparalleled smart contract security.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-800/50 rounded-xl p-8 backdrop-blur-sm animate-slide-up">
            <div className="bg-blue-600/20 rounded-lg p-4 inline-block mb-6">
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Aptos Integration</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 text-blue-400 mt-1" />
                <span>Native Move language support with specialized security patterns</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 text-blue-400 mt-1" />
                <span>High-throughput transaction monitoring and analysis</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 text-blue-400 mt-1" />
                <span>Resource-aware security checks for Move's ownership model</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-8 backdrop-blur-sm animate-slide-up-delay">
            <div className="bg-purple-600/20 rounded-lg p-4 inline-block mb-6">
              <Lock className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Allora AI Security</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 text-purple-400 mt-1" />
                <span>AI-powered vulnerability detection with predictive analysis</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 text-purple-400 mt-1" />
                <span>Real-time contract behavior monitoring and anomaly detection</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 text-purple-400 mt-1" />
                <span>Advanced pattern recognition for zero-day vulnerability prevention</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-all duration-300 animate-slide-up">
            <div className="bg-blue-600 rounded-lg p-3 inline-block mb-6">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-400">
              Leverage Allora's advanced AI models to detect vulnerabilities, predict potential 
              exploits, and provide actionable security recommendations for your Move contracts.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-all duration-300 animate-slide-up-delay">
            <div className="bg-green-600 rounded-lg p-3 inline-block mb-6">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Real-time Monitoring
            </h3>
            <p className="text-gray-400">
              Monitor contract activities on Aptos blockchain with instant alerts for suspicious 
              behavior and automated response mechanisms to prevent potential attacks.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-all duration-300 animate-slide-up-delay-2">
            <div className="bg-purple-600 rounded-lg p-3 inline-block mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Detailed Reports
            </h3>
            <p className="text-gray-400">
              Generate comprehensive security reports with AI-enhanced insights, vulnerability 
              assessments, and specific recommendations for your Move smart contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold text-white">SecureAptos</span>
              </div>
              <p className="text-gray-400 text-sm">
                Next-generation security analysis for Move smart contracts on the Aptos blockchain.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SecureAptos. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;