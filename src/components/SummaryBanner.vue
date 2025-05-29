<template>
  <v-app-bar app elevation="2" class="header-main">
    <v-container fluid class="d-flex align-center">
      <!-- 1) 타이틀 버튼 -->
      <v-btn text :to="{ path: '/' }" class="title-btn">
        Search Info 검색 서비스
      </v-btn>

      <v-spacer />

      <!-- 2) 채팅방 목록 버튼 -->
      <v-btn outlined :to="{ path: '/chat-rooms' }" class="chatroom-btn">
        상위 키워드 단체 채팅방 목록
      </v-btn>
    </v-container>

    <!-- 3) 확장 슬롯: 요약 영역 -->
    <template v-slot:extension>
      <v-container fluid class="summary-extension">
        <div class="summary-title">오늘의 IT 뉴스</div>
        <v-row dense>
          <v-col
            v-for="(line, idx) in summaries"
            :key="idx"
            cols="12"
            class="summary-line"
          >
            • {{ line }}
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-app-bar>
</template>

<script>
const BASE_URL = process.env.VUE_APP_BASE_URL;
export default {
  name: 'HeaderComponent',
  data() {
    return {
      summaries: [],
    };
  },
  created() {
    fetch(`${BASE_URL}/api/v1/webs/summary`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json) => {
        this.summaries = Array.isArray(json) ? json : [];
      })
      .catch(() => {
        this.summaries = [];
      });
  },
};
</script>

<style scoped>
.header-main {
  background-color: #ffffff;
}

/* 1) 타이틀 */
.title-btn {
  color: #1976d2;
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: none;
}

/* 2) 채팅방 버튼 */
.chatroom-btn {
  color: #1976d2;
  text-transform: none;
}

/* 3) 요약 확장 영역 */
.summary-extension {
  background-color: #fafafa;
  padding: 16px 24px;
}
.summary-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 8px;
}
.summary-line {
  font-size: 0.95rem;
  color: #424242;
  line-height: 1.6;
  margin-bottom: 4px;
}
</style>
