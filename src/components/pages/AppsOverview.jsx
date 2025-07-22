import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import DataTable from "@/components/organisms/DataTable";
import FilterBar from "@/components/molecules/FilterBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import appService from "@/services/api/appService";

const AppsOverview = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dbFilter, setDbFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchApps = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await appService.getAll();
      setApps(data || []);
      setFilteredApps(data || []);
    } catch (err) {
      setError(err.message || "Failed to load apps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    let filtered = [...apps];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.AppName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.AppCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(app => app.AppCategory === categoryFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(app => app.LastChatAnalysisStatus === statusFilter);
    }

    // Apply DB filter
    if (dbFilter) {
      filtered = filtered.filter(app => 
        dbFilter === "connected" ? app.IsDbConnected : !app.IsDbConnected
      );
    }

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
  }, [apps, searchTerm, categoryFilter, statusFilter, dbFilter, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAppClick = (app) => {
    navigate(`/apps/${app.Id}`);
  };

  const handleViewLogs = (app) => {
    navigate(`/logs?appId=${app.Id}`);
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(apps.map(app => app.AppCategory))];
    return categories.map(cat => ({ value: cat, label: cat }));
  };

  const getUniqueStatuses = () => {
    const statuses = [...new Set(apps.map(app => app.LastChatAnalysisStatus))];
    return statuses.map(status => ({ 
      value: status, 
      label: status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) 
    }));
  };

  const columns = [
    {
      key: "AppName",
      label: "App Name",
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.CanvasAppId}</div>
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

  const actions = [
    {
      icon: "FileText",
      onClick: handleViewLogs
    },
    {
      icon: "Eye",
      onClick: handleAppClick
    }
  ];

  const filters = [
    {
      placeholder: "All Categories",
      value: categoryFilter,
      onChange: (e) => setCategoryFilter(e.target.value),
      options: getUniqueCategories()
    },
    {
      placeholder: "All Statuses",
      value: statusFilter,
      onChange: (e) => setStatusFilter(e.target.value),
      options: getUniqueStatuses()
    },
    {
      placeholder: "All DB Status",
      value: dbFilter,
      onChange: (e) => setDbFilter(e.target.value),
      options: [
        { value: "connected", label: "Connected" },
        { value: "disconnected", label: "Disconnected" }
      ]
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={fetchApps} />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchPlaceholder="Search apps, categories..."
          filters={filters}
          showExport={true}
          showRefresh={true}
          onRefresh={fetchApps}
          onExport={() => {
            // Export functionality
            console.log("Export apps data");
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <DataTable
          columns={columns}
          data={filteredApps}
          loading={loading}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onRowClick={handleAppClick}
          actions={actions}
          emptyMessage="No apps found"
          emptyDescription="No apps match your current filters. Try adjusting your search criteria."
        />
      </motion.div>
    </div>
  );
};

export default AppsOverview;