## JPA-DAY3

flush : 영속성 컨텍스트의 변경내용을 데이터베이스에 반영
플러시가 발생하면 변경감지, 수정된 엔티티 쓰기 지연 SQL 저장소에 등록, 쓰기 지연 SQL 저장소의 쿼리를 데이터베이스에 전송(등록, 수정, 삭제 쿼리)
JPQL 쿼리 실행시 자동으로 플러시가 호출된다 -> JPQL로 select 쿼리 발생시 이전에 persist한 값들은 DB에서 가지고 올 수가 없다. 그렇기 때문에 플러시로 DB에 저장 후 쿼리문이 실행된다.

플러시는 영속성 컨텍스트를 비우지 않는다. 단지 변경내용을 데이터베이스에 동기화 한다.
트랜잭션이라는 작업단위가 중요! -> 커밋 직전에만 동기화 하면된다.

@Entity(name="") -> entity의 이름변경
@Table(name="") -> 매핑되는 Table을 지정

@Enumerated(EnumType.STRING)
@Temporal(TemporalType.TIMESTAMP)
@Lob
