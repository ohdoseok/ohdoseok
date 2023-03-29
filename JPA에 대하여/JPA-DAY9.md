## 지연로딩

@ManyToOne(fetch = FetchType.Lazy) -> 연관관계로 걸려있는 엔티티는 프록시로 가져오고 해당 엔티티값을 호출하면 그때 초기화

## 즉시로딩

@ManyToOne(fetch = FetchType.EAGER) -> join이후 select쿼리도 1개만 나간다.

주의 : 실무에서는 가급적 지연 로딩만 사용 / 즉시 로딩은 예상치못한 SQL발생과 JPQL에서 N+1문제를 일으킨다.

JPQL로 member select시 member에 걸려있는 TEAM까지 모조리 가져온다. -> 즉시로딩은 한번에 걸려있는 모든 엔티티를 다가져와야하는데 select member하면 member를 다 가져오고 이후에 걸려있는 TEAM엔티티까지 가져오는 2번의 select가 나간다.

지연로딩으로 설정하고 fetch join을 사용해서 한번에 가져오도록
-> select m from Member m join fetch m.team
