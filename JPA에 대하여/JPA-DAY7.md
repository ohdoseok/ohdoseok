## 상속관계 매핑

### 1. 각각의 하위 테이블을 만들고 조인으로 사용

### 2. 하나의 테이블에 모든 값을 넣고 사용(null이 다량발생)

### 3. 부모테이블을 없애고 그 내용을 자식테이블에 모두 넣어서 사용

부모테이블

```
@Entity
@Inheritance(starategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "컬럼이름변경가능") 기본은 DTYPE -> DTYPE를 알려주는 컬럼이 추가된다 자동으로(어떠한 엔티티 때문에 부모row가 생성이 된건지 알려줌), 싱글테이블로 운영할 경우 반드시 필요하다

@Inheritance(starategy = InheritanceType.SINGLE_TABLE)->단일테이블 전략

@Inheritance(starategy = InheritanceType.TABLE_PER_CLASS)
->부모테이블이 없고 그 내용을 자식테이블에 모두 넣어서 중복적으로 운영 , 부모클래스는 추상클래스여야함 , 이 경우 Discriminator옵션은 필요가 없음, 구분할 필요가 없기때문에 적용도 안된다.
이 경우 부모테이블의 ID만 가지고 찾게 되는 경우 Union으로 모든 자식테이블을 다 뒤져야 해서 성능이슈
```

자식테이블

```
extends 부모클래스
하게 되면 부모클래스의 id를 포함한 table이 만들어진다. 또한 getter setter를 사용해서 부모클래스의 값을 저장하고 em.persist하게 된다면 2개의 insert가 나가서 부모테이블과 자식테이블 양쪽에 값이 저장된다.
또한 select발생시 join으로 값을 가져온다.

@DiscriminatorValue("A") -> 이런 식으로 DYPE에 들어가는 값을 변경가능
```

---

부모테이블

```
@MappedSuperclass
사용하고 부모클래스를 자식클래스가 상속받게 되는 경우 부모의 속성을 자식이 그대로 상속받아서 엔티티가 만들어진다.
엔티티가 아니기때문에 테이블과 매핑되지 않는다.
직접생성하지 않으므로 추상클래스사용 추천
```

보통 MappedSuperclass는 createdBy등 공통적으로 들어가는 내용의 BasicEntity로 만들어서 사용한다.

**참고 : @Entity 클래스는 엔티티나 @MappedSuperclass로 지정한 클래스만 상속 가능**
