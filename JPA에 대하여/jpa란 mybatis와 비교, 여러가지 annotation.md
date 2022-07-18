* JPA란?
과거에 jdbc를 사용할때는 모든 sql문을 작성해서 보내줘야했고, 이를 보완하기 위해서
mybatis나 jdbc template가 나왔지만 여전히 sql문을 작성해야했다.
jpa는 개발자 대신 sql문을 생성해준다.
* @ 종류
@Id는 해당 프로퍼티가 테이블의 primary key 역할을 한다는 것을 나타낸다.
@GeneratedValue는 primary key를 위한 자동 생성 전략을 명시하는데 사용한다.
@Column(name = " ") 컬럼이름에 맞게 설정가능


* dependency ddl
hibernate.ddl-auto => 객체를 보고 알아서 테이블도 만들어줌
* @추가설명
jpa를 사용하기 위해서는 entity를 mapping해줘야한다.
@Entity를 해주면 이것은 앞으로 jpa가 관리한다라는 뜻
@Id => primary key
* @GeneratedValue
Auto Increment  ID => Identity 전략 => @GeneratedValue(strategy = GenerationType.IDENTITY

---
jpa는 EntityManager라는 걸로 작동, spring에서 생성
우리는 entitymanager을 injection 받아서 사용하면 된다.(클래스 생성자로 주입받자)
.persist(객체) -> insert
.find(조회할 타입or객체 ,pk) -> 조회
.createQuery("select m from Member m",조회 타입or객체).getResultList();
.createQuery("select m from Member m where m.name= :name",조회 타입or객체).setParameter("name",name).getResultList();

---
jpa를 사용하려면 tx있어야함, service에 @Transactional