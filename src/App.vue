<template>
  <v-app>
    <!-- 상단에 항상 고정되는 헤더 -->
    <HeaderComponent />

    <!-- 메인 콘텐츠 영역 -->
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- 좌측: 라우터 뷰 (예, SearchView) -->
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
import HeaderComponent from './components/HeaderComponent.vue';
import RankingComponent from './components/RankingComponent.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    RankingComponent,
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
