## SQL CS

### DDl

데이터베이스 스키마 정의 및 조작

```
CREATE : 테이블 생성
ALTER : Column 추가(ADD와 함께 쓰임), 삭제(DROP과 함께 쓰임), 변경(Modify, Change 와 함께 쓰임)
DROP : 테이블 삭제
TRUNCATE
```

### DML

데이터 조작을 위해 사용된다.

```
SELECT : 조회
INSERT : 추가
DELETE : 삭제 -> DROP과 다르게 ROW를 삭제
UPDATE : 변경
```

활용

```
Insert into TABLE(Col1, Col2) values (Row1, Row2) ON DUPLICATE KEY UPDATE ColName = Col3
-> Col1, Col2 를 삽입하는데 pk인 Col1의 값이 있다면 ColName값을 Col3로 변경
```

### DQL

```
SELECT만을 분리해서 부름
```

### DCL

데이터 제어 언어

```
COMMIT : 트랜잭션의 작업 결과를 반영
ROLLBACK : 트랜잭션의 작업을 취소 및 원래되로 복구
GRANT : 사용자에게 권한 부여
REVOKE : 사용자에게 권한 취소
```

### TCL

```
COMMIT과 ROLLBACK을 분리해서 부름
```

### DELETE, TRUNCATE, DROP

```
DELETE는 Row를 모두 지우지만 테이블 내의 공간은 지워지지 않음
TRUNCATE는 ROW를 모두 지우고 테이블 내의 공간도 지움
DROP은 Column을 포함한 테이블을 삭제
```

### 트랜잭션 특징

트랜잭션 -> 데이터 베이스를 변화시키기 위한 작업의 단위
ACID

```
A : 원자성 -> 트랜잭션은 DB연산의 전부가 실행되거나 실행되지 않아야 한다.
C : 일관성 ->  트랜잭션 실행 결과로 DB상태가 모순되지 않아야 한다.
I : 고립성 ->  트랜잭션 실행중에 생성되는 연산의 중간 결과는 다른 트랜잭션이 접근할 수 없다.
D : 영속성,지속성 -> 트랜잭션이 그 실행을 성공적으로 완료하면 그 결과는 영구 보장
```
