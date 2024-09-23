import axios from "axios";
import { UtilsJson } from "../utils/UtilsJson";

function PutApi(url, data, props, successMessage) {
  let responcePostData = [];
  let loadingPost = false;
  let errorPost = null;

  loadingPost = true;
  try {
    axios
      .put(UtilsJson.baseUrl + url, data)
      .then((response) => {
        responcePostData = response;
        props.setMessage({ class: 'bg-green-600', visable: true, title: 'Success', body: successMessage });
      })
      .catch((err) => {
        errorPost = err;
        props.setMessage({ class: 'bg-red-600', visable: true, title: 'Error', body: 'Please try again !!' });
      })
      .finally(() => {
        loadingPost = false;
      });
  } catch (e) {
    errorPost = e;
  }

  return { responcePostData, loadingPost, errorPost };
}

export default PutApi;
