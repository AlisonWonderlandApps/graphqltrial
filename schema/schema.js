const graphql = require('graphql');
// const _ = require('lodash');
const axios = require('axios');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        console.log(parentValue, args);
        // this returns the company values for the user
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(response => response.data);
      }
    }
  }
});

//dummy data
// const users = [
//   { id: '23', firstName: 'Matt', age: 205 },
//   { id: '47', firstName: 'Ally', age: 134 },
//   { id: '33', firstName: 'Tim', age: 283 }
// ];

// find user with id=?
// resolve(args = whatever args passed into orig query)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        console.log(parentValue, args);
        // return _.find(users, { id: args.id });
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(response => response.data);
      }
    }
  }
});

// const CompanyQuery = new GraphQLObjectType({
//     name: 'CompanyQueryType',
//     fields: {

//     }
// })

module.exports = new GraphQLSchema({
  query: RootQuery
});
