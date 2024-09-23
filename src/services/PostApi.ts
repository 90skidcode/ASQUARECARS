import { UtilsJson } from "@/api/utilsJSON";
import axios from "axios";
async function PostApi(url: string,data: any,props: { setMessage: (arg0: { class: string; visable: boolean; title: string; body: any; }) => void; },sucessMessage: any,page: string,config: any) {
  let responcePostData: never[] = [];
  let loadingPost = true;
  let errorPost = null;
try{
  await axios
    .post(UtilsJson.baseUrl + url,data,config)
    .then((response: any[]) => {
      responcePostData = response;
      if(page !== 'login')
      props.setMessage({class:'bg-green-600',visable:true, title:'Success', body:sucessMessage});
    })
    .catch((err: any) => {
      errorPost = err;
      props.setMessage({class:'bg-red-600',visable:true, title:'Error', body:'Please try again !!'});
    })
    .finally(() => {
      loadingPost = false;
    });
  }catch(e){
    errorPost = e;
  }

  return { responcePostData, loadingPost, errorPost };
}

export default PostApi;
