<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h1 class="text-center mb-4">Inscription</h1>
            <form @submit.prevent="signup">
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" v-model="email" class="form-control form-control-lg" id="email" required />
              </div>
              <div class="form-group">
                <label for="password">Mot de passe:</label>
                <input type="password" v-model="password" class="form-control form-control-lg" id="password" required />
              </div>
              <div class="form-group">
                <label for="name">Nom:</label>
                <input type="text" v-model="name" class="form-control form-control-lg" id="name" required />
              </div>
              <br>
              <button type="submit" class="btn btn-primary btn-lg w-100">
                <i class="fas fa-user-plus"></i> S'inscrire
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
import { SIGNUP } from '../graphql/mutations';

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const name = ref('');
    const { mutate: signupMutation } = useMutation(SIGNUP);

    const signup = async () => {
      try {
        const response = await signupMutation({
          email: email.value,
          password: password.value,
          name: name.value,
        });
        if (response && response.data) {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error signing up:', error);
      }
    };

    return {
      email,
      password,
      name,
      signup,
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
