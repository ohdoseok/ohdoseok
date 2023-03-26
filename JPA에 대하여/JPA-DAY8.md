### 프록시와 연관관계

프록시는 entity를 상속받아서 만들어 진다.

em.find -> 실제 엔티티를 가져온다.
em.getReference -> 프록시 초기화를 통해 가져온 엔티티를 연결한다. 즉, 가상의 엔티티를 만들어서 프록시 역할을 준다.

만약 영속성 컨텍스트에 찾는 엔티티가 이미 있으면 em.getReference를 해도 실제 엔티티를 가져온다 -> JPA는 한 트랜젝션안에서 가져온 값은 보장해야한다. 즉, find로 가져온후에 getReference해도 == 비교시 true반환해야한다.

-> getReference이후 find 하면 둘다 proxy객체로 나온다,(==보장)

주의 : em.detach or em.close로 영속성 컨텍스트를 사용하지 못하게 되면 오류 발생 -> em.getReference는 영속성 컨텍스트에 초기화 요청을 보내고 DB조회 이후 실제 entity를 가져오기 때문에 오류 발생
(org.hibernate.LazyInitializationException)

초기화 여부 확인 : emf.getPersistenceUnitUtil().isLoaded(객체);

프록시 강제 초기화 : Hibernate.initialize(객체)
