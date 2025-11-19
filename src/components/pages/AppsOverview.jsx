import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import App from "@/App";
import appService from "@/services/api/appService";
import userDetailsService from "@/services/api/userDetailsService";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import FilterBar from "@/components/molecules/FilterBar";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import DataTable from "@/components/organisms/DataTable";
import DashboardMetrics from "@/components/organisms/DashboardMetrics";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
const AppsOverview = () => {
const navigate = useNavigate();
const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [usersMap, setUsersMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [appDetails, setAppDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    fetchApps();
  }, []);

useEffect(() => {
    let filtered = [...apps];

    // Apply search filter - search by app name or ID
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.AppName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.Id.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "ALL") {
      filtered = filtered.filter(app => app.CurrentStatus === statusFilter);
    }

    // Apply date filter (mock implementation - in real app would filter by date)
    // For now, we'll show all apps regardless of selectedDate

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    setFilteredApps(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [apps, searchTerm, statusFilter, selectedDate, sortColumn, sortDirection]);

  // Calculate summary metrics
  const calculateMetrics = () => {
    const totalApps = apps.length;
    const criticalIssues = apps.filter(app => 
      app.CurrentStatus === 'ABANDONMENT_RISK' || 
      app.TechnicalComplexity >= 4
    ).length;
    const blockedUsers = apps.filter(app => 
      app.UserWorkflowImpact === 'BLOCKED'
    ).length;
    const avgComplexity = apps.length > 0 ? 
      (apps.reduce((sum, app) => sum + (app.TechnicalComplexity || 0), 0) / apps.length).toFixed(1) : 
      '0.0';

    return [
      { title: "Total Apps Analyzed", value: totalApps, icon: "Grid3X3", color: "blue" },
      { title: "Critical Issues", value: criticalIssues, icon: "AlertTriangle", color: "red" },
      { title: "Blocked Users", value: blockedUsers, icon: "UserX", color: "red" },
      { title: "Avg Technical Complexity", value: `${avgComplexity}/5`, icon: "Zap", color: "purple" }
    ];
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
};

  const handleRowClick = (app) => {
    navigate(`/apps/${app.Id}`);
  };

const handleViewDetails = async (app) => {
    setSelectedApp(app);
    setShowModal(true);
    setModalLoading(true);
    setModalError("");
    setAppDetails(null);
    setUserDetails(null);

    try {
      // Fetch app details and user details
      const [appData, userData] = await Promise.all([
        appService.getById(app.Id),
        userDetailsService.getById(app.UserId)
      ]);
      
      setAppDetails(appData);
      setUserDetails(userData);
    } catch (err) {
      setModalError(err.message || "Failed to load app details");
    } finally {
      setModalLoading(false);
    }
  };

const handleViewLogs = (app) => {
    navigate(`/logs?appId=${app.Id}`);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
    setAppDetails(null);
    setUserDetails(null);
    setModalError("");
};

  const handleSalesStatusChange = async (appId, newStatus) => {
    try {
      await appService.update(appId, { SalesStatus: newStatus });
      setApps(prev => prev.map(app => 
        app.Id === appId ? { ...app, SalesStatus: newStatus } : app
      ));
      setFilteredApps(prev => prev.map(app => 
        app.Id === appId ? { ...app, SalesStatus: newStatus } : app
      ));
    } catch (err) {
      console.error('Failed to update sales status:', err);
    }
  };

  const getSalesStatusOptions = () => [
    { value: "Demo Scheduled", label: "Demo Scheduled" },
    { value: "Demo Completed", label: "Demo Completed" },
    { value: "Proposal Sent", label: "Proposal Sent" },
    { value: "Closed Won", label: "Closed Won" },
    { value: "Closed Lost", label: "Closed Lost" },
    { value: "Follow Up Schedule", label: "Follow Up Schedule" },
    { value: "No Contacted", label: "No Contacted" },
    { value: "Negotiating", label: "Negotiating" },
    { value: "Contract review", label: "Contract Review" }
  ];
  
const getStatusOptions = () => {
    return [
      { value: "ALL", label: "All Statuses" },
      { value: "TROUBLESHOOTING_DB", label: "Troubleshooting DB" },
      { value: "STUCK", label: "Stuck" },
      { value: "CONFUSED", label: "Confused" },
      { value: "FRUSTRATED", label: "Frustrated" },
      { value: "ABANDONMENT_RISK", label: "Abandonment Risk" },
      { value: "DEBUGGING", label: "Debugging" },
      { value: "PERFORMANCE_ISSUES", label: "Performance Issues" },
      { value: "INTEGRATION_PROBLEMS", label: "Integration Problems" },
      { value: "REPEATING_ISSUES", label: "Repeating Issues" },
      { value: "GOING_IN_CIRCLES", label: "Going in Circles" }
    ];
  };

  // Enhanced apps data with missing fields
  const enhanceAppsData = (appsData) => {
    return appsData.map(app => ({
      ...app,
      AppSummary: `${app.AppCategory} application with ${app.TotalMessages} messages. ${app.IsDbConnected ? 'Database connected.' : 'No database connection.'}`,
      CurrentStatus: app.LastChatAnalysisStatus?.toUpperCase() || 'CONFUSED',
      TechnicalComplexity: Math.floor(Math.random() * 5) + 1, // Mock complexity 1-5
      UserWorkflowImpact: app.LastChatAnalysisStatus === 'abandonment_risk' ? 'BLOCKED' : 
                          app.LastChatAnalysisStatus === 'frustrated' ? 'PARTIALLY_BLOCKED' : 'MINIMAL_IMPACT'
    }));
  };

// Fetch apps with enhanced data
  const fetchApps = async () => {
    try {
      setLoading(true);
      setError("");
      const appsData = await appService.getAll();
      const enhancedApps = enhanceAppsData(appsData || []);
      setApps(enhancedApps);
      setFilteredApps(enhancedApps);
      
      // Fetch user details for all apps
      if (enhancedApps && enhancedApps.length > 0) {
        const userIds = [...new Set(enhancedApps.map(app => app.UserId).filter(Boolean))];
        const users = await userDetailsService.getByIds(userIds);
        const userMap = {};
        users.forEach(user => {
          userMap[user.Id] = user;
        });
        setUsersMap(userMap);
      }
    } catch (err) {
      setError(err.message || "Failed to load apps");
    } finally {
      setLoading(false);
    }
  };
const columns = [
    {
      key: "AppName",
      label: "App Name",
      sortable: true,
      render: (value, row) => (
        <div className="cursor-pointer hover:text-blue-600">
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">ID: {row.Id}</div>
        </div>
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
      key: "AppSummary",
      label: "Summary",
      sortable: false,
      render: (value) => (
        <div className="text-sm text-gray-600 max-w-xs">
          <span className="line-clamp-2">
            {value.length > 80 ? `${value.substring(0, 80)}...` : value}
          </span>
        </div>
      )
    },
    {
      key: "CurrentStatus",
      label: "Current Status",
      sortable: true,
      render: (value) => {
        const getStatusColor = (status) => {
          switch(status) {
            case 'TROUBLESHOOTING_DB': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'STUCK': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFUSED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'FRUSTRATED': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'ABANDONMENT_RISK': return 'bg-red-100 text-red-800 border-red-200';
            case 'DEBUGGING': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'PERFORMANCE_ISSUES': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'INTEGRATION_PROBLEMS': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'REPEATING_ISSUES': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'GOING_IN_CIRCLES': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
          }
        };
        
        return (
          <div className="flex items-center">
            <ApperIcon 
              name="AlertCircle" 
              size={14} 
              className="mr-1 text-gray-400" 
            />
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(value)}`}>
              {value?.replace(/_/g, ' ')}
            </span>
          </div>
        );
      }
    },
    {
      key: "TechnicalComplexity",
      label: "Technical Complexity",
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <span className="font-medium text-gray-900">{value}/5</span>
          <div className="ml-2 flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <ApperIcon
                key={star}
                name="Star"
                size={12}
                className={star <= value ? "text-yellow-400 fill-current" : "text-gray-300"}
              />
            ))}
          </div>
        </div>
      )
    },
    {
      key: "UserWorkflowImpact",
      label: "User Impact",
      sortable: true,
      render: (value) => {
        const getImpactColor = (impact) => {
          switch(impact) {
            case 'BLOCKED': return 'bg-red-100 text-red-800 border-red-200';
            case 'PARTIALLY_BLOCKED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'MINIMAL_IMPACT': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
          }
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getImpactColor(value)}`}>
            {value?.replace(/_/g, ' ')}
          </span>
        );
      }
    }
  ];

// Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredApps.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  // Actions for table rows
  const actions = [
    {
      icon: "FileText",
      onClick: handleViewLogs
    },
    {
      icon: "Eye",
      onClick: handleViewDetails
    }
  ];

if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={fetchApps} />;

  return (
    <div className="space-y-6">
      {/* Summary Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <DashboardMetrics metrics={calculateMetrics()} />
      </motion.div>

      {/* Filtering Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <SearchBar
              placeholder="Search by app name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="md:col-span-1">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full"
            >
              {getStatusOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          
          <div className="md:col-span-1">
            <div className="relative">
              <ApperIcon 
                name="Calendar" 
                size={20} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredApps.length)} of {filteredApps.length} apps
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>
        )}
      </div>

{/* Table View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <DataTable
          columns={columns}
          data={paginatedData}
          loading={loading}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onRowClick={handleRowClick}
          actions={actions}
          emptyMessage="No apps match your current filters"
          emptyDescription="Try adjusting your search criteria or changing the selected filters."
        />
      </motion.div>
    </div>
  );
};

export default AppsOverview;