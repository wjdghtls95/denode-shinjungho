### ✅ 실행 순서 요약 (최초 환경 세팅부터 API 테스트까지)

---

#### 1. Docker 및 필수 도구 설치

**● Docker Desktop 설치 (Mac)**

* [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/) 에서 다운로드 및 설치

**● Homebrew 를 이용한 설치 (macOS)**

```bash
# Homebrew 설치 (https://brew.sh)
https://brew.sh
or
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# node.js 설치
brew install node

# pnpm 설치 (npm 기반 패키지 매니저)
npm install -g pnpm

# Docker 설치
brew install --cask docker

# Docker 설치 확인
docker --version
docker-compose --version

Docker App 실행
```

---

#### 2. `.env` 파일 복사

```bash
cp config/.{app}.{environment}.env .env

.{app}.{environment}.env 은 템플릿입니다.
```

예시:

```bash
cp config/.api.test.env .env
```

##### 📌 구성 및 의도 설명

* 이 프로젝트에서는 **앱 이름(app)** 과 **환경(environment)** 을 조합해 `.env` 템플릿 파일을 다음과 같은 형식으로 구성합니다:

  ```
  .{app}.{environment}.env
  ```

* 예시:

  * `api` 앱의 테스트 환경 설정 → `config/.api.test.env`
  * `admin` 앱의 운영 환경 설정 → `config/.admin.prod.env`

* 이 방식은 **여러 앱과 다양한 환경(dev/test/prod)** 을 명확하게 구분 및 관리할 수 있도록 돕기 위한 구조입니다.

* 실행 환경에 맞게 템플릿을 복사하여 `.env`로 설정한 후 서버를 실행해야 합니다.

* 이 명령은 반드시 **프로젝트 루트에서 실행**되어야 하며, `.env` 파일이 없으면 서버 실행이 되지 않습니다.

---

#### 3. MySQL 컨테이너 실행 (Docker)

```bash
docker-compose up -d
```

* `docker-compose.yml`에 정의된 설정대로 MySQL 컨테이너가 실행됩니다.

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

* 서버 주소: `http://localhost:3000`

---

#### 6. Swagger 접속 & API 테스트

* Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

##### 🔄 테스트 순서 예시

1. **회원가입** → `POST /user/register`
2. **로그인 및 토큰 발급** → `POST /auth/login` → 받은 accessToken을 Swagger 우측 상단 🔒 Authorize에 등록 (앞뒤 `"` 제거 필요)
3. **Authorize 확인** → `GET /users/me`
3. **제품 등록** → `POST /products`
4. **재고 입고** → `POST /inventories/in`
5. **재고 출고** → `POST /inventories/out`
6. **보유 재고 목록** → `POST /products`
7. **입출고 이력 조회** → `GET /inventories/history`

---

#### 7. Docker 컨테이너 종료 (선택)

```bash
docker-compose down
```
