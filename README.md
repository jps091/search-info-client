##  📑 Web Search with Naver Open API - 웹 검색 서비스(Client with Vue.js)

해당 [백엔드 서버](https://github.com/jps091/web-search-server)의 클라이언트 서버 입니다. Nginx를 통해 배포를 진행하였습니다.

---

### 🗂 프로젝트 구조

```markdown
├── components # 공통 기능
│   └── HeaderComponent.vue # 페이지 헤더 
│   └── RankingComponent.vue # 상위 검색어
└── vue # 개별 기능 모듈
│   └── SearchView.vue # 검색 결과 화면
│   └── ChatRoomList.vue # 채팅방 리스트 화면
│   └── ChatPage.vue # 채팅방 입장 화면
└────────────────────────────────────────
```
---

### 🚴 기능 구현 화면

<img width="600" height="500" alt="image" src="https://github.com/user-attachments/assets/60cec586-2d8a-4402-bf09-d440248b1866" />
<img width="600" height="500" alt="image" src="https://github.com/user-attachments/assets/a20d0cb6-c4d3-4e20-82e4-ef1ca269f817" />
<img width="600" height="500" alt="image" src="https://github.com/user-attachments/assets/1de14851-e776-411d-a85d-c009ade57866" />

---

### 🌈 배포 방식 with Nginx
- conf.d file
```
  server {
    server_name search-info.n-e.kr;
    server_tokens off;
    
    root /var/www/dist;
    index index.html;

    location = / {
        try_files $uri /index.html;
    }

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }
    
    error_page 429 /429.html;
    location = /429.html {
        root /usr/share/nginx/html;
    }
}
```
