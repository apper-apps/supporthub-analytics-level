import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  color = "blue",
  trend,
  className = ""
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 text-white",
    green: "from-green-500 to-green-600 text-white",
    purple: "from-purple-500 to-purple-600 text-white",
    yellow: "from-yellow-500 to-yellow-600 text-white",
    red: "from-red-500 to-red-600 text-white",
    indigo: "from-indigo-500 to-indigo-600 text-white",
  };

  const changeColors = {
    positive: "text-green-600 bg-green-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50",
  };

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="bg-white/20 rounded-lg p-2">
              <ApperIcon name={icon} size={24} className="text-white" />
            </div>
          )}
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
          </div>
        </div>
        {trend && (
          <div className="text-right">
            <ApperIcon 
              name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
              size={20} 
              className="text-white/80" 
            />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-white mb-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
              <ApperIcon 
                name={changeType === "positive" ? "ArrowUp" : changeType === "negative" ? "ArrowDown" : "Minus"} 
                size={12} 
                className="mr-1" 
              />
              {change}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;