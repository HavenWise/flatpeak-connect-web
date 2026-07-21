import {CommonRenderRoute, CommonSubmitRoute} from "./types.ts";

const API_HOST = CONNECT_API_URL || `${location.protocol}//${location.host.replace("-web", "")}`;

export const submitAction = (payload: CommonSubmitRoute): Promise<CommonRenderRoute> => {
   return fetch(API_HOST, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(payload)
   })
   .then((response) => response.json())
}
