import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query {
    users {
      id
      email
      name
    }
  }
`;

export const GET_RECETTES = gql`
  query GetRecettes {
    recettes {
      id
      title
      description
      imageUrl
      likes {
        id
      }
    }
  }
`;

export const GET_TOP_RECETTES = gql`
  query GetTopRecettes {
    topRecettes {
      id
      title
      description
      imageUrl
      likesCount
    }
  }
`;

export const GET_RECETTE = gql`
  query GetRecette($id: ID!) {
    recette(id: $id) {
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
      comments {
        id
        content
        author {
          id
          name
        }
      }
      likes {
        id
      }
    }
  }
`;

export const GET_MY_RECETTES = gql`
  query GetMyRecettes {
    myRecettes {
      id
      title
      description
      imageUrl
      likes {
        id
      }
    }
  }
`;