<template>
  <v-app>
    <HeaderComponent />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import HeaderComponent from './components/HeaderComnponent.vue';
export default {
  name: 'App',
  components: {
    HeaderComponent,
  },
};
</script>
