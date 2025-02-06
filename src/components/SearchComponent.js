const BASE_URL = 'http://localhost:8080'; // 백엔드 서버의 기본 URL

export default {
  data() {
    return {
      searchQuery: '', // 검색어 입력값
      searchResults: [], // 검색 결과 리스트
      topKeywords: [], // 상위 키워드 리스트
    };
  },
  methods: {
    // HTML 태그를 제거하는 헬퍼 함수
    stripHTMLTags(text) {
      const div = document.createElement('div');
      div.innerHTML = text;
      return div.textContent || div.innerText || '';
    },

    // 상위 검색어 데이터를 백엔드에서 가져오는 메서드
    updateRanking() {
      fetch(`${BASE_URL}/api/v1/webs/stats/ranking`, {
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
          if (data && data.length > 0) {
            this.topKeywords = data;
          } else {
            this.topKeywords = [];
          }
        })
        .catch((error) => {
          console.error('상위 검색어 가져오기 중 오류 발생:', error);
        });
    },

    // 검색 API를 호출하는 메서드
    search() {
      const query = this.searchQuery.trim();
      if (!query) {
        alert('검색어를 입력하세요.');
        return;
      }

      fetch(
        `${BASE_URL}/api/v1/webs?query=${encodeURIComponent(
          query,
        )}&page=1&size=15`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      )
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
          if (data && data.contents) {
            this.searchResults = data.contents.map((result) => ({
              ...result,
              // 제목의 <b> 태그 제거
              title: result.title.replace(/<\/?b>/g, ''),
              // 설명에서 HTML 태그 제거 후, 빈 값이면 "설명 없음" 처리
              description:
                this.stripHTMLTags(result.description) || '설명 없음',
            }));
          } else {
            this.searchResults = [];
          }
          // 검색 결과 렌더링 후 1초 지연 후 상위 검색어 갱신
          setTimeout(() => {
            this.updateRanking();
          }, 1000);
        })
        .catch((error) => {
          console.error('검색 또는 상위 검색어 갱신 중 오류 발생:', error);
        });
    },
  },
  created() {
    this.updateRanking();
  },
};
