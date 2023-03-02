s## JPA-DAY5

1:N 관계에서 N에 FK생성, ex_TEAM 1 : MEMBER N (TEAM_ID {FK})

즉, TEAM을 조회해도 MEMBER를 알아야하고 MEMBER를 조회해도 TEAM을 알아야한다.

하지만 테이블에서 연관관계는 외래키로 이루어져있음, 방향이 존재하지 않음

</br>

MEMBER entity

```
@ManyToOne
@JoinColumn(name = "TEAM_ID")
Team team;
```

</br>

TEAM entity

```
@OneToMany(mappedBy = "team") -> Member의 team와 연관이 되어있다.
List<Member> list = new ArrayList<>();
```

</br>

### 객체와 테이블이 관계를 맺는 차이

</br>

객체는 단방향 2개, 테이블은 양방향 1개

-> 객체는 양방향을 구현하려면 관계를 2개 만들어내야함

그렇다면 객체의 경우 단방향이 2개인데 값이 변경 될 시 어떻게 처리해야하나? ex) Member의 Team변경 -> Member entity의 Team 정보 변경, Team의 Member List 정보 변경

-> 둘 중 하나로 외래 키를 관리해야 한다.(연관관계의 주인 설정)
주인이 아닌 쪽은 읽기만 가능, <span style="color: red"> **주인은 Mapped By 속성 사용 x** , **주인이 아니면 mappedBy 속성으로 주인 지정**</span>

mappedBy로 매핑이 되어있는 Member entity의 team이 변경되면 자동으로 변경된다. -> 반드시 FK가 있는 entity가 주인 -> N이 주인

```
하지만 Team team = new Team(); team.setId(1L); -> Member.setTeam(team); 만 해주게 된다면
```

```
Team findTeam = em.find(Team.class, team.getId());

List<Member> list = team.getMembers(); 의 경우에 select쿼리가 나가지 않고 1차캐시에서 가지고 오기때문에 안에 저장된 내용이 없다 -> 해결을 위해서는 plush, clear를 해주던가
team.getMembers().add(Member); 을 해줘야함 -> 쉽게 Member entity의 set Team
메소드에 this.team = team; team.getMembers().add(this); 로 간단하게 setTeam할때마다 자동으로 팀에 멤버를 추가는 식으로 구현 가능
새로운 메소드를 생성가능 -> changeTeam(Team team){ this.team.remove() 로 제거하고 this.team = team ; team.getMembers().add(this)}로 해도 됨
```

즉, 반드시 양쪽 모두에 값을 넣어줘야한다(순수 객체 상태를 고려하여)
