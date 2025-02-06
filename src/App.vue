<template>
  <v-app>
    <HeaderComponent />
    <SearchComponent />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';
import SearchComponent from './components/SearchComponent.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    SearchComponent,
  },
};
</script>
