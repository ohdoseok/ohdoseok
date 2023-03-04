## 관계 개념

---

테이블은 외래키 하나로 양쪽 조인 -> 방향 개념이 없음

---

객체는 참조용 필드가 있는 쪽으로만 참조 가능(@ManyToOne)

테이블은 외래 키 하나로 두 테이블이 연관관계를 맺음
객체 양방향 관계는 A->B, B->A 처럼 참조가 2군데

---

N:1 -> @ManyToOne @JoinColumn(name = "TEAM_ID")

양방향
1:N -> @OneToMany(mappedBy = "team")-> onetomany변수명 List<Member>list = new ArrayList<>();

N:1 양방향 -> 외래키가 있는 쪽이 연관관계의 주인, 양쪽을 서로 참조하도록 개발
