<template>
  <v-app>
    <!-- 상단에 항상 고정되는 헤더 -->
    <HeaderComponent />

    <!-- 메인 콘텐츠 영역 -->
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- 좌측: 라우터 뷰 (예: SearchView) -->
          <v-col cols="12" md="8">
            <router-view />
          </v-col>
          <!-- 우측: 랭킹 컴포넌트 (오른쪽 1/4 영역) -->
          <v-col cols="12" md="4">
            <!-- sticky 클래스로 스크롤 시에도 고정 -->
            <div class="sticky-ranking">
              <RankingComponent />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import HeaderComponent from './components/HeaderComponent.vue';
import RankingComponent from './components/RankingComponent.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    RankingComponent,
  },
  created() {
    this.initializeGuestToken();
  },
  methods: {
    initializeGuestToken() {
      // localStorage에 저장된 토큰 객체를 확인합니다.
      const storedTokenData = localStorage.getItem('guestToken');
      if (storedTokenData) {
        const tokenObj = JSON.parse(storedTokenData);
        // 현재 시간과 만료 시간을 비교합니다.
        if (Date.now() > tokenObj.expires) {
          console.log('토큰 만료됨, 재발급 요청합니다.');
          localStorage.removeItem('guestToken');
          this.fetchGuestToken();
        } else {
          console.log('유효한 토큰이 이미 존재합니다:', tokenObj.token);
        }
      } else {
        this.fetchGuestToken();
      }
    },
    fetchGuestToken() {
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/api/v1/chat-rooms/token`, {})
        .then((response) => {
          // 서버 응답이 { token: "발급된UUID" } 형태라고 가정합니다.
          const token = response.data.token;
          // 만료시간을 1시간(3600000ms)으로 설정
          const expires = Date.now() + 3600000;
          localStorage.setItem(
            'guestToken',
            JSON.stringify({ token, expires }),
          );
          console.log('Guest token 저장 완료:', token);
        })
        .catch((error) => {
          console.error('Guest token 발급 실패:', error);
        });
    },
  },
};
</script>

<style>
/* 랭킹 컴포넌트를 헤더 아래에 고정시키기 위한 sticky 처리 */
.sticky-ranking {
  position: sticky;
  top: 80px; /* 헤더 높이에 맞춰 조정 (예: 80px) */
}
</style>
