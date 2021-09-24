| 해당 저장소는 42서울 본과정생들의 클러스터 체크인, 체크아웃을 위한 사이트의 서버 프로젝트입니다.
### 서버 실행 방법
1. 패키지를 설치합니다.
```shell
yarn
```
2. MySQL db를 실행시킵니다. (이후 `.env.development`에 설정한 환경변수에 알맞은 값들을 지정해줍니다.)
3. 42 플랫폼에서 APP을 발급받습니다.  (이후 `.env.development`에 설정한 환경변수에 알맞은 값들을 지정해줍니다.)
4. 서버를 실행합니다.
```shell
yarn start
```

### 환경 세팅

#### 데이터베이스 구성
MySQL 데이터베이스를 생성한 후 다음 쿼리를 실행시켜주세요.
```sql
CREATE SCHEMA checkin_dev DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;

use checkin_dev;

create table config
(
    _id bigint auto_increment,
    env varchar(45) null,
    begin_at timestamp null,
    end_at timestamp null,
    seocho int null,
    gaepo int null,
    constraint config__id_uindex
        unique (_id)
);

create table history
(
    _id bigint auto_increment,
    login varchar(50) null,
    type varchar(20) null,
    card_no int null,
    deleted_at timestamp null,
    updated_at timestamp null,
    created_at timestamp null,
    constraint history__id_uindex
        unique (_id)
);

alter table history
    add primary key (_id);

create table users
(
    _id bigint auto_increment,
    login varchar(50) not null comment '42 Intra ID',
    type varchar(10) null comment 'User Type (admin, ...)',
    card_no int null comment 'Real card serial number of offline cluster',
    state varchar(10) null comment 'User의 최종 상태 (Reserved)',
    checkin_at timestamp null comment '체크인 시간',
    checkout_at timestamp null comment '체크아웃 시간',
    checkout_by varchar(50) null comment '누가 checkout을 했는지 기록 (강제 체크아웃의 경우 관리자 계정 login)',
    email varchar(100) null,
    deleted_at timestamp null,
    updated_at timestamp null,
    created_at timestamp null,
    constraint users__id_uindex
        unique (_id),
    constraint users_login_uindex
        unique (login)
)
comment '카뎃 체크인/체크아웃 상태 정보';

alter table users
    add primary key (_id);

DELIMITER $$

CREATE PROCEDURE genYearConfig(
    year INT
)
    BEGIN
    DECLARE begin_at TIMESTAMP  DEFAULT CONCAT(year, '-01-01 07:00:00');
    DECLARE end_at TIMESTAMP DEFAULT CONCAT(year, '-01-01 22:00:00');
    DECLARE i INT DEFAULT 1;
    WHILE (i <= 365) DO
        INSERT INTO \`checkin_dev\`.config (env, begin_at, end_at, seocho, gaepo) VALUES ('development', DATE_ADD(begin_at, INTERVAL i DAY), DATE_ADD(end_at, INTERVAL i DAY), 124, 124);
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;
CALL genYearConfig(2021);
```

#### 환경변수 파일 설정
`.env.sample`을 참고하여 환경변수파일들을 작성합니다.

- `.env.development`
    - 로컬테스트용 환경변수
- `.env.test`
    - 테스트서버용 환경변수
- `.env.production`
    - 실서버용 환경변수

##### 42API 키 발급받기
1. 인트라넷 로그인
2. 우측상단 프로필 클릭
3. `Settings` 클릭
4. `API` 클릭
5. `REGISTER A NEW APP`
6. 각 폼을 채워줍니다.
    - `Website`
        - 로컬에서 프론트엔드 서버를 띄울 포트까지 같이 적어줍니다.
        - `ex) http://localhost:3001`
    - `Redirect URI`
        - 로그인 API사용시, 인트라넷에서 로그인이 완료되었을 때 리다이렉트 시킬 URL을 입력합니다.
        - `ex) http://localhost:3000/user/login/callback`
    - `Scopes`
        - 유저의 정보를 어디까지 수집할건지를 선택할 수 있으나, 그대로 둡니다.
7. `Submit` 버튼 클릭
8. 이제 발급받은 키들을 환경변수 파일에 넣어줍니다.
    ```shell
    CLIENT_ID=<UID KEY>
    CLIENT_SECRET=<SECRET KEY>
    ```

### 스크립트
```shell
yarn start
```
- 서버를 실행합니다.

```shell
yarn test
```
- mocha를 통해 테스트를 실행합니다.


```shell
yarn build
```
- production 배포용 빌드를 진행합니다

```shell
yarn test_build
```
- test 배포용 빌드를 진행합니다


### 디렉토리 설명
```plain
├── logs
├── src
│		├── @types
│		├── controllers
│		├── models
│		├── modules
│		├── routes
│		└── service
└── test
```
- `logs`
    - 로그가 저장되는 폴더
- `@types`
    - 전역에서 사용되는 라이브러리의 인터페이스 커스텀하기 위한 파일
- `controllers`
    - 라우터에서 사용되는 컨트롤러들
- `models`
    - ORM로 작성한 각 테이블의 모델들
- `modules`
    - 여러곳에서 재사용하기 위한 모듈성 기능들
- `routes`
    - 라우터들을 모아놓은 디렉토리
- `service`
    - 컨트롤러에서 재사용하기 하기 위한 서비스 함수들
- `test`
    - 테스트를 위한 코드

### 사용스택
- typescript
- expressjs
- sequelize
- passportjs

### 문서
- [postman API 문서](https://documenter.getpostman.com/view/3786872/TzeahRAU)
    - postman을 설치후 [해당 json파일](https://gist.github.com/padawanR0k/40c7bff905f5d03abfb3e8735ce61558)을 import하여 사용하는 것도 가능합니다.
- [Confluence](https://42cadet.atlassian.net/wiki/spaces/CHKN/overview)
- [JIRA](https://42cadet.atlassian.net/secure/RapidBoard.jspa?projectKey=CHKN)
- [github wiki (초기)](https://github.com/padawanR0k/42s_checkin_server/wiki)


### 참고
- [클라이언트 프로젝트](https://bitbucket.org/42seoul/checkin_front)
- [프로젝트 초기](https://github.com/42CivicHacking/42_checkIn)