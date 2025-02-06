<template>
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
              @keyup.enter="search"
            ></v-text-field>
            <v-btn color="primary" block large @click="search">검색</v-btn>
            <!-- 검색 결과 -->
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

        <!-- 상위 키워드 섹션 (오른쪽 1/3) -->
        <v-col cols="12" md="4" class="ranking-section">
          <div class="card">
            <!-- 상위 제목 추가 -->
            <h2 class="section-title ranking-title">TODAY HOT 검색어</h2>
            <h2 class="section-title">TODAY HOT 검색어</h2>
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
</template>

<script src="./SearchComponent.js"></script>
<style src="./SearchComponent.css" scoped></style>
