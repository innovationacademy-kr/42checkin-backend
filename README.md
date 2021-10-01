# 개요

- 해당 저장소는 사회적 거리두기가 시행됨에 따라, 42서울 본과정생들의 클러스터 입장인원수를 파악하기 위한 서비스의 서버 프로젝트입니다. 클라이언트 프로젝트는 해당 [저장소](https://bitbucket.org/42seoul/checkin_front/src/master)로 이동해주세요.
- 시설관리자를 위한 어드민 사이트의 클라이언트 프로젝트는 해당 [저장소](https://bitbucket.org/42seoul/admin_front/src/master/)에서 확인하실 수 있습니다.

# 프로젝트 구조

```plain
├── logs
├── src
│    ├── @types
│    ├── controllers
│    ├── models
│    ├── modules
│    ├── routes
│    └── service
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

## 설치 및 실행 방법

0. 해당 저장소를 클론해주세요.
1. 의존성 패키지들을 설치합니다.
   ```shell
   yarn
   ```
2. MySQL database를 실행시킨 후 아래 `환경세팅 - 데이터베이스 구성`영역의 쿼리를 실행시켜 스키마를 만듭니다. (이후 `.env.development`에 설정한 환경변수에 알맞은 값들을 지정해줍니다.)
   - [Docker를 사용하여 MySQL 설치하고 접속하기](https://poiemaweb.com/docker-mysql)
3. 42 플랫폼에서 APP을 발급받습니다. (이후 `.env.development`에 설정한 환경변수에 알맞은 값들을 지정해줍니다.)
4. 서버를 실행합니다.
   ```shell
   yarn start
   ```

[postman API 문서](https://documenter.getpostman.com/view/3786872/TzeahRAU)에서 API를 확인할 수 있습니다. postman을 로컬에 설치후 [해당 json설정파일](https://gist.github.com/padawanR0k/40c7bff905f5d03abfb3e8735ce61558)을 import하여 로컬환경에서 실행된 서버에 요청을 날려볼 수 있습니다.

## 데이터베이스 구성

MySQL 데이터베이스를 생성한 후 다음 쿼리를 실행시켜주세요. [링크](https://www.erdcloud.com/d/Lgah5ckDBLtFTNZLg)에서도 스키마를 확인하실 수 있습니다.

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
```

다음 쿼리문을 실행하여 config테이블에 특정년도 데이터를 생성해주세요.

```sql
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

## 42API 키 발급받기

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
   CLIENT_CALLBACK=<성공적으로 로그인을 끝냈을 때, 리다이렉트 시킬 URL>
   ```

## 환경별 .env 파일 설정

`.env.sample`을 참고하여 각 환경에 필요한 파일들을 작성합니다.

- `.env.development`
  - 로컬테스트용 환경변수
- `.env.test`
  - 테스트서버용 환경변수
- `.env.production`
  - 실서버용 환경변수

### 환경변수 작성시 주의점

- `URL_CLIENT`, `URL_ADMIN`의 경우 [CORS](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)설정을 위해 필요한 변수이므로 CORS정책에 위반된 값을 넣으면 애플리케이션이 클라이언트와 통신할 수 없습니다.
- 알림용 디스코드는 production 환경에서만 작동합니다.

## 스크립트

```shell
yarn start
```

- 서버를 실행합니다.

```shell
yarn test
```

- mocha를 통해 테스트를 실행합니다. 배포하기전에 확인을 위해 사용합니다.
- 자동화할 수 없는 테스트는 [구글 스프레드시트](https://docs.google.com/spreadsheets/d/1BC9fAJDSy3f-v4cuHWFBk7xGocIKcIzt3tNWIwEZJcE/edit?usp=sharing)로 관리합니다.

```shell
yarn build
```

- production 배포용 빌드를 진행합니다

```shell
yarn test_build
```

- test 배포용 빌드를 진행합니다

## 사용스택

- Typescript
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Passport.js](http://www.passportjs.org/packages/passport-42/)

## Git Branch

브랜치는 다음과 같이 운영됩니다.

- main: 실제 서비스에 배포되어 운영되고 있는 코드입니다.
- develop: 아직 서비스에 배포되지는 않았지만, 다음 버전에 배포될 코드입니다.
- feature: 개발 브랜치에서 뻗어나와 개발해야될 기능을 담은 코드입니다.

## 기여방법

1. `feature/기능명` 브랜치를 생성한 후 작업을 진행합니다.
2. pull request를 생성합니다.
3. 검수자가 확인과 테스트를 통해 병합여부를 판단한 후 merge가 완료되면, [jenkins를 통해 alpha 서버에 자동배포](http://checkin.alpha.42seoul.io/)를 진행합니다.
4. 오류가 발생하지 않으면 원본 bitbucket 레포지토리에 병합되며, 실서버에 배포됩니다.

### 문서

- [postman API 문서](https://documenter.getpostman.com/view/3786872/TzeahRAU)
  - postman import를 위한 [json파일](https://gist.github.com/padawanR0k/40c7bff905f5d03abfb3e8735ce61558)
- [Confluence](https://42cadet.atlassian.net/wiki/spaces/CHKN/overview)
- [JIRA](https://42cadet.atlassian.net/secure/RapidBoard.jspa?projectKey=CHKN)
- [github wiki (초기)](https://github.com/padawanR0k/42s_checkin_server/wiki)

### 참고

- [클라이언트 프로젝트](https://bitbucket.org/42seoul/checkin_front)
- [프로젝트 초기](https://github.com/42CivicHacking/42_checkIn)
- [체크인 서비스 client 프로젝트](https://bitbucket.org/42seoul/checkin_front/src/master)
- 트러블 슈팅, 기능 추가 과정을 정리한 글
  - [Slack을 활용한 서비스 오류/장애 모니터링](https://42place.innovationacademy.kr/archives/9271)
  - [node.js 서버에서 로그를 남겨보자](https://42place.innovationacademy.kr/archives/9137)
  - [production 환경에서 마주친 Cookie 이슈 해결하기](https://42place.innovationacademy.kr/archives/8950)
