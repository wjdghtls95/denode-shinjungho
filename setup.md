### ✅ 실행 순서 요약 ( 최초 환경 세팅부터 API 테스트까지 )

---

#### 1. Docker 설치

* **Docker Desktop 설치 (Mac/Windows)**
  → [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

* **또는 Homebrew로 설치 (macOS)**

  ```bash
  brew install --cask docker
  
  // docker 설치 확인
  docker --version
  docker-compose --version
  ```

  > 설치 후 Docker 앱을 실행해 주세요.

---

#### 2. `.env` 파일 복사

```bash
cp config/.api.dev.env .env
```

* 현재 `.env` 템플릿 파일은 `config/.api.{환경}.env` 형식으로 되어 있습니다.
* 여기서:

    * `api`: NestJS 애플리케이션이 위치한 `apps/api` 디렉토리를 의미
    * `test`: 테스트(로컬) 환경을 의미
* 위 명령은 프로젝트 루트에서 실행하면되며 `.env` 파일이 없으면 서버 실행이 안되기 때문에 반복해야합니다.

---

#### 3. Docker로 MySQL 컨테이너 실행

```bash
docker-compose up -d
```

* `docker-compose.yml`에 정의된 설정대로 MySQL이 실행됩니다.

---

#### 4. 의존성 설치

```bash
pnpm install
```

---

#### 5. NestJS 서버 실행

```bash
npm run start
```

* 기본 실행 주소: `http://localhost:3000`

---

#### 6. Swagger UI 접속 및 테스트

* Swagger: `http://localhost:3000/api`
* 테스트 예시 순서:

    1. 회원가입 → `/user/register`
    2. 로그인 후 토큰 발급 → accessToken 활용
       ```bash
       "accessToken": "eyJhbGciOiJIUzI1.... 에서
       eyJhbGciOiJIUzI1.. 을 우측 상단 좌물쇠(Authorize) 에 등록
       
       "" 는 빼고 등록해야됨
       ```
    3. 재고 입고 → `/inventories/in`
    4. 재고 출고 → `/inventories/out`
    5. 보유 재고 목록 → `/products/stocked`
    6. 입출고 이력 → `/inventories/history`

---

#### 7. 컨테이너 종료 (필요 시)

```bash
docker-compose down
```

---
