<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="card">
          <h2 class="section-title">검색</h2>
          <v-text-field
            v-model="searchQuery"
            label="검색어를 입력하세요..."
            variant="outlined"
            dense
            class="search-input"
            @keyup.enter="search"
          ></v-text-field>
          <v-btn color="primary" block large @click="search">검색</v-btn>
          <!-- 검색 결과 표시 -->
          <div v-if="searchResults.length" class="search-result">
            <h3>검색 결과</h3>
            <ul>
              <li v-for="(result, index) in searchResults" :key="index">
                <a :href="result.link" target="_blank">{{ result.title }}</a>
                <p>{{ result.description }}</p>
              </li>
            </ul>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//const BASE_URL = 'http://localhost:8080';
const BASE_URL = '';

export default {
  name: 'SearchView',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
    };
  },
  methods: {
    stripHTMLTags(text) {
      const div = document.createElement('div');
      div.innerHTML = text;
      return div.textContent || div.innerText || '';
    },
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
              title: result.title.replace(/<\/?b>/g, ''),
              description:
                this.stripHTMLTags(result.description) || '설명 없음',
            }));
          } else {
            this.searchResults = [];
          }
        })
        .catch((error) => {
          console.error('검색 중 오류 발생:', error);
        });
    },
  },
  created() {
    // 만약 라우터 쿼리 파라미터에 검색어가 있다면 자동으로 검색 실행
    if (this.$route.query.query) {
      this.searchQuery = this.$route.query.query;
      this.search();
    }
  },
  watch: {
    // 라우터 쿼리 파라미터가 변경될 때마다 검색 실행
    '$route.query.query'(newQuery) {
      if (newQuery) {
        this.searchQuery = newQuery;
        this.search();
      }
    },
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
.search-input {
  margin-bottom: 15px;
}
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
</style>
