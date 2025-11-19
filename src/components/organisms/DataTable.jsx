import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const DataTable = ({
  columns,
  data,
  loading = false,
  onSort,
  sortColumn,
  sortDirection,
  onRowClick,
  actions,
  emptyMessage = "No data available",
  emptyDescription = "There are no records to display.",
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(data.map(row => row.Id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <Empty 
          title={emptyMessage}
          description={emptyDescription}
          icon="Database"
        />
      </div>
    );
  }

return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && onSort && (
                      <button
                        onClick={() => onSort(column.key)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ApperIcon
                          name={
                            sortColumn === column.key
                              ? sortDirection === "asc"
                                ? "ChevronUp"
                                : "ChevronDown"
                              : "ChevronsUpDown"
                          }
                          size={14}
                        />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-4 w-32">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <motion.tr
                key={row.Id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                onClick={() => onRowClick?.(row)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={selectedRows.has(row.Id)}
                    onChange={(e) => handleSelectRow(row.Id, e.target.checked)}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex space-x-2">
                      {actions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                        >
                          <ApperIcon name={action.icon} size={16} />
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;