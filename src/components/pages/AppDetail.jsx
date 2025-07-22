import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import appService from "@/services/api/appService";
import { toast } from "react-toastify";

const AppDetail = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApp = async () => {
    try {
      setLoading(true);
      setError("");
      const id = parseInt(appId);
      if (isNaN(id)) {
        throw new Error("Invalid app ID");
      }
      const data = await appService.getById(id);
      if (!data) {
        throw new Error("App not found");
      }
      setApp(data);
    } catch (err) {
      setError(err.message || "Failed to load app details");
      toast.error(err.message || "Failed to load app details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApp();
  }, [appId]);

  const handleBack = () => {
    navigate("/apps");
  };

  const handleViewLogs = () => {
    navigate(`/logs?appId=${app.Id}`);
  };

  if (loading) return <Loading type="page" />;
  if (error) return <Error message={error} onRetry={fetchApp} />;
  if (!app) return <Error message="App not found" onRetry={fetchApp} />;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center space-x-2 text-sm text-gray-500"
      >
        <button
          onClick={handleBack}
          className="hover:text-gray-700 flex items-center space-x-1"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          <span>Apps</span>
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900 font-medium">{app.AppName}</span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{app.AppName}</h1>
              <Badge variant="secondary">{app.AppCategory}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">App ID:</span>
                <div className="font-mono text-gray-900">{app.CanvasAppId}</div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Status:</span>
                <div className="mt-1">
                  <StatusBadge status={app.LastChatAnalysisStatus} type="chatAnalysis" />
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Database:</span>
                <div className="flex items-center mt-1">
                  <ApperIcon
                    name={app.IsDbConnected ? "CheckCircle" : "XCircle"}
                    size={16}
                    className={app.IsDbConnected ? "text-green-500" : "text-red-500"}
                  />
                  <span className={`ml-2 ${app.IsDbConnected ? "text-green-600" : "text-red-600"}`}>
                    {app.IsDbConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleViewLogs}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="FileText" size={16} />
              <span>View Logs</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              <span>Back to Apps</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Details Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Activity Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="BarChart3" size={20} className="mr-2" />
            Activity Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Total Messages</span>
              <span className="font-mono font-semibold text-gray-900">
                {app.TotalMessages.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Last Activity</span>
              <span className="text-gray-900">
                {format(new Date(app.LastMessageAt), "MMM dd, yyyy 'at' HH:mm")}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Created</span>
              <span className="text-gray-900">
                {app.CreatedAt ? format(new Date(app.CreatedAt), "MMM dd, yyyy") : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Settings" size={20} className="mr-2" />
            Technical Information
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">App Category</span>
              <Badge variant="secondary">{app.AppCategory}</Badge>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Analysis Status</span>
              <StatusBadge status={app.LastChatAnalysisStatus} type="chatAnalysis" />
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Database Connection</span>
              <div className="flex items-center">
                <ApperIcon
                  name={app.IsDbConnected ? "CheckCircle" : "XCircle"}
                  size={16}
                  className={app.IsDbConnected ? "text-green-500" : "text-red-500"}
                />
                <span className={`ml-2 ${app.IsDbConnected ? "text-green-600" : "text-red-600"}`}>
                  {app.IsDbConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Zap" size={20} className="mr-2" />
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleViewLogs}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="FileText" size={16} />
            <span>View Activity Logs</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info("Feature coming soon")}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" size={16} />
            <span>Export Data</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info("Feature coming soon")}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Refresh Analysis</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AppDetail;