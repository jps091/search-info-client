import { createRouter, createWebHashHistory } from 'vue-router';
import SearchView from '@/views/SearchView.vue';

const routes = [
  {
    path: '/',
    name: 'Search',
    component: SearchView,
  },
  // 추후 다른 기능 화면이 추가될 경우 여기에 경로를 추가
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
