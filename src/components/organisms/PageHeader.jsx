import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import UserProfileDropdown from "@/components/molecules/UserProfileDropdown";

const PageHeader = ({ 
  title, 
  subtitle, 
  showRefresh = true, 
  onRefresh,
  children 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {children}
          
          {showRefresh && onRefresh && (
            <Button
              variant="outline"
              size="default"
              onClick={onRefresh}
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
          )}
          
          <UserProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;