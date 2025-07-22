import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import MetricCard from "@/components/molecules/MetricCard";
import DataTable from "@/components/organisms/DataTable";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import userDetailsService from "@/services/api/userDetailsService";
import appService from "@/services/api/appService";

const UserDashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userApps, setUserApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!userId) {
        throw new Error("User ID is required");
      }

      const [userData, allApps] = await Promise.all([
        userDetailsService.getById(userId),
        appService.getAll()
      ]);

      if (!userData) {
        throw new Error("User not found");
      }

      // Filter apps for this user (using UserId from user data)
      const filteredApps = allApps.filter(app => 
        userData.UserId && app.CanvasAppId && app.CanvasAppId.includes(userData.UserId.slice(-3))
      );

      setUser(userData);
      setUserApps(filteredApps || []);
    } catch (err) {
      setError(err.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleAppClick = (app) => {
    navigate(`/apps/${app.Id}`);
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={fetchUserData} />;
  if (!user) return <Error message="User not found" />;

  const userMetrics = [
    {
      title: "Total Apps",
      value: user.TotalApps,
      icon: "Grid3X3",
      color: "green"
    },
    {
      title: "With DB",
      value: user.TotalAppWithDB,
      icon: "Database",
      color: "purple"
    },
    {
      title: "Credits Used",
      value: user.TotalCreditsUsed,
      icon: "Zap",
      color: "blue"
    },
    {
      title: "User ID",
      value: user.Id,
      icon: "Hash",
      color: "yellow"
    }
  ];

  const appColumns = [
    {
      key: "AppName",
      label: "App Name",
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: "AppCategory",
      label: "Category",
      sortable: true,
      render: (value) => (
        <Badge variant="secondary">{value}</Badge>
      )
    },
    {
      key: "LastChatAnalysisStatus",
      label: "Status",
      sortable: true,
      render: (value) => (
        <StatusBadge status={value} type="chatAnalysis" />
      )
    },
    {
      key: "IsDbConnected",
      label: "DB Connected",
      render: (value) => (
        <div className="flex items-center">
          <ApperIcon
            name={value ? "CheckCircle" : "XCircle"}
            size={16}
            className={value ? "text-green-500" : "text-red-500"}
          />
          <span className={`ml-2 text-sm ${value ? "text-green-600" : "text-red-600"}`}>
            {value ? "Connected" : "Disconnected"}
          </span>
        </div>
      )
    },
    {
      key: "TotalMessages",
      label: "Messages",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-gray-600">{value}</span>
      )
    },
    {
      key: "LastMessageAt",
      label: "Last Activity",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {format(new Date(value), "MMM dd, yyyy HH:mm")}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* User Details Card */}
      <motion.div
        className="bg-white rounded-xl shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-full h-16 w-16 flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user.Name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.Name}</h2>
              <p className="text-gray-600">{user.Email}</p>
              <div className="flex items-center mt-2">
                <Badge variant="primary" className="mr-3">
                  {user.Plan}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Company ID</div>
            <div className="font-mono font-medium text-gray-900">{user.CompanyID}</div>
            <div className="text-sm text-gray-500 mt-2">Credits Used</div>
            <div className="text-lg font-bold text-primary-600">
              {user.TotalCreditsUsed.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {userMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MetricCard
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                color={metric.color}
                className="h-32"
              />
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <ApperIcon name="Calendar" size={14} className="mr-1" />
              Platform Signup
            </div>
            <div className="font-medium text-gray-900">
              {format(new Date(user.PlatformSignupDate), "MMM dd, yyyy")}
            </div>
          </div>
          
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <ApperIcon name="Calendar" size={14} className="mr-1" />
              Apper Signup
            </div>
            <div className="font-medium text-gray-900">
              {format(new Date(user.ApperSignupDate), "MMM dd, yyyy")}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Company User ID</div>
            <div className="font-mono font-medium text-gray-900">{user.CompanyUserId}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Internal ID</div>
            <div className="font-mono font-medium text-gray-900">{user.UserId}</div>
          </div>
        </div>
      </motion.div>

      {/* User's Apps Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Apps ({userApps.length} of {user.TotalApps})
          </h3>
        </div>
        
        <DataTable
          columns={appColumns}
          data={userApps}
          onRowClick={handleAppClick}
          emptyMessage="No apps found"
          emptyDescription="This user hasn't created any apps yet."
        />
      </motion.div>
    </div>
  );
};

export default UserDashboard;