<template>
  <div class="container mt-5">
    <h1 class="mb-4">Ajouter une recette</h1>
    <form @submit.prevent="createRecette">
      <div class="mb-3">
        <label for="title" class="form-label">Titre :</label>
        <input type="text" class="form-control" v-model="title" required />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description :</label>
        <textarea class="form-control" v-model="description" rows="3" required></textarea>
      </div>
      <div class="mb-3">
        <label for="ingredients" class="form-label">Ingrédients :</label>
        <textarea class="form-control" v-model="ingredients" rows="3" required></textarea>
      </div>
      <div class="mb-3">
        <label for="imageUrl" class="form-label">URL de l'image :</label>
        <input type="text" class="form-control" v-model="imageUrl" />
      </div>
      <div v-for="(etape, index) in etapes" :key="index" class="mb-3">
        <label :for="'etape' + index" class="form-label">Étape {{ index + 1 }} :</label>
        <textarea :id="'etape' + index" class="form-control" v-model="etapes[index]" rows="2" required></textarea>
        <button type="button" class="btn btn-secondary mb-3" @click="addEtape">
        <i class="fas fa-plus"></i> Ajouter une étape
        </button>
      </div>
      
      <button type="submit" class="btn btn-primary">
        <i class="fas fa-check"></i> Ajouter la recette
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { CREATE_RECETTE } from '../graphql/mutations';

export default defineComponent({
  setup() {
    const title = ref('');
    const description = ref('');
    const ingredients = ref('');
    const imageUrl = ref('');
    const etapes = ref<string[]>(['']);
    const { mutate: createRecetteMutation } = useMutation(CREATE_RECETTE);

    const addEtape = () => {
      etapes.value.push('');
    };

    const createRecette = async () => {
      try {
        const response = await createRecetteMutation({
          title: title.value,
          description: description.value,
          ingredients: ingredients.value,
          imageUrl: imageUrl.value,
          etapes: etapes.value,
        });
        if (response && response.data && response.data.createRecette) {
          window.location.href = '/recettes';
        }
      } catch (error) {
        console.error('Erreur lors de la création de la recette:', error);
      }
    };

    return {
      title,
      description,
      ingredients,
      imageUrl,
      etapes,
      addEtape,
      createRecette,
    };
  },
});
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
