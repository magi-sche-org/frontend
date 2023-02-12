import {AuthorizeClient} from "@/service/api-client/protocol/AuthorizeServiceClientPb";
import {go_endpoint} from "@/libraries/env";
import {GetTokenRequest} from "@/service/api-client/protocol/authorize_pb";

const getToken = async() => {
  const client = new AuthorizeClient(go_endpoint);
  const req = new GetTokenRequest();
  const res =await client.getToken(req, null);
  localStorage.setItem("go_token",res.getToken());
}

export {getToken};