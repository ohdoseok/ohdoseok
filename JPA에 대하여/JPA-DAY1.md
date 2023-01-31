JPA 란?
SQL중심개발의 문제점을 해결하고자 객체-관계 매핑의 표준으로 등장
객체와 DB간의 패러다임 불일치를 해결할 수 있다.

같은 DB Transactions 내에서 커밋하기 전까지 persist등을 모아서(batch)처리한다.(지연 쓰기, buffered Write)
같은 Transactions 내에서는 엔티티가 동일한 인스턴스이다.
Team team1 = em.find(Team.class, teamId);
Team team2 = em.find(Team.class, teamId);

## team1 == team2

## 지연로딩이란?

객체가 실제로 사용될 때 로딩되는 지연로딩
member를 가져오고 team이 호출 될때 쿼리가 사용된다.
바로 join해서 쿼리를 가져오지 않기 때문에 걸려있는 모든 엔티티를 가져오지 않아서 성능상으로 이득

---

## jpa의 흐름? EntityManagerFactory와 EntityManager

jpa는 persistance라는 클래스에서 application.yml 설정 정보를 조회 하여 EntityManagerFactory 라는 클래스를 만들고
필요할때마다 EntityManager를 만들어낸다.

사용시 EntityManagerFactory 생성 -> EntityManagerFactory로 EntityManager 생성 -> 작업 후 -> EntityManager close -> EntityManagerFactory close

-> 스프링이 모두 처리해줌

## EntityManagerFactory -> EntityManager 생성

## jpa의 annotations

@Table(name = “”)
DB에 저장될 때 entity의 이름 지정

@Column(name = "")
DB에 저장될 때 entity의 컬럼 이름 지정

## jpa의 find 이후 정보수정

find이후 set으로 객체의 정보가 변경이 된다면 다시 persist할 필요가 없다.
알아서 commit할때 update된다.

중요~! : jpa를 통해서 entity를 가져오면 tx commit하는 시점에 바뀐 것을 update쿼리를 날린다.

## 엔티티 매니저는 쓰레드간에 공유x

사용하고 버려야한다.

## jpa의 모든 데이터 변경은 트랜잭션 안에서 실행 해야한다.

## JPQL

jpa는 sql을 추상화한 jpql이라는 객체 지향 쿼리 언어 제공

검색쿼리를 사용하게 되는데
결국 검색 조건이 포함된 SQL이 필요해진다.
JPQL사용시 오류가 있다면 런타임에서 확인 가능하기에 컴파일 단계에서 오류 확인불가 -> Querydsl의 등장이유
