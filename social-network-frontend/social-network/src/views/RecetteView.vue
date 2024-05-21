<template>
    <div class="container mt-5">
      <h1 class="text-center mb-4">Recette</h1>
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
      <div v-else-if="recette">
        <div class="card mb-4">
          <img v-if="recette.imageUrl" :src="recette.imageUrl" alt="Image de la recette" class="card-img-top recette-image"/>
          <div class="card-body">
            <h2 class="card-title">{{ recette.title }}</h2>
            <p class="card-text">{{ recette.description }}</p>
            <p><strong>Ingrédients:</strong> {{ recette.ingredients }}</p>
            <div>
              <h3>Étapes:</h3>
              <ul class="list-group list-group-flush">
                <li v-for="etape in recette.etapes" :key="etape.id" class="list-group-item">
                  {{ etape.description }}
                </li>
              </ul>
            </div>
            <p class="mt-3"><strong>Author:</strong> {{ recette.author.name }}</p>
            <div>
              <h3>Commentaires:</h3>
              <div v-for="comment in recette.comments" :key="comment.id" class="mb-2">
                <div class="card">
                  <div class="card-body">
                    <p class="card-text">{{ comment.content }} - <strong>{{ comment.author.name }}</strong></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <h3>Likes:</h3>
              <p>{{ recette.likes.length }}</p>
              <button v-if="isLoggedIn" @click="likeRecette" class="btn btn-primary">
                <i class="fas fa-thumbs-up"></i> J'aime
              </button>
            </div>
            <div v-if="isLoggedIn" class="mt-4">
              <h3>Ajouter un commentaire:</h3>
              <form @submit.prevent="addComment">
                <div class="mb-3">
                  <textarea v-model="newComment" class="form-control" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-success">Ajouter</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-center">Recette non trouvée.</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watchEffect, computed } from 'vue';
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import { GET_RECETTE } from '../graphql/queries';
  import { CREATE_COMMENT, LIKE_RECETTE } from '../graphql/mutations';
  
  export default defineComponent({
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { loading, result, refetch } = useQuery(GET_RECETTE, { id: props.id });
      const recette = ref(null);
      const newComment = ref('');
      const isLoggedIn = computed(() => !!localStorage.getItem('token'));
  
      watchEffect(() => {
        if (result.value) {
          recette.value = result.value.recette;
        }
      });
  
      const { mutate: createCommentMutation } = useMutation(CREATE_COMMENT);
      const { mutate: likeRecetteMutation } = useMutation(LIKE_RECETTE);
  
      const addComment = async () => {
        try {
          const response = await createCommentMutation({
            variables: {
              recetteId: props.id,
              content: newComment.value,
            },
          });
          if (response && response.data && response.data.createComment) {
            recette.value.comments.push(response.data.createComment);
          }
          newComment.value = '';
        } catch (error) {
          console.error('Erreur lors de l\'ajout du commentaire:', error);
          location.reload();
        }
      };
  
      const likeRecette = async () => {
        try {
          const response = await likeRecetteMutation({
            variables: {
              recetteId: props.id,
            },
          });
          if (response && response.data && response.data.likeRecette) {
            recette.value.likes.push(response.data.likeRecette);
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout du like:', error);
          location.reload();
        }
      };
  
      return {
        loading,
        recette,
        newComment,
        addComment,
        likeRecette,
        refetch,
        isLoggedIn,
      };
    },
  });
  </script>
  
  <style scoped>
  .recette-image {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: cover;
  }
  
  .card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-title {
    font-size: 2rem;
    font-weight: bold;
  }
  
  .list-group-item {
    background-color: #f8f9fa;
  }
  
  .btn-primary, .btn-success {
    display: inline-flex;
    align-items: center;
  }
  
  .btn-primary i, .btn-success i {
    margin-right: 5px;
  }
  </style>
  