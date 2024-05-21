<template>
  <div>
    <h1>Connexion</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Mot de passe:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Connexion</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { LOGIN } from '../graphql/mutations';

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const { mutate: loginMutation, onError } = useMutation(LOGIN);

    onError((error) => {
      console.error('Mutation error:', error);
      if (error.networkError) {
        console.error('Network error:', error.networkError);
      }
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((graphQLError) => {
          console.error('GraphQL error:', graphQLError);
        });
      }
    });

    const login = async () => {
      try {
        const response = await loginMutation({
            email: email.value,
            password: password.value,
        });
        
        const token = response?.data.login;
        if(token){
          localStorage.setItem('token', token);
          window.location.href = '/'; // Rafraîchit la page et redirige vers l'accueil
        }
        

      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

    return {
      email,
      password,
      login,
    };
  },
});
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
