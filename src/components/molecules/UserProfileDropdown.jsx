import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const UserProfileDropdown = ({ user = { name: "Support Agent", email: "agent@supporthub.com" } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-full h-8 w-8 flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">Support Team</p>
            </div>
            
            <div className="py-2">
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                <ApperIcon name="User" size={16} className="mr-3 text-gray-400" />
                Profile Settings
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                <ApperIcon name="Settings" size={16} className="mr-3 text-gray-400" />
                Preferences
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                <ApperIcon name="HelpCircle" size={16} className="mr-3 text-gray-400" />
                Help & Support
              </button>
            </div>
            
            <div className="border-t border-gray-100 pt-2">
              <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                <ApperIcon name="LogOut" size={16} className="mr-3" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;