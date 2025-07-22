import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="space-y-6 p-6">
        {/* Header Skeleton */}
        <div className="animate-shimmer rounded-lg h-16 w-full"></div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="animate-shimmer rounded h-4 w-20 mb-4"></div>
              <div className="animate-shimmer rounded h-10 w-16 mb-2"></div>
              <div className="animate-shimmer rounded h-3 w-24"></div>
            </div>
          ))}
        </div>
        
        {/* Chart Area */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="animate-shimmer rounded h-6 w-32 mb-4"></div>
          <div className="animate-shimmer rounded h-64 w-full"></div>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="animate-shimmer rounded h-6 w-40 mb-4"></div>
          <div className="flex gap-4">
            <div className="animate-shimmer rounded h-10 w-64"></div>
            <div className="animate-shimmer rounded h-10 w-32"></div>
            <div className="animate-shimmer rounded h-10 w-32"></div>
          </div>
        </div>
        
        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="animate-shimmer rounded-full h-10 w-10"></div>
                <div className="space-y-2">
                  <div className="animate-shimmer rounded h-4 w-32"></div>
                  <div className="animate-shimmer rounded h-3 w-24"></div>
                </div>
              </div>
              <div className="animate-shimmer rounded h-6 w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="animate-shimmer rounded h-6 w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="animate-shimmer rounded h-4 w-full"></div>
          <div className="animate-shimmer rounded h-4 w-3/4"></div>
          <div className="animate-shimmer rounded h-4 w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <motion.div
        className="flex items-center space-x-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-3 w-3 bg-primary-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="h-3 w-3 bg-primary-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="h-3 w-3 bg-primary-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
        <span className="ml-3 text-gray-600 font-medium">Loading...</span>
      </motion.div>
    </div>
  );
};

export default Loading;