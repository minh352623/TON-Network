import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
  HttpLink,
} from "@apollo/client/core";
const token =
  process.env.VUE_APP_BASIC_TOKEN ||
  "YWRtaW46NzNBRENBQTRGRTNDNUNCMzE2OTIxNjI1RjE3OUQ";
const httpLink = new HttpLink({
  uri: process.env.VUE_APP_BASE_URL || "https://solx-be2.teknix.dev/graphql",
});
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: token ? `Basic ${token}` : "",
    },
  });
  return forward(operation);
});
export const basicClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});
