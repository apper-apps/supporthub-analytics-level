import { useState, useEffect } from "react";

const useDataFetch = (serviceMethod, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await serviceMethod();
      setData(result || []);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useDataFetch;