import { gql } from "@apollo/client";

export const connectBeQuery = gql`
  mutation ConnectBE($connectInput: ConnectInput) {
    connectBE(connectInput: $connectInput)
  }
`;

export const claim = gql`
  mutation Mutation {
    fakeClaim
  }
`;
