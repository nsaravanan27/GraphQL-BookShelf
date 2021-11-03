const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString, GraphQLSchema } = graphql;

// Dummy data
const books = [
  {id:'1', name: 'BOOK 1', genre: 'Sci-fi', authorId: '1'},
  {id:'2', name: 'BOOK 2', genre: 'Action', authorId: '2'},
  {id:'3', name: 'BOOK 3', genre: 'Adventure', authorId: '3'},
  {id:'4', name: 'BOOK 4', genre: 'Fun', authorId: '3'},
];

const authors = [
  {id:'1', name: 'Author 1', age: 32},
  {id:'2', name: 'Author 2', age: 53},
  {id:'3', name: 'Author 3', age: 45},
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, {id: parent.authorId})
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    book: {
      type: new graphql.GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, {authorId: parent.id})
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id:{ type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        return _.find(books, {id: args.id});
      }
    },
    author: {
      type: AuthorType,
      args: { id: {type: GraphQLID}},
      resolve(parent, args) {
        return _.find(authors, {id: args.id});
      }
    },
    books: {
      type: new graphql.GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      }
    },
    authors: {
      type: new graphql.GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: RootQuery
});