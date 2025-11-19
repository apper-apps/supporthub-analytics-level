import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <ApperIcon name="AlertCircle" size={64} className="text-blue-600 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="text-xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-600 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Go Home
          </Link>
          
          <div className="text-sm text-gray-500">
            or try one of these links:
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/apps" className="text-blue-600 hover:text-blue-800 font-medium">
              Applications
            </Link>
            <Link to="/users" className="text-blue-600 hover:text-blue-800 font-medium">
              Users
            </Link>
            <Link to="/logs" className="text-blue-600 hover:text-blue-800 font-medium">
              AI Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;