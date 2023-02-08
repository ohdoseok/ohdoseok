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
