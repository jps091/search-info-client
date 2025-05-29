<template>
  <v-app>
    <!-- 1) 헤더 -->
    <HeaderComponent />

    <!-- 2) 요약 배너: 헤더 아래 확장 영역 -->
    <SummaryBanner />

    <!-- 3) 메인 콘텐츠 -->
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="8">
            <router-view />
          </v-col>
          <v-col cols="12" md="4">
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
import HeaderComponent from '@/components/HeaderComponent.vue';
import SummaryBanner from '@/components/SummaryBanner.vue';
import RankingComponent from '@/components/RankingComponent.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    SummaryBanner,
    RankingComponent,
  },
  created() {
    this.initializeGuestToken();
  },
  methods: {
    initializeGuestToken() {
      const stored = localStorage.getItem('guestToken');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Date.now() > parsed.expires) {
            console.log('🔁 토큰 만료됨 → 재발급 요청');
            localStorage.removeItem('guestToken');
            this.fetchGuestToken();
          } else {
            console.log('✅ 유효한 토큰 있음:', parsed.token);
          }
        } catch (e) {
          console.warn('⚠️ 토큰 파싱 실패 → 재요청');
          localStorage.removeItem('guestToken');
          this.fetchGuestToken();
        }
      } else {
        this.fetchGuestToken();
      }
    },
    fetchGuestToken() {
      fetch(`${process.env.VUE_APP_BASE_URL}/api/v1/chat-rooms/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data) => {
          const token = data.token;
          const expires = Date.now() + 3600000; // 1시간 후 만료
          localStorage.setItem(
            'guestToken',
            JSON.stringify({ token, expires }),
          );
          console.log('🎟️ Guest token 저장 완료:', token);
        })
        .catch((err) => {
          console.error('❌ Guest token 발급 실패:', err);
        });
    },
  },
};
</script>

<style>
/* 랭킹 컴포넌트를 헤더/요약 아래 고정 */
.sticky-ranking {
  position: sticky;
  top: 160px; /* 헤더(약 64) + 요약 배너(약 56~80) */
}
</style>
