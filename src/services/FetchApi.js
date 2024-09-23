import { useEffect, useState } from "react";
import axios from "axios";
import { UtilsJson } from "../utils/UtilsJson";

function FetchApi(url) {
  
  const [responceData, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(UtilsJson.baseUrl + url)
      .then((response) => {
        setData(response);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return { responceData, loading, error };
}

export default FetchApi;
