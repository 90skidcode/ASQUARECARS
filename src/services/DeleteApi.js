import { useEffect, useState } from "react";
import axios from "axios";
import { UtilsJson } from "../utils/UtilsJson";

function DeleteApi(url) {
  const [responceDeleteData, setData] = useState(null);
  const [loadingDeleteData, setLoading] = useState(false);
  const [errorDeleteData, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .delete(UtilsJson.baseUrl+url)
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

  return { responceDeleteData, loadingDeleteData, errorDeleteData };
}

export default DeleteApi;