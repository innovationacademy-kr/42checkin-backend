| 해당 저장소는 42서울 본과정생들의 클러스터 체크인, 체크아웃을 위한 사이트의 서버 프로젝트입니다.

### Wiki
- https://github.com/padawanR0k/42s_checkin_server/wiki

### 로컬환경에서의 실행
1. `./src/.env.development` 작성
    ```
    PORT=포트
    NODE_ENV=development


    DATABASE_HOST=연결할 데이터베이스의 호스트
    DATABASE_PORT=연결할 데이터베이스의 포트
    DATABASE_USERNAME=root
    DATABASE_PASSWORD=연결할 데이터베이스의 비밀번호
    DATABASE_NAME=연결할 데이터베이스의 스키마
    DATABASE_TYPE=연결할 데이터베이스의 종류

    CLIENT_ID=42인트라넷에서 발급받은 API ID
    CLIENT_SECRET=42인트라넷에서 발급받은 API SECRET KEY
    CLIENT_CALLBACK=42인트라넷에서 발급받은 callback url


    JWT_SECRET=passport-jwt에 사용할 값
    ```
2. `yarn && yarn start`
### 배포
1. `./src/.env.production` 작성
2. `yarn build`
3. 배포할 ec2에 파일 업로드
    - `scp -r {로컬에서 빌드디렉토리} {접근시사용할 아이디}@{서버ip}:{전달할 서버의 디렉토리}`
4. `npm install -g pm2`
5. `pm2 start {파일위치}/index.js --name server`

### 사용스택
- expressjs
- typeorm
- passportjs

### 참고
- [클라이언트 프로젝트](https://github.com/padawanR0k/42s_checkin_client)
