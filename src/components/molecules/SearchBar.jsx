import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  placeholder = "Search...",
  value,
  onChange,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <ApperIcon 
        name="Search" 
        size={20} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
      />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;