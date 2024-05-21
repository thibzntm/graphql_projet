<template>
    <div>
      <h1>Inscription</h1>
      <form @submit.prevent="signup">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <div>
          <label for="name">Name:</label>
          <input type="text" v-model="name" required />
        </div>
        <button type="submit">Signup</button>
      </form>
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
            //console.log('User signed up:', response.data.signup);
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
  /* Ajoutez vos styles ici */
  </style>
  