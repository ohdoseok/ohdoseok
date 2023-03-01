## JPA-DAY4

@Column(name = "" , updatable = true or false) -> 쿼리문이 나갈때 컬럼이 변경되게 하느냐 안하느냐
(nullable = false)-> notnull

---

@Enumerated() -> EnumType.STRING, EnumType.ORDINAL -> 차이는 enum이름을 다 저장하거나, 순서를 저장하거나
ordinal사용시 순서가 바뀌어 버리면 변경되지 않는다.

---

@Temporal anootation 없어도
자바의 LocalDate와 LocalDateTime을 사용하면 알아서 하이버네이트에서 매핑해준다.

---

@Lob은 문자면 알아서 Clob으로 나머지는 알아서 Blob으로 매핑된다.

---

기본키 매핑

직접할당
@Id

자동할당
@GeneratedValue(strategy = GenerationType.AUTO) DB방언에 따라 자동으로 생성

IDENTITY -> 기본키 생성을 데이터베이스에 위임 ex) Mysql의 AutoIncrements
Identity전략 사용시 문제점 -> pk를 넣지않고(Null)로 들어가 버리기 때문에 영속성 컨텍스트에서 pk를 확인 할 수 없다 -> 그래서 Identity사용시 바로 em.persist시점에 바로 insert를 던져버린다. JDBC의 내부적인 처리로 인해 insert하는 시점에 바로 pk값을 알 수 있다.

SEQUENCE -> 시퀀스 오브젝트를 통해서 값을 가지고 와서 세팅
Sequence전략 사용시 매핑된 sequence테이블에서 다음 value를 가지고 오고 그 값으로 영속성 컨텍스트에 pk로 저장한다.
문제점 -> 매번 entity를 저장 할때 마다 next call로 sequence테이블에 접근해서 다음 value를 가지고 와야한다 -> allocationSize를 사용해서 한번 call 할때 next값을 많이 가지고와서ex)1,51두개를 call해서 DB에는 51이 찍히게 두고 1~50까지 확보 DB에는 다음값을 ex) 51로 가지고 있는다. -> 나는 메모리에서 1씩쓰고 저장


둘의 차이점? : sequence는 pk값을 먼저 받아오고 영속성 컨텍스트에 저장해서 buffer로 처리 하지만 identity는 insert가 수행된 이후 pk값을 가지고 와서 영속성 컨텍스트에 저장

