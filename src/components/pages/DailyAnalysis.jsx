import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import appAILogService from "@/services/api/appAILogService";
import appService from "@/services/api/appService";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import MetricCard from "@/components/molecules/MetricCard";
import FilterBar from "@/components/molecules/FilterBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Dashboard from "@/components/pages/Dashboard";
import DataTable from "@/components/organisms/DataTable";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";

const DailyAnalysis = () => {
  const [apps, setApps] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [blockerTypeFilter, setBlockerTypeFilter] = useState("");
  const [impactFilter, setImpactFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // Mock data for analysis (in real implementation, this would come from API)
  const mockAnalysisData = {
    1: {
      severity: "HIGH",
      blockerType: "INFRASTRUCTURE",
      userWorkflowImpact: "BLOCKED",
      technicalComplexity: 4.2,
      estimatedFixEffort: "HIGH",
      issueTags: ["DATABASE_ISSUES", "CONNECTION_ERRORS", "POSTGRES"],
      appSummary: "E-commerce app experiencing database connectivity issues affecting user transactions and inventory management.",
      incidentSummary: "Multiple database timeout errors detected. Users unable to complete purchases. Connection pool exhaustion identified.",
      recommendedActions: ["Increase database connection pool size", "Implement connection retry logic", "Add database monitoring alerts"]
    },
    2: {
      severity: "MEDIUM",
      blockerType: "UI_GENERATION",
      userWorkflowImpact: "PARTIALLY_BLOCKED",
      technicalComplexity: 2.8,
      estimatedFixEffort: "MEDIUM",
      issueTags: ["UI_BROKEN", "NAVIGATION_ISSUES", "PAGE_ROUTING"],
      appSummary: "Task management app with navigation inconsistencies and broken UI components on mobile devices.",
      incidentSummary: "Mobile users reporting navigation menu not responsive. Some buttons not clickable on touch devices.",
      recommendedActions: ["Fix mobile responsive CSS", "Update touch event handlers", "Test across different devices"]
    },
    3: {
      severity: "LOW",
      blockerType: "PERFORMANCE",
      userWorkflowImpact: "MINIMAL_IMPACT",
      technicalComplexity: 1.5,
      estimatedFixEffort: "LOW",
      issueTags: ["TIMEOUT_PROBLEMS", "PERFORMANCE"],
      appSummary: "Analytics dashboard with slow loading times during peak usage hours.",
      incidentSummary: "Dashboard loading takes 8-12 seconds during business hours. API response times increased.",
      recommendedActions: ["Implement caching strategy", "Optimize database queries", "Add loading indicators"]
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [appsData, logsData] = await Promise.all([
        appService.getAll(),
        appAILogService.getAll()
      ]);
      
      setApps(appsData || []);
      setLogs(logsData || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Apply filters to apps
  useEffect(() => {
    let filtered = [...apps];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.AppName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.Id.toString().includes(searchTerm)
      );
    }

    // Apply severity filter
    if (severityFilter) {
      filtered = filtered.filter(app => {
        const analysis = mockAnalysisData[app.Id];
        return analysis && analysis.severity === severityFilter;
      });
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(app => app.LastChatAnalysisStatus === statusFilter);
    }

    // Apply blocker type filter
    if (blockerTypeFilter) {
      filtered = filtered.filter(app => {
        const analysis = mockAnalysisData[app.Id];
        return analysis && analysis.blockerType === blockerTypeFilter;
      });
    }

    // Apply impact filter
    if (impactFilter) {
      filtered = filtered.filter(app => {
        const analysis = mockAnalysisData[app.Id];
        return analysis && analysis.userWorkflowImpact === impactFilter;
      });
    }

    setFilteredApps(filtered);
  }, [apps, searchTerm, severityFilter, statusFilter, blockerTypeFilter, impactFilter]);

  const calculateMetrics = () => {
    const analysisData = Object.values(mockAnalysisData);
    
    const totalAppsAnalyzed = filteredApps.length;
    const criticalIssues = analysisData.filter(data => data.severity === "HIGH").length;
    const blockedUsers = analysisData.filter(data => data.userWorkflowImpact === "BLOCKED").length;
    const avgTechnicalComplexity = analysisData.reduce((sum, data) => sum + data.technicalComplexity, 0) / analysisData.length || 0;

    return [
      {
        title: "Total Apps Analyzed",
        value: totalAppsAnalyzed,
        icon: "Grid3X3",
        color: "blue",
        change: "+5%",
        changeType: "positive",
        trend: "up"
      },
      {
        title: "Critical Issues",
        value: criticalIssues,
        icon: "AlertTriangle",
        color: "red",
        change: "-2%",
        changeType: "positive",
        trend: "down"
      },
      {
        title: "Blocked Users",
        value: blockedUsers,
        icon: "UserX",
        color: "red",
        change: "-8%",
        changeType: "positive",
        trend: "down"
      },
      {
        title: "Avg Complexity",
        value: `${avgTechnicalComplexity.toFixed(1)}/5`,
        icon: "BarChart3",
        color: "purple",
        change: "+0.2",
        changeType: "neutral",
        trend: "neutral"
      }
    ];
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "HIGH": return "AlertTriangle";
      case "MEDIUM": return "AlertCircle";
      case "LOW": return "Info";
      default: return "Info";
    }
  };

const getSeverityColor = (severity) => {
    switch (severity) {
      case "HIGH": return "border-l-red-500";
      case "MEDIUM": return "border-l-orange-500";
      case "LOW": return "border-l-blue-500";
      default: return "border-l-gray-500";
    }
  };

  const getBlockerTypeIcon = (blockerType) => {
    switch (blockerType) {
      case "INFRASTRUCTURE": return "Database";
      case "UI_GENERATION": return "Layout";
      case "API_ISSUES": return "Zap";
      case "LOGIC_ERRORS": return "Tool";
      case "PERFORMANCE": return "Gauge";
      case "DATA_MODEL": return "Table";
      default: return "HelpCircle";
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "BLOCKED": return "bg-red-500";
      case "PARTIALLY_BLOCKED": return "bg-orange-500";
      case "MINIMAL_IMPACT": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case "HIGH": return "bg-red-500";
      case "MEDIUM": return "bg-orange-500";
      case "LOW": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTechnicalComplexityBars = (complexity) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full ${
          i < Math.floor(complexity) 
            ? complexity >= 4 ? "bg-red-500" 
              : complexity >= 3 ? "bg-orange-500" 
              : "bg-green-500"
            : "bg-gray-200"
        }`}
      />
    ));
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={fetchDashboardData} />;

  const metrics = calculateMetrics();

  const filters = [
    {
      placeholder: "All Severities",
      value: severityFilter,
      onChange: (e) => setSeverityFilter(e.target.value),
      options: [
        { value: "HIGH", label: "High" },
        { value: "MEDIUM", label: "Medium" },
        { value: "LOW", label: "Low" }
      ]
    },
    {
      placeholder: "All Statuses",
      value: statusFilter,
      onChange: (e) => setStatusFilter(e.target.value),
      options: [
        { value: "TROUBLESHOOTING_DB", label: "Troubleshooting DB" },
        { value: "STUCK", label: "Stuck" },
        { value: "CONFUSED", label: "Confused" },
        { value: "FRUSTRATED", label: "Frustrated" },
        { value: "ABANDONMENT_RISK", label: "Abandonment Risk" },
        { value: "DEBUGGING", label: "Debugging" },
        { value: "PERFORMANCE_ISSUES", label: "Performance Issues" },
        { value: "INTEGRATION_PROBLEMS", label: "Integration Problems" },
        { value: "REPEATING_ISSUES", label: "Repeating Issues" },
        { value: "GOING_IN_CIRCLES", label: "Going In Circles" }
      ]
    },
    {
      placeholder: "All Blocker Types",
      value: blockerTypeFilter,
      onChange: (e) => setBlockerTypeFilter(e.target.value),
      options: [
        { value: "INFRASTRUCTURE", label: "Infrastructure" },
        { value: "UI_GENERATION", label: "UI Generation" },
        { value: "API_ISSUES", label: "API Issues" },
        { value: "LOGIC_ERRORS", label: "Logic Errors" },
        { value: "PERFORMANCE", label: "Performance" },
        { value: "DATA_MODEL", label: "Data Model" }
      ]
    },
    {
      placeholder: "All Impacts",
      value: impactFilter,
      onChange: (e) => setImpactFilter(e.target.value),
      options: [
        { value: "BLOCKED", label: "Blocked" },
        { value: "PARTIALLY_BLOCKED", label: "Partially Blocked" },
        { value: "MINIMAL_IMPACT", label: "Minimal Impact" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Analysis Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor app issues and user blockers</p>
          </div>
          <div className="flex items-center space-x-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
            <Button onClick={fetchDashboardData} variant="outline">
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filtering & Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchPlaceholder="Search by app name or ID..."
          filters={filters}
          showExport={true}
          showRefresh={true}
          onRefresh={fetchDashboardData}
          onExport={() => {
            toast.info("Export functionality coming soon");
          }}
        />
      </motion.div>

      {/* App Analysis Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {filteredApps.length === 0 ? (
          <Empty
            title="No Apps Found"
            description="No apps match your current filters. Try adjusting your search criteria."
            icon="Search"
          />
        ) : (
<DataTable
            columns={[
              {
                key: 'app',
                label: 'Application',
                sortable: true,
render: (app) => {
                  if (!app) return <span className="text-gray-400">No data</span>;
                  return (
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">{app.AppName || 'Unknown App'}</span>
                        <Badge variant="secondary">{app.AppCategory || 'Uncategorized'}</Badge>
                      </div>
                      <span className="text-sm text-gray-500">#{app.Id || 'N/A'}</span>
                    </div>
                  );
                }
              },
              {
                key: 'status',
                label: 'Status',
                sortable: true,
render: (app) => {
                  if (!app) return <span className="text-gray-400">No status</span>;
                  return <StatusBadge status={app.LastChatAnalysisStatus || 'UNKNOWN'} type="chatAnalysis" />;
                }
              },
              {
                key: 'severity',
                label: 'Severity',
                sortable: true,
render: (app) => {
                  if (!app) return <span className="text-gray-400">No data</span>;
                  const analysis = mockAnalysisData[app.Id] || {
                    severity: "LOW",
                    blockerType: "PERFORMANCE",
                    userWorkflowImpact: "MINIMAL_IMPACT",
                    technicalComplexity: 2.0,
                    estimatedFixEffort: "LOW",
                    issueTags: [],
                    appSummary: "No analysis data available",
                    incidentSummary: "No incident details available",
                    recommendedActions: ["Monitor app performance", "Review user feedback"]
                  };
                  return (
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysis.severity)}`}>
                      <ApperIcon name={getSeverityIcon(analysis.severity)} size={14} className="mr-1" />
                      {analysis.severity}
                    </div>
                  );
                }
              },
              {
                key: 'blockerType',
                label: 'Blocker Type',
                sortable: true,
render: (app) => {
                  if (!app) return <span className="text-gray-400">No data</span>;
                  const analysis = mockAnalysisData[app.Id] || {
                    severity: "LOW",
                    blockerType: "PERFORMANCE",
                    userWorkflowImpact: "MINIMAL_IMPACT",
                    technicalComplexity: 2.0,
                    estimatedFixEffort: "LOW",
                    issueTags: [],
                    appSummary: "No analysis data available",
                    incidentSummary: "No incident details available",
                    recommendedActions: ["Monitor app performance", "Review user feedback"]
                  };
                  return (
                    <div className="flex items-center">
                      <ApperIcon name={getBlockerTypeIcon(analysis.blockerType)} size={16} className="mr-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {analysis.blockerType.replace(/_/g, ' ')}
                      </span>
                    </div>
                  );
                }
              },
              {
                key: 'userImpact',
                label: 'User Impact',
                sortable: true,
render: (app) => {
                  if (!app) return <span className="text-gray-400">No data</span>;
                  const analysis = mockAnalysisData[app.Id] || {
                    severity: "LOW",
                    blockerType: "PERFORMANCE",
                    userWorkflowImpact: "MINIMAL_IMPACT",
                    technicalComplexity: 2.0,
                    estimatedFixEffort: "LOW",
                    issueTags: [],
                    appSummary: "No analysis data available",
                    incidentSummary: "No incident details available",
                    recommendedActions: ["Monitor app performance", "Review user feedback"]
                  };
                  return (
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getImpactColor(analysis.userWorkflowImpact)}`}></div>
                      <span className="text-sm font-medium text-gray-900">
                        {analysis.userWorkflowImpact.replace(/_/g, ' ')}
                      </span>
                    </div>
                  );
                }
              },
              {
                key: 'technicalComplexity',
                label: 'Tech Complexity',
                sortable: true,
render: (app) => {
                  if (!app) return <span className="text-gray-400">No data</span>;
                  const analysis = mockAnalysisData[app.Id] || {
                    severity: "LOW",
                    blockerType: "PERFORMANCE",
                    userWorkflowImpact: "MINIMAL_IMPACT",
                    technicalComplexity: 2.0,
                    estimatedFixEffort: "LOW",
                    issueTags: [],
                    appSummary: "No analysis data available",
                    incidentSummary: "No incident details available",
                    recommendedActions: ["Monitor app performance", "Review user feedback"]
                  };
                  return (
                    <div className="flex items-center space-x-1">
                      {getTechnicalComplexityBars(analysis.technicalComplexity)}
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {analysis.technicalComplexity}/5
                      </span>
                    </div>
                  );
                }
              },
              {
                key: 'fixEffort',
                label: 'Fix Effort',
                sortable: true,
render: (app) => {
                  if (!app) return <span className="text-gray-400">No data</span>;
                  const analysis = mockAnalysisData[app.Id] || {
                    severity: "LOW",
                    blockerType: "PERFORMANCE",
                    userWorkflowImpact: "MINIMAL_IMPACT",
                    technicalComplexity: 2.0,
                    estimatedFixEffort: "LOW",
                    issueTags: [],
                    appSummary: "No analysis data available",
                    incidentSummary: "No incident details available",
                    recommendedActions: ["Monitor app performance", "Review user feedback"]
                  };
                  return (
                    <div className="flex items-center">
                      <ApperIcon name="Clock" size={14} className="mr-2 text-gray-600" />
                      <span className={`text-sm font-medium px-2 py-0.5 rounded text-white ${getEffortColor(analysis.estimatedFixEffort)}`}>
                        {analysis.estimatedFixEffort}
                      </span>
                    </div>
                  );
                }
              },
              {
                key: 'actions',
                label: 'Recommended Actions',
render: (app) => {
                  if (!app) return <span className="text-gray-400">No data</span>;
                  const analysis = mockAnalysisData[app.Id] || {
                    severity: "LOW",
                    blockerType: "PERFORMANCE",
                    userWorkflowImpact: "MINIMAL_IMPACT",
                    technicalComplexity: 2.0,
                    estimatedFixEffort: "LOW",
                    issueTags: [],
                    appSummary: "No analysis data available",
                    incidentSummary: "No incident details available",
                    recommendedActions: ["Monitor app performance", "Review user feedback"]
                  };
                  return (
                    <div className="max-w-xs">
                      <details className="group">
                        <summary className="cursor-pointer text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                          <ApperIcon name="Lightbulb" size={14} className="mr-1" />
                          View Actions ({analysis.recommendedActions?.length || 0})
                        </summary>
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <ul className="space-y-1">
                            {(analysis.recommendedActions || []).map((action, actionIndex) => (
                              <li key={actionIndex} className="text-sm text-blue-800 flex items-start">
                                <ApperIcon name="ChevronRight" size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>
                    </div>
                  );
                }
              }
            ]}
data={filteredApps.map(app => app ? ({
              ...app,
              analysis: mockAnalysisData[app.Id] || {
                severity: "LOW",
                blockerType: "PERFORMANCE",
                userWorkflowImpact: "MINIMAL_IMPACT",
                technicalComplexity: 2.0,
                estimatedFixEffort: "LOW",
                issueTags: [],
                appSummary: "No analysis data available",
                incidentSummary: "No incident details available",
                recommendedActions: ["Monitor app performance", "Review user feedback"]
              }
            }) : null).filter(Boolean)}
loading={loading}
            emptyMessage="No daily analysis data available"
          />
        )}
      </motion.div>
    </div>
  );
};

export default DailyAnalysis;