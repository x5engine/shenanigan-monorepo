import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { globalIdField } from "graphql-relay";

import {
  ChallengeLoader,
  DonationLoader,
  PredictionLoader,
} from "../../loaders";
import { GraphQLContext } from "../../TypeDefinition";
import { connectionArgs, connectionDefinitions, withFilter } from "../../utils";
import { ChallengeConnection } from "../challenge/ChallengeType";
import { DonationConnection } from "../donation/DonationType";
import { nodeInterface, registerTypeLoader } from "../node/typeRegister";
import { PredictionConnection } from "../prediction/PredictionType";
import { load } from "./UserLoader";
import { IUser } from "./UserModel";

const UserType = new GraphQLObjectType<IUser, GraphQLContext>({
  name: "User",
  description: "User data",
  fields: () => ({
    id: globalIdField("User"),
    _id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: (user) => user._id,
    },
    username: {
      type: GraphQLString,
      resolve: (user) => user.username,
    },
    email: {
      type: GraphQLString,
      resolve: (user) => user.email,
    },
    password: {
      type: GraphQLString,
      resolve: (user) => user.password,
    },
    predictions: {
      type: GraphQLNonNull(PredictionConnection.connectionType),
      args: {
        ...connectionArgs,
      },
      resolve: async (user, args, context) =>
        await PredictionLoader.loadAll(
          context,
          withFilter(args, {
            creator: user._id,
          })
        ),
    },
    donations: {
      type: GraphQLNonNull(DonationConnection.connectionType),
      args: {
        ...connectionArgs,
      },
      resolve: async (user, args, context) =>
        await DonationLoader.loadAll(
          context,
          withFilter(args, {
            creator: user._id,
          })
        ),
    },
    createdChallenges: {
      type: GraphQLNonNull(ChallengeConnection.connectionType),
      args: {
        ...connectionArgs,
      },
      resolve: async (user, args, context) =>
        await ChallengeLoader.loadAll(
          context,
          withFilter(
            { args },
            {
              creator: user._id,
            }
          )
        ),
    },
  }),
  interfaces: () => [nodeInterface],
});

export const UserConnection = connectionDefinitions({
  name: "User",
  nodeType: UserType,
});

registerTypeLoader(UserType, load);

export default UserType;
