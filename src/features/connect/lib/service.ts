import {CommonRenderRoute, CommonSubmitRoute} from "./types.ts";
import {recordSubmittedAction} from "../../outcome/outcome.ts";

const API_HOST = CONNECT_API_URL || `${location.protocol}//${location.host.replace("-web", "")}`;

export const submitAction = (payload: CommonSubmitRoute): Promise<CommonRenderRoute> => {
   recordSubmittedAction(payload.action);
   return fetch(API_HOST, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(payload)
   })
   .then((response) => response.json())
}
