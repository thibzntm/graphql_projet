import { PrismaClient, User, Recette as PrismaRecette, Comment, Like, Etape } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Context } from './context';
import { Recette } from './types';

const prisma = new PrismaClient();

interface SignupArgs {
  email: string;
  password: string;
  name: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

interface CreateRecetteArgs {
  title: string;
  description: string;
  ingredients: string;
  imageUrl: string;
  etapes: string[];
}

interface DeleteRecetteArgs {
  id: string;
}

interface CreateCommentArgs {
  recetteId: string;
  content: string;
}

interface LikeRecetteArgs {
  recetteId: string;
}

const resolvers = {
  Query: {
    users: async (_parent: {}, _args: {}, context: Context): Promise<User[]> => {
      return context.prisma.user.findMany();
    },
    recettes: async (_parent: {}, _args: {}, context: Context): Promise<PrismaRecette[]> => {
      return context.prisma.recette.findMany({ include: { author: true, comments: { include: { author: true } }, likes: true, etapes: true } });
    },
    topRecettes: async (_parent: {}, _args: {}, context: Context): Promise<PrismaRecette[]> => {
      const recettes = await context.prisma.recette.findMany({
        take: 3,
        orderBy: {
          likes: {
            _count: 'desc',
          },
        },
        include: {
          author: true,
          comments: { include: { author: true } },
          likes: true,
          etapes: true,
        },
      });

      return recettes.map(recette => ({
        ...recette,
        likesCount: recette.likes.length,
      }));
    },
    recette: async (_parent: {}, args: { id: string }, context: Context): Promise<PrismaRecette | null> => {
      return context.prisma.recette.findUnique({
        where: { id: parseInt(args.id, 10) },
        include: { author: true, comments: { include: { author: true } }, likes: true, etapes: true },
      });
    },
    myRecettes: async (_parent: {}, _args: {}, context: Context): Promise<PrismaRecette[]> => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      return context.prisma.recette.findMany({
        where: { authorId: context.userId },
        include: { author: true, comments: { include: { author: true } }, likes: true, etapes: true },
      });
    },
  },
  Recette: {
    likesCount: (parent: Recette) => parent.likes.length,
  },
  Mutation: {
    signup: async (_parent: {}, args: SignupArgs, context: Context): Promise<User> => {
      const existingUser = await context.prisma.user.findUnique({
        where: { email: args.email },
      });

      if (existingUser) {
        throw new Error('Email déjà existant');
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);

      return context.prisma.user.create({
        data: {
          email: args.email,
          password: hashedPassword,
          name: args.name,
        },
      });
    },
    login: async (_parent: {}, args: LoginArgs, context: Context): Promise<string> => {
      console.log('Received login args:', args); 

      const user = await context.prisma.user.findUnique({ where: { email: args.email } });
      if (!user) {
        throw new Error('No such user found');
      }

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ userId: user.id }, 'APP_SECRET');
      return token;
    },

    createRecette: async (_parent: {}, args: CreateRecetteArgs, context: Context): Promise<PrismaRecette> => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      const recette = await context.prisma.recette.create({
        data: {
          title: args.title,
          description: args.description,
          ingredients: args.ingredients,
          imageUrl: args.imageUrl,
          author: { connect: { id: context.userId } },
          etapes: {
            create: args.etapes.map((etape) => ({ description: etape }))
          }
        },
        include: {
          etapes: true,
          author: true
        }
      });

      return recette;
    },

    createComment: async (_parent: {}, args: CreateCommentArgs, context: Context): Promise<Comment> => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      const comment = await context.prisma.comment.create({
        data: {
          content: args.content,
          recette: { connect: { id: parseInt(args.recetteId, 10) } },
          author: { connect: { id: context.userId } },
        },
        include: {
          author: true, // Inclure l'auteur lié au commentaire
        },
      });

      return comment;
    },
    likeRecette: async (_parent: {}, args: LikeRecetteArgs, context: Context): Promise<Like> => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      const userId = context.userId;
      const recetteId = parseInt(args.recetteId, 10);

      // Vérifiez s'il existe déjà un like pour cette recette et cet utilisateur
      const existingLike = await context.prisma.like.findFirst({
        where: {
          userId: userId,
          recetteId: recetteId,
        },
      });

      if (existingLike) {
        throw new Error('Vous avez déjà aimé cette recette');
      }

      return context.prisma.like.create({
        data: {
          recette: { connect: { id: recetteId } },
          user: { connect: { id: userId } },
        },
        include: {
          user: true,
          recette: true,
        },
      });
    },
    deleteAllLikes: async (): Promise<number> => {
      const deleteResult = await prisma.like.deleteMany({});
      return deleteResult.count;
    },
    deleteAllComments: async (): Promise<number> => {
      const deleteResult = await prisma.comment.deleteMany({});
      return deleteResult.count;
    },
    deleteRecette: async (_parent: {}, args: DeleteRecetteArgs, context: Context): Promise<PrismaRecette> => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      const recetteId = parseInt(args.id, 10);
      const recette = await context.prisma.recette.findUnique({
        where: { id: recetteId },
        include: { comments: true, likes: true, etapes: true },
      });

      if (!recette || recette.authorId !== context.userId) {
        throw new Error('Not authorized to delete this recette');
      }

      // Supprimer les dépendances avant de supprimer la recette
      await context.prisma.comment.deleteMany({
        where: { recetteId: recetteId },
      });

      await context.prisma.like.deleteMany({
        where: { recetteId: recetteId },
      });

      await context.prisma.etape.deleteMany({
        where: { recetteId: recetteId },
      });

      return context.prisma.recette.delete({
        where: { id: recetteId },
      });
    },
  },
};

export default resolvers;
