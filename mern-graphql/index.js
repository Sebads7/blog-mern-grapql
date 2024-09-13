const express = require("express");

const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");

const app = express();

let usersList = [
  { id: "1", name: "john doe", email: "jon@test.com" },
  { id: "2", name: "jane doe", email: "jan@test.com" },
  { id: "3", name: "jay doe", email: "jay@test.com" },
];

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    // get all users
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return usersList;
      },
    },

    // add single user
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return usersList.find((user) => user.id === args.id);
      },
    },
  },
});

const mutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: { name: { type: GraphQLString }, email: { type: GraphQLString } },
      resolve(parent, { name, email }) {
        const newUser = { name, email, id: Date.now().toString() };

        usersList.push(newUser);
        return newUser;
      },
    },

    // update user
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      resolve(parent, { id, email, name }) {
        const user = usersList.find((user) => user.id === id);
        (user.email = email), (user.name = name);
        return user;
      },
    },
    // delete user
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, { id }) {
        const user = usersList.find((user) => user.id === id);
        usersList = usersList.filter((user) => user.id !== id);
        return user;
      },
    },
  },
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: mutations });

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

app.listen(3000, () => {
  console.log("server running on port 3000");
});
