<!-- src/App.vue -->
<template>
  <v-app>
    <!-- 1) 헤더: 버튼만 -->
    <HeaderComponent />

    <!-- 2) 요약 배너: 앱바 밖 -->
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
};
</script>

<style>
.sticky-ranking {
  position: sticky;
  top: 160px; /* Header(64) + Banner(~56) + 여백 */
}
</style>
