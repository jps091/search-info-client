<template>
  <v-container class="ranking-container" style="margin-top: 32px">
    <v-row>
      <v-col>
        <div class="card">
          <h2 class="section-title ranking-title">TODAY HOT 검색어</h2>
          <p class="subtitle">키워드 클릭시 검색 바로가기</p>
          <ul>
            <li
              v-for="(keyword, index) in topKeywords"
              :key="index"
              @click="handleKeywordClick(keyword.query)"
              v-ripple
            >
              {{ index + 1 }}. {{ keyword.query }}
              <span class="count">({{ keyword.count }})</span>
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const BASE_URL = process.env.VUE_APP_BASE_URL;

export default {
  name: 'RankingComponent',
  data() {
    return {
      topKeywords: [],
      eventSource: null,
      reconnectAttempts: 0,
      maxReconnectAttempts: 10,
      baseDelay: 1000,
      maxDelay: 20000,
    };
  },
  methods: {
    fetchInitialRanking() {
      fetch(`${BASE_URL}/api/v1/webs/ranking`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => {
          if (response.status === 429) {
            window.location.href = '/429.html';
            return;
          }
          if (!response.ok) {
            throw new Error(`HTTP 오류 발생: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          this.topKeywords = data && data.length > 0 ? data : [];
        })
        .catch((error) => {
          console.error('초기 상위 검색어 가져오기 중 오류 발생:', error);
        });
    },
    setupEventSource() {
      this.eventSource = new EventSource(`${BASE_URL}/api/sse/connect`);
      this.eventSource.onopen = () => {
        console.log('SSE 연결이 성공적으로 수립되었습니다.');
        this.reconnectAttempts = 0;
      };
      this.eventSource.addEventListener('rankingUpdate', (event) => {
        try {
          const data = JSON.parse(event.data);
          this.topKeywords = data;
        } catch (error) {
          console.error('rankingUpdate 이벤트 파싱 오류:', error);
        }
      });
      this.eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        this.eventSource.close();
        this.reconnectAttempts++;
        if (this.reconnectAttempts <= this.maxReconnectAttempts) {
          const delay = Math.min(
            this.baseDelay * Math.pow(2, this.reconnectAttempts),
            this.maxDelay,
          );
          console.log(
            `재연결 시도 ${this.reconnectAttempts}회, ${delay}ms 후 재연결 시도...`,
          );
          setTimeout(() => {
            this.setupEventSource();
          }, delay);
        } else {
          console.error(
            '최대 재연결 시도 횟수를 초과했습니다. SSE 연결을 재수립하지 않습니다.',
          );
        }
      };
    },
    handleKeywordClick(query) {
      // 검색 키워드를 클릭하면 "/" 경로(검색 뷰)로 이동하며, query 파라미터에 키워드를 전달
      this.$router.push({ path: '/', query: { query } });
    },
  },
  created() {
    this.fetchInitialRanking();
    this.setupEventSource();
  },
  beforeUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  },
};
</script>

<style scoped>
.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.section-title {
  margin-bottom: 15px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
}
.ranking-title {
  margin-bottom: 10px;
  font-size: 1.3rem;
  color: #007bff;
  font-weight: bold;
}
/* 부제목: 제목과 좌측 정렬, 폰트 크기는 절반 정도 */
.subtitle {
  font-size: 0.65em;
  color: #666;
  margin-bottom: 10px;
  margin-left: 0; /* 좌측 정렬 */
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
  font-size: 1.1em;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    text-decoration 0.2s ease;
}
li:hover {
  text-decoration: underline;
}
.count {
  font-size: 0.9em;
  color: #888;
  margin-left: 5px;
}
</style>
