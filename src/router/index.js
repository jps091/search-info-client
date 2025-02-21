import { createRouter, createWebHashHistory } from 'vue-router';
import SearchView from '@/views/SearchView.vue';
import ChatRoomList from '@/views/ChatRoomList.vue';
import ChatPage from '@/views/ChatPage.vue';

const routes = [
  {
    path: '/',
    name: 'Search',
    component: SearchView,
  },
  {
    path: '/chat-rooms',
    name: 'ChatRooms',
    component: ChatRoomList,
  },
  {
    path: '/chatpage/:roomKeyword',
    name: 'ChatPage',
    component: ChatPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
