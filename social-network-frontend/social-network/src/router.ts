import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import SignupView from './views/SignupView.vue';
import RecetteView from './views/RecetteView.vue';
import CreateRecetteView from './views/CreateRecetteView.vue';
import RecettesView from './views/RecettesView.vue';
import MyRecettes from './views/MyRecettes.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/signup', component: SignupView },
  { path: '/recette/:id', component: RecetteView, props: true },
  { path: '/create-recette', component: CreateRecetteView },
  { path: '/recettes', component: RecettesView },
  { path: '/my-recettes', component: MyRecettes },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
