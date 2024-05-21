<template>
    <div class="container mt-5">
      <h1 class="text-center mb-4">Mes Recettes</h1>
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
      <div v-else>
        <div v-if="recettes.length === 0" class="alert alert-info text-center">
          Vous n'avez pas encore créé de recettes.
        </div>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" v-else>
          <div v-for="recette in recettes" :key="recette.id" class="col">
            <div class="card h-100">
              <router-link :to="`/recette/${recette.id}`">
                <img v-if="recette.imageUrl" :src="recette.imageUrl" alt="Image de la recette" class="card-img-top"/>
                <div class="card-body">
                  <h5 class="card-title">{{ recette.title }}</h5>
                  <p class="card-text">{{ recette.description }}</p>
                </div>
              </router-link>
              <div class="card-footer">
                <button @click="deleteRecette(recette.id)" class="btn btn-danger w-100">
                  <i class="fas fa-trash-alt"></i> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue';
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import { GET_MY_RECETTES } from '../graphql/queries';
  import { DELETE_RECETTE } from '../graphql/mutations';
  
  export default defineComponent({
    setup() {
      const { loading, result, refetch } = useQuery(GET_MY_RECETTES);
      const recettes = ref([]);
  
      watchEffect(() => {
        if (result.value) {
          recettes.value = result.value.myRecettes;
        }
      });
  
      const { mutate: deleteRecetteMutation } = useMutation(DELETE_RECETTE);
  
      const deleteRecette = async (id: string) => {
        try {
          await deleteRecetteMutation({ variables: { id } });
          refetch();
        } catch (error) {
          console.error('Erreur lors de la suppression de la recette:', error);
        }
      };
  
      return {
        loading,
        recettes,
        deleteRecette,
        refetch,
      };
    },
  });
  </script>
  
  <style scoped>
  .card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: bold;
  }
  
  .card-img-top {
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: cover;
  }
  
  .card-footer {
    padding: 0.75rem 1.25rem;
  }
  
  .btn-danger {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-danger i {
    margin-right: 0.5rem;
  }
  </style>
  