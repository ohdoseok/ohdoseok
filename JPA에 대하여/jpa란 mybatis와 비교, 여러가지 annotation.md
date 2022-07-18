JPA란?
과거에 jdbc를 사용할때는 모든 sql문을 작성해서 보내줘야했고, 이를 보완하기 위해서
mybatis나 jdbc template가 나왔지만 여전히 sql문을 작성해야했다.
jpa는 개발자 대신 sql문을 생성해준다.

@Id는 해당 프로퍼티가 테이블의 primary key 역할을 한다는 것을 나타낸다.
@GeneratedValue는 primary key를 위한 자동 생성 전략을 명시하는데 사용한다.

hibernate.ddl-auto => 객체를 보고 알아서 테이블도 만들어줌