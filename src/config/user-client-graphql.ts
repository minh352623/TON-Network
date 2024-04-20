import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
  HttpLink,
  split,
} from "@apollo/client/core";

export const BASE_URL =
  process.env.VUE_APP_BASE_URL || "https://solx-be2.teknix.dev/graphql";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useUserStore } from "store/userStore";
import { getLocalStore } from "utils";
const httpLink = new HttpLink({
  uri: BASE_URL,
});

//for test

const testToken = getLocalStore("access_token");
console.log("🚀 ~ testToken:", testToken);

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: testToken ? `Bearer ${testToken}` : "Bearer ",
    },
  });
  return forward(operation);
});

export const userClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "ws://localhost:8080/subscriptions",
        })
      )
    : null;

const link =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

export const subscriptionClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
