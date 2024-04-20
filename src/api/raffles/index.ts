import { basicClient } from "config/basic-client-graphql";
import { userClient } from "config/user-client-graphql";
import { claim, connectBeQuery } from "./mutation";

class Raffles {
  async connectBE(data: IConnectBE) {
    const result = await basicClient.mutate({
      mutation: connectBeQuery,
      variables: { connectInput: data },
    });
    console.log("🚀 ~ Raffles ~ connectBE ~ result:", result.data.connectBE);

    return result.data.connectBE.access_token;
  }
  async testClientSend() {
    const result = await userClient.mutate({
      mutation: claim,
      variables: { claimId: "data" },
    });
    return result;
  }
}

export const apiRaffles = new Raffles();
