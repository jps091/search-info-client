<template>
  <v-app-bar app elevation="1" class="app-bar">
    <v-container>
      <v-row align="center">
        <v-col class="d-flex flex-column align-start">
          <v-btn :to="{ path: '/' }" variant="text" class="title-text">
            Search Info 검색 서비스
          </v-btn>
          <v-btn
            :to="{ path: '/groupchatting/list' }"
            variant="outlined"
            class="subtitle-text chat-room-btn"
          >
            오늘의 상위 키워드 채팅방 목록
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: 'HeaderComponent',
};
</script>

<style src="./HeaderComponent.css" scoped></style>
