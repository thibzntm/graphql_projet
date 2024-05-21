<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Marmitools</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    <div v-else>
      <div class="top-recettes">
        <h2 class="mb-4">Top Recettes</h2>
        <div class="row">
          <div v-for="recette in topRecettes" :key="recette.id" class="col-md-4 mb-4">
            <div class="card h-100">
              <router-link :to="`/recette/${recette.id}`" class="text-decoration-none text-dark">
                <img v-if="recette.imageUrl" :src="recette.imageUrl" alt="Image de la recette" class="card-img-top recette-image"/>
                <div class="card-body">
                  <h5 class="card-title">{{ recette.title }}</h5>
                  <p class="card-text">Likes: {{ recette.likesCount }}</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_TOP_RECETTES } from '../graphql/queries';

export default defineComponent({
  setup() {
    const { loading, result, refetch } = useQuery(GET_TOP_RECETTES);
    const topRecettes = ref([]);

    watchEffect(() => {
      if (result.value) {
        topRecettes.value = result.value.topRecettes;
      }
    });

    return {
      loading,
      topRecettes,
      refetch,
    };
  },
});
</script>

<style scoped>
.recette-image {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
}

.card {
  border: 1px solid #e3e3e3;
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.02);
}
</style>
