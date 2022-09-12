## jpa

h2 in memory db를 사용하면 test가 종료되는 시점에 db가 사라진다

data.sql이라는 파일을 resources 하위에 두면 jpa가 로딩할때 자동으로 해당 쿼리를 한번 실행해준다.
여기서 call next value for hibernate_sequence; 를 꼭 해줘야 다음 값의 pk 값이 증가하고 오류없이 insert된다.

#### Optional class

java에서는 nullPointException을 방지하기위해서 optional클래스를 제공한다.
null이 올 수 있는 값을 감싸는 wrapper 클래스로, 참조하더라도 npe가 발생하지 않도록 도와준다.

-> findById와 같은 메소드는 null이 오면안되서 optional 객체로 만들어 주던가 orelse(반환할객체) 로 처리한다.

#### jpa문법 (orderby 컬럼이름)

.findAll(Sort.by(Sort.Direction.DESC, "컬럼이름"));
.findAll(Sort.by(Sort.Direction.ASC, "컬럼이름"));

.findAllById(List) -> id의 타입으로 이루어진 list // iterable type

.saveAll(List) -> list에 저장된 객체만큼 insert문이 실행되어서 모두 insert 시킨다.

.getOne 을 사용하려면 @Transactional해줘야한다. getOne은 기본적으로 entity에 대한 lazy한 로딩을 지원한다.

getOne과 filndById의 차이는 ???
getOne은 reference만 가져오고 실제 값을 구하는 시점에 세션을 통해서 구한다.
findById는 바로 엔티티 객체를 find한다.

.deleteall(List)와 .deleteallinbatch(List) 의 차이는???
deleteall은 list의 수만큼 delete쿼리를 실행한다, deleteall과는 다르게 select하는 과정이 없고 오로지 delete한다. 성능차이
delete from %s

PageRequest.of(페이지번호,size)

ExampleMatcher matcher = ExampleMatcher.matching().withIgnorePaths("무시할컬럼").withMatcher("매칭시킬멀럼",endsWith());
Example<T> example = Example.of(new T("requireargs"."requireargs"),matcher);
matcher의 조건 컬럼에 맞는 값이 example에 들어가는데 example에 들어간 조건으로 전체 db에서 찾는다.

queryMethod를 사용할때 findByName을 사용한다고 치면 findByByName처럼 잘못사용해서 없는 필드인 ByName을 찾게 되고 컴파일에서는 오류가 안나지만 런타임에서 오류가 나는 경우가 있다. Test를 하고 사용하자

findFirst1ByName이나 findTop1ByName 같은 경우 limit가 들어가서 최고 1개를 뽑아온다.
findFirst2ByName이나 findTop2ByName 같은 경우 limit가 들어가서 최고 2개를 뽑아온다.

List<Users> findLast1ByName(String name); 이렇게 쓰면 없는 키워드라서 무시해서 findByName과 동일한 쿼리로 동작한다.
last를 찾기를 원하면 orderby를 사용해야한다.

findByCreatedAtAfter() 특정 날짜 이후의 값 조회
findByCreatedAtBefore() 특정 날짜 이전의 값 조회
findByIdAfter() 특정 id 보다 큰 값 조회
findByIdGreaterThan() 과 동일
findByIdGreaterThanEqual()은 이상
findByIdBewteen()은 이상이하

findByIdIsNotEmpty()는 id가 empty 즉 ""이라는 뜻이아니라 Empty는 collection의 empty를 체크한다.

like 검색
findByNameStartingWith()
findByNameContains()
findByNameEndingWith()
_findByNameLike("%문자%")_
