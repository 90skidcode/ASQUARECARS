import axios from "axios";
import { UtilsJson } from "../utils/UtilsJson";

async function GetApi(url) {
  let { responceData, loading, error } = "";
  await axios
      .get(UtilsJson.baseUrl + url)
      .then((response) => {
        responceData = response;
      })
      .catch((err) => {
        error = err;
      })
      .finally(() => {
        loading = false;
      });
  return { responceData, loading, error };
}

export default GetApi;
