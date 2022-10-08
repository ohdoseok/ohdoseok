## Oracle SQL 문제 풀기

---

### SQL 문법 정리

순서
select
from
where
group by
having
order by

-WHERE절 : SELECT ~ FROM절에서 발췌된 데이터에 대한 제한조건을 부여하여 필요한 데이터만을 조회할 때 사용하는 조건절
-HAVING절 : 그룹함수를 사용해 GROUP BY절을 사용할 때 그룹들에 대한 제한 조건이 필요하여 사용하는, 그룹에 대한 조건절
=> 즉, SELECT의 조건은 WHERE절, GROUP BY절의 조건은 HAVING절이다.

1. 중복제거

- distinct : select 부분에서 중복값이 검출되면 중복제거
- group by : 중복된 값이 있다면 group 처리로 중복제거

2. 그룹함수

- count()
- MAX()
- MIN()
- AVG()

---

#### 조회

select \* from ~ order by column_name

#### 역순조회

select A,B from ~ order by column_name desc

#### 아픈동물의 id와 name 조회 후 id순으로 정렬

SELECT ANIMAL_ID, NAME from ANIMAL_INS where INTAKE_CONDITION = 'Sick' order by ANIMAL_ID
**Point! => oracle sql 에서는 where의 같다 조건은 = 이다.**

#### 젊은동물의 id와 name 조회 후 id순으로 정렬

SELECT ANIMAL_ID , NAME from ANIMAL_INS where INTAKE_CONDITION != "Aged" order by ANIMAL_ID
**Point! => oracle sql 에서는 where의 다르다 조건은 != 이다.**

#### 모든 동물의 아이디와 이름을 id순으로 조회

SELECT ANIMAL_ID, NAME from ANIMAL_INS order by ANIMAL_ID

#### 모든 동물의 아이디와 이름,보호 시작일을 이름 순으로 조회, 이름이 같다면 보호를 나중에 시작한 동물먼저 조회

SELECT ANIMAL_ID, NAME , DATETIME from ANIMAL_INS order by NAME, DATETIME desc
**Point! => order by Name으로 이름이 빠른동물 먼저 조회하고 만약에 같다면 DATETIME이 더 큰 동물먼저 조회 해야하기때문에 DATETIME은 내림차순 desc사용**

#### 가장 최근에 들어온 동물의 datetime을 조회

SELECT max(DATETIME) from ANIMAL_INS

#### 가장 먼저 들어온 동물의 datetime을 조회

SELECT min(DATETIME) from ANIMAL_INS

#### 전체 동물을 count

SELECT count(ANIMAL_ID) as count from ANIMAL_INS
**Point! => 전체를 count할때는 항상 모든 값이 있는 걸로 해야함 null일경우 count하지않기때문, 컬럼명을 변경해서 결과를 출력하려면 as를 사용한다**

#### 동물의 이름으르 조회, 중복제거

SELECT count(distinct NAME) as count from ANIMAL_INS
**Point! => 중복제거인 distinct는 select부분에서 사용하는데 distinct count(NAME) 이런식으로 사용하면 안된다. count(distinct NAME) 이렇게 이름을 먼저 중복제거 시키고 그뒤에 count를 사용해야함**

#### 동물 보호소에 들어온 동물 중 고양이와 개가 각각 몇 마리인지 조회하는 SQL문

SELECT ANIMAL_TYPE, count(\*) as "count"
from ANIMAL_INS
GROUP BY ANIMAL_TYPE
order by ANIMAL_TYPE

결과
|ANIMAL_TYPE| count|
|---|---|
|Cat| 2|
|Dog| 1|

ANIMAL_TYPE를 각각의 타입별로 묶고 그에 따른 count가 필요하다
즉, ANIMAL_TYPE을 groupby로 묶고 만들어진 그룹(cat,dog)중에서 cat이 먼저 나와야 하기 때문에 order by로 정렬 후 각각의 group의 모든 row를 count해준다.

#### 동물 보호소에 들어온 동물 중, 이름이 있는 동물의 id를 조회하는 sql문, id는 오름차순

SELECT ANIMAL_ID from ANIMAL_INS where NAME is not NULL order by ANIMAL_ID

#### 동물 보호소에 가장 먼저 들어온 동물의 이름을 조회하는 sql문

select NAME from(SELECT NAME from ANIMAL_INS order by DATETIME) where ROWNUM=1
POINT! => oracle에서 특정조건을 만족하는 상위 n개를 구하려면 먼저 조건을 만족하는 테이블을 from에 넣고 where에 ROWNUM의 번호로 몇개를 뽑을지 정한다.

<<<<<<< Updated upstream
#### 동물의 이름에 el 이 들어가는 개의 아이디와 이름을 조회 하는 SQL, 이름순으로 조회, 이름의 대소문자는 구분하지 않는다.

SELECT ANIMAL_ID, NAME
from ANIMAL_INS
where lower(NAME) like lower('%el%') and ANIMAL_TYPE = 'Dog'
order by NAME

POINT! => like를 사용해서 앞에 들어가는지('문자%'), 뒤에 들어가는지('%문자'), 중간에 들어가는지('%문자%') 체크 할수있다, lower조건을 사용하면 그 대상도 lower로 해줘야한다, where의 여러 조건은 and로
=======

#### 동물 보호소에 들어온 동물 이름 중 두 번 이상 쓰인 이름과 해당 이름이 쓰인 횟수를 조회하는 SQL문, 이름이 없는 동물은 제외, 결과는 이름순
SELECT NAME, count(*) as "COUNT"
from ANIMAL_INS
group by NAME
having count(NAME)>1
order by NAME

POINT! => 이름을 group by 로 묶고 해당 이름이 2개이상이면 이라는 조건은 그룹의 조건이므로 having, 그리고 그룹을 order by


#### 동물 보호소에 들어온 동물 중, 이름이 없는 채로 들어온 동물의 id를 조회하는 sql문을 작성해주세요. id 는 오름차순
SELECT ANIMAL_ID from ANIMAL_INS where NAME is NULL order by ANIMAL_ID

POINT! => null을 다룰 때는 is, is not 사용

#### 동물의 생물 종, 이름, 성별 및 중성화 여부를 아이디 순으로 조회한다. name이 null일 경우 No name으로 변경해서 출력
SELECT ANIMAL_TYPE, NVL(NAME,'No name') as NAME, SEX_UPON_INTAKE
from ANIMAL_INS
order by ANIMAL_ID;

**POINT!!!!!! => NVL(컬럼이름,'치환할값') 값이 null이면 치환할 값으로 바껴서 실행 NVL2(컬럼이름,'null이 아닐경우 치환할 값','null일 경우 치환할 값')**
>>>>>>> Stashed changes
