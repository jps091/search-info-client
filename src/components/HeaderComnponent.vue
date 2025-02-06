<template>
  <v-app>
    <!-- 헤더: 연한 파란색 배경, 약간 어두운 테두리 -->
    <v-app-bar app elevation="1" class="app-bar">
      <v-container>
        <v-row align="center">
          <v-col class="d-flex flex-column align-start">
            <v-btn :to="{ path: '/' }" variant="text" class="title-text">
              Search Info 검색 서비스
            </v-btn>
            <v-btn
              :to="{ path: '/groupchatting/list' }"
              variant="text"
              class="subtitle-text"
            >
              오늘의 상위 키워드 채팅방 목록
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- 본문 영역: 헤더와 자연스럽게 연결 -->
    <v-main class="main-container">
      <v-container>
        <v-row>
          <!-- 검색 섹션 (왼쪽 2/3) -->
          <v-col cols="12" md="8" class="search-section">
            <div class="card">
              <h2 class="section-title">검색</h2>
              <v-text-field
                v-model="searchQuery"
                label="검색어를 입력하세요..."
                variant="outlined"
                dense
                class="search-input"
              ></v-text-field>
              <v-btn color="primary" block large @click="search"> 검색 </v-btn>

              <!-- 검색 결과 -->
              <div v-if="searchResults.length" class="search-result">
                <h3>검색 결과</h3>
                <ul>
                  <li v-for="(result, index) in searchResults" :key="index">
                    <a :href="result.link" target="_blank">{{
                      result.title
                    }}</a>
                    <p>{{ result.description }}</p>
                  </li>
                </ul>
              </div>
            </div>
          </v-col>

          <!-- 상위 키워드 섹션 (오른쪽 1/3) -->
          <v-col cols="12" md="4" class="ranking-section">
            <div class="card">
              <h2 class="section-title">월별 상위 15개 검색어 순위</h2>
              <ul>
                <li v-for="(keyword, index) in topKeywords" :key="index">
                  {{ index + 1 }}. {{ keyword.query }}
                  <span class="count">({{ keyword.count }})</span>
                </li>
              </ul>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* 전체 앱 배경: 연한 파란색 */
.v-application {
  background-color: #e6f7ff;
}

/* 헤더 스타일: 연한 파란색 배경, 약간 어두운 테두리 */
.app-bar {
  background-color: #e6f7ff;
  border-bottom: 1px solid #c0d8e8;
  padding: 10px 0;
}

/* 제목 스타일: 1.5rem, 파란색 (#007bff) */
.title-text {
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: none;
  color: #007bff;
}

/* 부제목 스타일: 0.75rem, 검정색 */
.subtitle-text {
  font-size: 0.75rem;
  text-transform: none;
  color: #000;
}

/* 본문 컨테이너: 헤더와 자연스럽게 연결 (v-main 자동 공간 할당) */
.main-container {
  padding: 20px;
}

/* 카드 스타일: 검색/상위 키워드 영역에 적용 */
.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 검색 섹션 스타일 */
.search-section {
  padding-right: 20px;
}
.search-input {
  margin-bottom: 15px;
}

/* 검색 결과 스타일 */
.search-result {
  margin-top: 20px;
}
.search-result h3 {
  margin-bottom: 10px;
}
.search-result a {
  color: #007bff;
  text-decoration: none;
  font-size: 1.1em;
}
.search-result a:hover {
  text-decoration: underline;
}
.search-result p {
  margin: 5px 0 0;
  font-size: 0.9em;
  color: #555;
}

/* 상위 키워드 섹션 스타일 */
.ranking-section {
  padding-left: 20px;
}
.ranking-section ul {
  list-style: none;
  padding: 0;
}
.ranking-section li {
  margin-bottom: 10px;
  font-size: 1.1em;
}
.ranking-section .count {
  font-size: 0.9em;
  color: #888;
  margin-left: 5px;
}

/* 섹션 제목 스타일 (공통) */
.section-title {
  margin-bottom: 15px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
}
</style>

<script>
export default {
  data() {
    return {
      searchQuery: '', // 검색어 입력값
      searchResults: [], // 검색 결과 리스트
      topKeywords: [], // 상위 키워드 리스트
    };
  },
  methods: {
    search() {
      console.log('검색 실행:', this.searchQuery);
      // TODO: 백엔드 API 호출 로직 추가
      // 예제 데이터 (API 연동 전 테스트용)
      this.searchResults = [
        {
          title: 'Vue.js 튜토리얼',
          link: 'https://vuejs.org',
          description: 'Vue.js 공식 사이트',
        },
        {
          title: 'Vuetify란?',
          link: 'https://vuetifyjs.com',
          description: 'Vuetify 공식 문서',
        },
      ];
    },
    updateRanking() {
      console.log('상위 검색어 목록 가져오기');
      // TODO: 백엔드 API 호출 로직 추가
      // 예제 데이터 (API 연동 전 테스트용)
      this.topKeywords = [
        { query: 'Vuetify 사용법', count: 120 },
        { query: 'Vue.js 시작하기', count: 98 },
        { query: 'Spring Boot 연동', count: 85 },
      ];
    },
  },
  created() {
    this.updateRanking(); // 페이지 로드시 상위 키워드 불러오기
  },
};
</script>
