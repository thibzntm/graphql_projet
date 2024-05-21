"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const resolvers = {
    Query: {
        users: async (_parent, _args, context) => {
            return context.prisma.user.findMany();
        },
        recettes: async (_parent, _args, context) => {
            return context.prisma.recette.findMany({ include: { author: true, comments: { include: { author: true } }, likes: true, etapes: true } });
        },
        topRecettes: async (_parent, _args, context) => {
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
        recette: async (_parent, args, context) => {
            return context.prisma.recette.findUnique({
                where: { id: parseInt(args.id, 10) },
                include: { author: true, comments: { include: { author: true } }, likes: true, etapes: true },
            });
        },
        myRecettes: async (_parent, _args, context) => {
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
        likesCount: (parent) => parent.likes.length,
    },
    Mutation: {
        signup: async (_parent, args, context) => {
            const existingUser = await context.prisma.user.findUnique({
                where: { email: args.email },
            });
            if (existingUser) {
                throw new Error('Email déjà existant');
            }
            const hashedPassword = await bcrypt_1.default.hash(args.password, 10);
            return context.prisma.user.create({
                data: {
                    email: args.email,
                    password: hashedPassword,
                    name: args.name,
                },
            });
        },
        login: async (_parent, args, context) => {
            console.log('Received login args:', args);
            const user = await context.prisma.user.findUnique({ where: { email: args.email } });
            if (!user) {
                throw new Error('No such user found');
            }
            const valid = await bcrypt_1.default.compare(args.password, user.password);
            if (!valid) {
                throw new Error('Invalid password');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, 'APP_SECRET');
            return token;
        },
        createRecette: async (_parent, args, context) => {
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
        createComment: async (_parent, args, context) => {
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
        likeRecette: async (_parent, args, context) => {
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
        deleteAllLikes: async () => {
            const deleteResult = await prisma.like.deleteMany({});
            return deleteResult.count;
        },
        deleteAllComments: async () => {
            const deleteResult = await prisma.comment.deleteMany({});
            return deleteResult.count;
        },
        deleteRecette: async (_parent, args, context) => {
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
exports.default = resolvers;
