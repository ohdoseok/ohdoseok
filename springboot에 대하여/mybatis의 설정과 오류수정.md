mybatis설정

---
application.properties의 설정

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/mybuddy?useUniCode=yes&characterEncoding=UTF-8&serverTimezone=Asia/Seoul
spring.datasource.username=ssafy
spring.datasource.password=ssafy

mybatis.type-aliases-package=com.example.ssafytask01.dto
mybatis.mapper-locations=classpath:mappers/**/*.xml

---


* mysql관련설정
jmysql의 jdbc드라이버와 mysql url, username과 password 설정
mybatis.mapper-locations으로 sql문이 작성된 xml파일이 있는 곳을 설정해준다.

---

* mybatis의 사용을 위한 mapping설정
mybatis.type-aliases-package를 지정해두면 Mapper XML 파일에 resultType 클래스의 패키지를 안적고 클래스명만 써도 되게 해준다.
(여러개의 패키지를 지정하고 싶다면 패키지경로, 패키지경로 이런식으로 ,로 구분해준다)



---

* 오류수정

Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is org.springframework.transaction.CannotCreateTransactionException: Could not open JDBC Connection for transaction; nested exception is java.sql.SQLException: Access denied for user 'jeong'@'localhost' (using password: YES)] with root cause
라는 오류가 검출
-> 계정권한을 추가해줘야함


1. 사용자를 추가하며 비밀번호까지 설정한다.

CREATE USER 계정명입력@localhost identified by '비밀번호';
 

2. 계정에 권한 부여

GRANT ALL PRIVILEGES ON 데베명입력.* TO 계정명입력@localhost;
 

3. 권한 적용

flush privileges;
  

4. 권한 확인

SHOW GRANTS FOR 계정명@localhost;