<template>
  <v-app-bar app elevation="1" class="app-bar">
    <v-container fluid class="header-container">
      <v-row align="center" no-gutters>
        <v-col cols="12" class="header-col">
          <v-btn text :to="{ path: '/' }" class="title-text">
            Search Info 검색 서비스
          </v-btn>
          <v-btn
            outlined
            :to="{ path: '/groupchatting/list' }"
            class="subtitle-text chat-room-btn"
          >
            지난 상위 검색어(구현중)
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: 'HeaderComponent',
};
</script>

<style scoped>
/* 앱바 전체 스타일: 충분한 패딩과 최소 높이 설정 */
.app-bar {
  background-color: #e6f7ff;
  border-bottom: 1px solid #c0d8e8;
  padding: 20px 24px; /* 위, 아래 여백을 충분히 줌 */
  min-height: 100px;
  box-sizing: border-box;
  overflow: visible; /* 내부 내용이 잘리지 않도록 */
}

/* header-container는 전체 너비를 사용 */
.header-container {
  padding: 0 !important;
  width: 100%;
}

/* header-col: flex 속성을 이용해 가로로 넓게 확장 */
.header-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
  width: 100%;
  overflow: visible;
}

/* 제목 스타일: 버튼의 기본 배경 및 포커스 효과 제거 */
.title-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  text-transform: none;
  white-space: nowrap;
  overflow: visible;
  text-align: left;
  padding: 0;
  margin-top: 7px;
  background-color: none !important;
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
}

/* 부제목 스타일 */
.subtitle-text {
  font-size: 0.75rem;
  color: #000;
  text-transform: none;
  margin-top: 8px;
  white-space: nowrap;
  overflow: visible;
  padding: 0;
}

/* 채팅방 버튼 스타일 */
.chat-room-btn {
  background-color: #e5ecef;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.75rem;
  text-transform: none;
  margin-left: 16px;
  margin-top: 8px;
  position: relative;
  z-index: 10;
  transition: background-color 0.3s ease;
}

.chat-room-btn:hover {
  background-color: #aadeef;
}
</style>
