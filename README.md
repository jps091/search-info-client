##  📑 Web Search with Naver Open API - 웹 검색 서비스(Client with Vue.js)

해당 [백엔드 서버](https://github.com/jps091/web-search-server)의 클라이언트 서버 입니다. Nginx를 통해 배포를 진행하였습니다.

---

### 🗂 프로젝트 구조
- Component : 공통 기능 vue 파일 디렉토리
- View : 특정 기능 vue 파일 디렉토리

---

### 🌈 Nginx conf 파일

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
