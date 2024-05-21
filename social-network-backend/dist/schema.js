"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const typeDefs = (0, graphql_tag_1.gql) `
  type User {
    id: ID!
    email: String!
    name: String!
    recettes: [Recette!]!
    comments: [Comment!]!
    likes: [Like!]!
  }

  type Recette {
    id: ID!
    title: String!
    description: String!
    ingredients: String!
    imageUrl: String
    etapes: [Etape!]!
    author: User!
    comments: [Comment!]!
    likes: [Like!]!
    likesCount: Int!
  }

  type Etape {
    id: ID!
    description: String!
    recette: Recette!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    recette: Recette!
  }

  type Like {
    id: ID!
    user: User!
    recette: Recette!
  }

  type Query {
    users: [User!]!
    recettes: [Recette!]!
    topRecettes: [Recette!]!
    recette(id: ID!): Recette 
    myRecettes: [Recette!]!
  }

  type Mutation {
    signup(email: String!, password: String!, name: String!): User
    login(email: String!, password: String!): String
    createRecette(title: String!, description: String!, ingredients: String!, imageUrl: String, etapes: [String!]!): Recette
    createComment(recetteId: ID!, content: String!): Comment
    likeRecette(recetteId: ID!): Like
    deleteAllLikes: Int
    deleteAllComments: Int
    deleteRecette(id: ID!): Recette
  }
`;
exports.default = typeDefs;
