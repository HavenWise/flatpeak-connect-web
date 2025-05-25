import {CommonRenderRoute, CommonSubmitRoute} from "./types.ts";

const API_HOST = import.meta.env.VITE_CONNECT_API_URL || `${location.protocol}//${location.host.replace("-web", '')}`;

export const submitAction = (payload: CommonSubmitRoute): Promise<CommonRenderRoute> => {
   return fetch(API_HOST, {
       method: 'POST',
       body: JSON.stringify(payload)
   })
   .then((response) => response.json())
}
