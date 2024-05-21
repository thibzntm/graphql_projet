import { gql } from '@apollo/client';

export const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      id
      email
      name
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const CREATE_RECETTE = gql`
mutation CreateRecette($title: String!, $description: String!, $ingredients: String!, $imageUrl: String, $etapes: [String!]!) {
  createRecette(title: $title, description: $description, ingredients: $ingredients, imageUrl: $imageUrl, etapes: $etapes) {
    id
    title
    description
    ingredients
    imageUrl
    etapes {
      id
      description
    }
    author {
      id
      name
    }
  }
}
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($recetteId: ID!, $content: String!) {
    createComment(recetteId: $recetteId, content: $content) {
      id
      content
      author {
        id
        name
      }
    }
  }
`;

export const LIKE_RECETTE = gql`
  mutation LikeRecette($recetteId: ID!) {
    likeRecette(recetteId: $recetteId) {
      id
      user {
        id
        name
      }
      recette {
        id
        title
      }
    }
  }
`;

export const DELETE_RECETTE = gql`
  mutation DeleteRecette($id: ID!) {
    deleteRecette(id: $id) {
      id
    }
  }
`;