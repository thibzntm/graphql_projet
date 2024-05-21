export interface Recette {
    id: number;
    title: string;
    description: string;
    ingredients: string;
    etapes: Etape[];
    author: User;
    comments: Comment[];
    likes: Like[];
  }
  
  export interface Etape {
    id: number;
    description: string;
    recetteId: number;
  }
  
  export interface User {
    id: number;
    email: string;
    name: string;
    recettes: Recette[];
    comments: Comment[];
    likes: Like[];
  }
  
  export interface Comment {
    id: number;
    content: string;
    authorId: number;
    recetteId: number;
    author: User;
    recette: Recette;
  }
  
  export interface Like {
    id: number;
    userId: number;
    recetteId: number;
    user: User;
    recette: Recette;
  }
  