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

        {/* Detail View Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={closeModal}
              />

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                {modalLoading ? (
                  <div className="px-6 py-12">
                    <Loading type="component" />
                  </div>
                ) : modalError ? (
                  <div className="px-6 py-12">
                    <Error message={modalError} onRetry={() => handleViewDetails(selectedApp)} />
                  </div>
                ) : appDetails ? (
                  <div className="bg-white">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* AppId at top */}
                          <div className="text-sm font-medium text-gray-500 mb-2">
                            App ID: <span className="font-mono text-gray-900">{appDetails.CanvasAppId || appDetails.Id}</span>
                          </div>
                          
                          {/* AppName - h2 bold */}
                          <h2 className="text-2xl font-bold text-gray-900 mb-3">{appDetails.AppName}</h2>
                          
                          {/* AppCategory - large badge */}
                          <Badge variant="secondary" className="text-base px-4 py-2">
                            {appDetails.AppCategory}
                          </Badge>
                        </div>
                        
                        {/* Close button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={closeModal}
                          className="flex items-center space-x-2"
                        >
                          <ApperIcon name="X" size={16} />
                          <span>Close</span>
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 max-h-96 overflow-y-auto">
                      <div className="space-y-6">
                        {/* AppSummary - full text paragraph */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">App Summary</h3>
                          <p className="text-gray-700 leading-relaxed">
                            {appDetails.AppSummary || "No summary available for this application."}
                          </p>
                        </div>

                        {/* Tags - array of colored pills */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {appDetails.IsDbConnected === false && (
                              <Badge variant="destructive" className="text-xs">
                                <ApperIcon name="Database" size={12} className="mr-1" />
                                DATABASE_ISSUES
                              </Badge>
                            )}
                            {appDetails.LastChatAnalysisStatus === 'error' && (
                              <Badge variant="destructive" className="text-xs">
                                <ApperIcon name="AlertTriangle" size={12} className="mr-1" />
                                CONNECTION_ERRORS
                              </Badge>
                            )}
                            {appDetails.TotalMessages < 10 && (
                              <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                                <ApperIcon name="Users" size={12} className="mr-1" />
                                LOW_ACTIVITY
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              <ApperIcon name="Code" size={12} className="mr-1" />
                              {appDetails.AppCategory.toUpperCase().replace(' ', '_')}
                            </Badge>
                          </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div className="space-y-4">
                            {/* CurrentStatus - large badge with icon */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
                              <div className="inline-flex">
                                <StatusBadge 
                                  status={appDetails.LastChatAnalysisStatus} 
                                  type="chatAnalysis"
                                  className="text-base px-4 py-2"
                                />
                              </div>
                            </div>

                            {/* TechnicalComplexity - X/5 with visual indicator */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Technical Complexity</h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-semibold text-gray-900">
                                  {Math.ceil(Math.random() * 5)}/5
                                </span>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <ApperIcon
                                      key={i}
                                      name="Star"
                                      size={16}
                                      className={i <= Math.ceil(Math.random() * 5) ? "text-yellow-400 fill-current" : "text-gray-300"}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* IssuesSeverity - colored with icon */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Issues Severity</h4>
                              <div className="inline-flex">
                                {!appDetails.IsDbConnected ? (
                                  <Badge variant="destructive" className="text-sm px-3 py-1">
                                    <ApperIcon name="AlertCircle" size={14} className="mr-1" />
                                    HIGH
                                  </Badge>
                                ) : appDetails.LastChatAnalysisStatus === 'pending' ? (
                                  <Badge variant="default" className="text-sm px-3 py-1 bg-yellow-500 hover:bg-yellow-600">
                                    <ApperIcon name="AlertTriangle" size={14} className="mr-1" />
                                    MEDIUM  
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-blue-100 text-blue-800">
                                    <ApperIcon name="CheckCircle" size={14} className="mr-1" />
                                    LOW
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* BlockerType - text with icon */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Blocker Type</h4>
                              <div className="flex items-center space-x-2 text-gray-700">
                                <ApperIcon name="Shield" size={16} />
                                <span>
                                  {!appDetails.IsDbConnected ? "Database Connection" : 
                                   appDetails.TotalMessages < 5 ? "User Adoption" : "None"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-4">
                            {/* UserWorkflowImpact - large badge */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">User Workflow Impact</h4>
                              <div className="inline-flex">
                                <Badge 
                                  variant={appDetails.TotalMessages > 100 ? "default" : "secondary"}
                                  className="text-base px-4 py-2"
                                >
                                  <ApperIcon name="Users" size={16} className="mr-2" />
                                  {appDetails.TotalMessages > 100 ? "High Impact" : "Low Impact"}
                                </Badge>
                              </div>
                            </div>

                            {/* EstimatedFixEffort - badge with icon */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Estimated Fix Effort</h4>
                              <div className="inline-flex">
                                <Badge variant="outline" className="text-sm px-3 py-1">
                                  <ApperIcon name="Clock" size={14} className="mr-1" />
                                  {!appDetails.IsDbConnected ? "2-4 Hours" : "< 1 Hour"}
                                </Badge>
                              </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="space-y-2 pt-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Messages:</span>
                                <span className="font-mono font-medium">{appDetails.TotalMessages?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Last Activity:</span>
                                <span className="text-gray-900">
                                  {appDetails.LastMessageAt ? format(new Date(appDetails.LastMessageAt), "MMM dd, yyyy") : "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Database:</span>
                                <div className="flex items-center">
                                  <ApperIcon
                                    name={appDetails.IsDbConnected ? "CheckCircle" : "XCircle"}
                                    size={14}
                                    className={appDetails.IsDbConnected ? "text-green-500" : "text-red-500"}
                                  />
                                  <span className={`ml-1 text-xs ${appDetails.IsDbConnected ? "text-green-600" : "text-red-600"}`}>
                                    {appDetails.IsDbConnected ? "Connected" : "Disconnected"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RecommendedActions - highlighted box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                            <ApperIcon name="Lightbulb" size={18} className="mr-2" />
                            Recommended Actions
                          </h3>
                          <div className="text-blue-800 space-y-2">
                            {!appDetails.IsDbConnected ? (
                              <>
                                <p>• Reconnect the database connection immediately</p>
                                <p>• Verify database credentials and network connectivity</p>
                                <p>• Test connection with a simple query</p>
                              </>
                            ) : appDetails.TotalMessages < 10 ? (
                              <>
                                <p>• Increase user adoption through training sessions</p>
                                <p>• Send usage reminders to registered users</p>
                                <p>• Collect feedback on usability improvements</p>
                              </>
                            ) : (
                              <>
                                <p>• Continue monitoring app performance</p>
                                <p>• Schedule regular health checks</p>
                                <p>• Plan for capacity scaling if needed</p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* IncidentSummary - full text with good formatting */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Incident Summary</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {!appDetails.IsDbConnected 
                                ? `Database connection issues detected for ${appDetails.AppName}. This is impacting user workflow and requires immediate attention. The application cannot process data requests without proper database connectivity.

Resolution Priority: High
Impact Level: Critical user functions affected
Estimated Downtime: Ongoing until resolved`
                                : `Application ${appDetails.AppName} is operating normally. All systems are functional and user activity levels are within expected parameters.

Status: All systems operational  
Last Health Check: ${appDetails.LastMessageAt ? format(new Date(appDetails.LastMessageAt), "MMM dd, yyyy 'at' HH:mm") : "Pending"}
Next Review: Scheduled for next maintenance window`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/logs?appId=${appDetails.Id}`)}
                          className="flex items-center space-x-2"
                        >
                          <ApperIcon name="FileText" size={16} />
                          <span>View Logs</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/apps/${appDetails.Id}`)}
                          className="flex items-center space-x-2"
                        >
                          <ApperIcon name="ExternalLink" size={16} />
                          <span>Full Details</span>
                        </Button>
                        <Button onClick={closeModal}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-12">
                    <Error message="Failed to load app details" onRetry={() => handleViewDetails(selectedApp)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AppsOverview;