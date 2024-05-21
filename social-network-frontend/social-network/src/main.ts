import { createApp, provide, h } from 'vue';
import { ApolloClients } from '@vue/apollo-composable';
import App from './App.vue';
import router from './router';
import client from './graphql/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp({
  setup() {
    provide(ApolloClients, {
      default: client,
    });
  },
  render: () => h(App),
});

app.use(router);
app.mount('#app');
