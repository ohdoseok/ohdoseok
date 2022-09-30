## JPA 정리

**프로젝트 진행하면서 정리한 JAP내용**

- 즉시로딩과 지연로딩

```
 team과 person은 1:N 관계이다
 @ManyToOne(fetch = FetchType.LAZY)
 팀의 정보는 필요없고 사람의 정보만 필요하다면 team객체생성을 lazy로 필요하다면 select하게 하고 필요없다면 아예 찾지않는 방법이 lazy loading

 하지만 만약 팀의 정보가 필요하다면 2번의 select가 나오기 때문에 지연로딩을 하면 손해인 경우도 생긴다.

 자주 함께 사용한다면 즉시로딩(default설정)을 하고 가끔 사용한다면 지연로딩을 추천
 하지만 즉시로딩은 jpa가 조인을 해서 한번에 가져오게 되는데 관계가 복잡한 테이블의 경우 모두 즉시로딩을 사용하면 모두 조인이 일어난다.

 즉시로딩과 지연로딩은 생각해 봐야할일.

 또한 open-ssesion-in-view 가 false 라면 lazy loading은 transaction 밖에서 시도 하기때문에 에러를 낸다.
```

- 영속성 컨텍스트

```
영속성 컨텍스트란 엔티티를 영구 저장하는 환경 이라는 뜻이다.
애플리케이션과 데이터베이스 사이에서 객체를 보관하는 가상의 데이터베이스 같은 역할을 한다.
엔티티 매니저를 통해 엔티티를 저장하거나 조회하면 엔티티 매니저는 영속성 컨텍스트에 엔티티를 보관하고 관리한다.

만약 데이터 조회시 영속성 컨텍스트에 존재하면 캐시에서 가져오고 없으면 그때 db를 조회한다. 그리고 가져오면서 캐시에 저장한다.

jpa에서 save()를 할때 persist()되면서 영속성 컨텍스트에 등록되는데 트랜젝션이 종료 될때 flush()로 db에 저장되게 된다.

요청이 올때마다 생성되는 캐시이다.

그렇다면 update와 save는 어떻게 구분할까? commit또는 flush가 일어날때 엔티티와 스냅샷을 비교해서 변경사항이 있으면 알아서 update 쿼리를 작성한다.

flush 다음에 commit이 일어남
flush가 일어난다고 영속성 컨텍스트를 비우는 것이 아니라 플러시는 영속성 컨텍스트의 변경 내용을 데이터 베이스와 동기화한다.

영속성 컨텍스트는 delete가 실행되서 실제로 영속성 컨텍스트에서 삭제하고 데이터베이스에 삭제쿼리를 날린다.
```

- 데이터 베이스 초기화 전략 ddl-auto 옵션

```
none : 아무것도 실행하지 않는다.
create-drop : sessionfactory가 시작될 때 drop및 생성을 실행하고, 종료될때 drop한다.
create : sessionfactory가 시작될 때 데이터 베이스 drop을 실행하고 생성된 ddl을 실행한다.
update : 변경된 스키마를 적용한다.
validate : 변경된 싀마가 있다면 변경점을 출력하고 애플리케이션을 종료한다.

만약 운영중인 상태에서 스키마를 변경할일이 생긴다고 update하면 안된다.
사용중이던 자료들이 모두 날아갈수있다.
database 에서 직접 alter하는것을 추천한다.
```

---

개발 흐름

1. ERD 설계
2. yml파일작성, h2,context-path,port,datasource,jpa등의 dependency
3. domain 작성(Entity)
4. repository 작성(Entity를 기반으로 c,r,u,d 를 담당하는 jparepository interface를 상속받은 interface)
5. repository를 실질적으로 사용할 service interface와 serviceImpl interface 작성
6. api를 받아서 처리할 controller 작성

---

디테일한 부분은 프로젝트에서 확인

2. yml파일 작성

server부분

```
server:
  servlet:
    context-path: /api      ->      nginx에서 api요청구분을 위함
  port: 8888                ->      포트설정
```

spring부분

```
spring:
  config:
    activate:
      on-profile: production-set1   ->  무중단 배포에서 switch를 할때 profile을 기준으로 switch 하기 위해서 필요함
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://j7d106.p.ssafy.io:3306/doseok?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
    username: hive
    password: nh+7&(tUa7p[NYcAae{Sno&LM698=1
  jpa:
    defer-datasource-initialization: true   ->  @entity를 사용하면 jpa가 자동으로 ddl문을 만들어주는데 이후에 데이터를 자동으로 초기값으로 넣어주기 위해서 data.sql을 사용하는데 스프링 2.5이상부터는 data.sql이 hibernate가 초기화 되기 전에 실행되며 hibernate에 의해 생성된 스키마에 데이터를 넣기 위해서 사용해야함.


    show-sql: true  ->  hibernate가 만들어준 SQL을 로그에서 보려면  true로 설정해야함
    generate-ddl: true  ->  서버 시작 시점에 ddl문을 생성하여 DB에 적용한다
    properties:
      hibernate:
        format_sql: true    ->      보여지는 쿼리를 예쁘게 포맷팅 해준다.
        dialect: org.hibernate.dialect.MySQL5InnoDBDialect  ->  JPA는 특정 데이터베이스에 종속적이지 않으며 해당 DBMS에 맞는 쿼리를 생성해준다.

    open-in-view: true  ->  true로 설정시 영속성 컨텍스트가 트랜잭션 범위를 넘어선 레이어까지 살아있다. api라면 클라이언트에게 응답 될 때까지, view라면 view가 랜더링될 때까지 영속성컨텍스트가 살아있다.
    false 라면 트랜잭션을 종료할 때 영속성 컨텍스트 또한 닫힌다.

    hibernate:
      ddl-auto: none    ->      위에 있음
      naming:
        physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl   ->  jpa는 entity생성시 변수 명을 카멜언더바(UserName -> user_name) 으로 변경하는데 변수명을 그대로 db컬럼명으로 사용하고 싶을때 사용

      use-new-id-generator-mappings: false      ->      설정안해주면 jpa은 다른 엔티티들을 save할때 자동으로 id를 올려버려서 A테이블 1 이후 B테이블 2로 저장되는 테이블 시퀀스 전략으로(모든 엔티티 id값을 시퀀스 테이블 하나에서 통합적으로 관리) 모든 엔티티 id값이 하나의 엔티티 처럼 증가해버린다.

  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher   ->  스프링 2.6 버전 이후에 몇몇 라이브러리(swagger)에 오류가 발생한다. 이래도 swagger에러 발생시 스프링부트 버전을 2.5아래로 낮추는 걸 추천
  h2:
    console:
      enabled: true     ->      h2 콘솔 활성화
  datasource:
    url: jdbc:h2:mem:test db;MODE=MySQL;DATABASE_TO_UPPER=FALSE;    ->  h2 testdb에 mem 인 메모리 데이터베이스로 동작하고, mysql형식으로, 데이터베이스가 전부 대문자로 바뀌어버려서 db가 운영이 안되는 경우가 생겨서 db생성시 upper을 막아주는 false설정
```

```
logging:
  level:
    org.hibernate.sql: debug    ->  디버그 내용이 콘솔에 찍힘
```

```
cloud:
  aws:
    credentials:
      access-key: {}    ->  iam에서 생성한 access-key   @value("${cloud.aws.credentials.access-key}")로 사용가능하다
      secret-key: {}
    s3:
      bucket: {}    ->  bucket(폴더와 비슷) 이름
    region:
      static: ap-northeast-2    ->      한국지역
      auto: false
    stack:
      auto: false   ->  프로젝트를 aws 서버에 배포할때 기본으로 cloudformation 구성을 시작하기 때문에 설정한 cloudformation이 없으면 프로젝트 실행이 되지 않는다.
```

---

2. dependency(build.gradle)

- **lombok, swagger(springfox), healthcheck을 위한 actuator, s3사용을 위한 cloud-starter-aws, jwt사용을 위한 jjwt, mysql사용을 위한 mysql-connector, 기본 spring-boot-starter**

```
plugins {
    id 'org.springframework.boot' version '2.4.0'
    id 'io.spring.dependency-management' version '1.0.13.RELEASE'
    id 'java'
}

group = 'com.ssafy'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '1.8'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    annotationProcessor 'org.projectlombok:lombok'
//    runtimeOnly 'com.h2database:h2'
    implementation 'mysql:mysql-connector-java'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    implementation 'io.jsonwebtoken:jjwt:0.9.1'
    implementation "io.springfox:springfox-boot-starter:3.0.0"
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.cloud:spring-cloud-starter-aws:2.2.6.RELEASE'
}

tasks.named('test') {
    useJUnitPlatform()
}

```
