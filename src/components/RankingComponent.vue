<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="card">
          <h2 class="section-title ranking-title">TODAY HOT 검색어</h2>
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
</template>

<script>
const BASE_URL = 'http://localhost:8080';
//const BASE_URL = '';

export default {
  name: 'RankingComponent',
  data() {
    return {
      topKeywords: [], // 상위 검색어 데이터 배열
      eventSource: null, // SSE 연결 객체
      reconnectAttempts: 0, // 재연결 시도 횟수
      maxReconnectAttempts: 10, // 최대 재연결 시도 횟수
      baseDelay: 1000, // 기본 대기 시간 (1초)
      maxDelay: 20000, // 최대 대기 시간 (20초)
    };
  },
  methods: {
    // 초기 데이터 로딩: HTTP GET 요청으로 상위 검색어 데이터를 가져옴
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
    // SSE 연결 설정 및 재연결을 위한 지수 백오프 적용
    setupEventSource() {
      // SSE 연결 수립
      this.eventSource = new EventSource(`${BASE_URL}/api/sse/connect`);

      // 연결 성공 시 재연결 시도 횟수를 초기화
      this.eventSource.onopen = () => {
        console.log('SSE 연결이 성공적으로 수립되었습니다.');
        this.reconnectAttempts = 0;
      };

      // "rankingUpdate" 이벤트 처리: 서버에서 전달된 데이터를 JSON 파싱 후 갱신
      this.eventSource.addEventListener('rankingUpdate', (event) => {
        try {
          const data = JSON.parse(event.data);
          this.topKeywords = data;
        } catch (error) {
          console.error('rankingUpdate 이벤트 파싱 오류:', error);
        }
      });

      // 연결 오류 시 처리 및 재연결 시도 (지수 백오프 적용)
      this.eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        // 현재 연결 종료
        this.eventSource.close();

        // 재연결 시도 횟수 증가
        this.reconnectAttempts++;

        if (this.reconnectAttempts <= this.maxReconnectAttempts) {
          // 지수 백오프를 이용한 재연결 딜레이 계산 (최대 딜레이를 넘지 않도록)
          const delay = Math.min(
            this.baseDelay * Math.pow(2, this.reconnectAttempts),
            this.maxDelay,
          );
          console.log(
            `재연결 시도 ${this.reconnectAttempts}회, ${delay}ms 후 재연결 시도...`,
          );

          // 딜레이 후 재연결 시도
          setTimeout(() => {
            this.setupEventSource();
          }, delay);
        } else {
          console.error(
            '최대 재연결 시도 횟수를 초과했습니다. SSE 연결을 재수립하지 않습니다.',
          );
          // 필요한 경우, 사용자에게 알림을 표시하는 로직을 추가할 수 있습니다.
        }
      };
    },
  },
  created() {
    // 컴포넌트 생성 시 초기 데이터 로딩 및 SSE 연결 설정
    this.fetchInitialRanking();
    this.setupEventSource();
  },
  beforeUnmount() {
    // 컴포넌트 소멸 전 SSE 연결 종료하여 자원 해제
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
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
  font-size: 1.1em;
}
.count {
  font-size: 0.9em;
  color: #888;
  margin-left: 5px;
}
</style>
