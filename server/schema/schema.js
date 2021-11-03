const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

// Dummy data
const books = [
  {id:'1', name: 'BOOK 1', genre: 'Sci-fi'},
  {id:'2', name: 'BOOK 2', genre: 'Action'},
  {id:'3', name: 'BOOK 3', genre: 'Adventure'},
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id:{ type: GraphQLString } },
      resolve(parent, args) {
        // code to get data from db / other source
        return _.find(books, {id: args.id});
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: RootQuery
});