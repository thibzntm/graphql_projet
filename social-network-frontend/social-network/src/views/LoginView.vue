<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h1 class="text-center mb-4">Connexion</h1>
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" v-model="email" class="form-control form-control-lg" id="email" required />
              </div>
              <div class="form-group">
                <label for="password">Mot de passe:</label>
                <input type="password" v-model="password" class="form-control form-control-lg" id="password" required />
              </div>
              <br>
              <button type="submit" class="btn btn-primary btn-lg w-100">
                <i class="fas fa-sign-in-alt"></i> Se connecter
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
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
        if (token) {
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
.container {
  max-width: 700px;
}

.card {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 3rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary i {
  margin-right: 0.5rem;
}
</style>
