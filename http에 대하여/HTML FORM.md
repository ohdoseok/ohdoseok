## HTML FORM 사용

html form은 get,post만 지원한다.
이것은 AJAX를 활용해서 해결가능하다

순수 html form의 경우
get과 post http method만 사용가능 하기 때문에
수정과 삭제의 경우
/members/{id}/edit, /members/{id}/delete를 post로 보내서 해결 해야한다.

원래는 리소스만 uri에 넣고 edit나 delete 같은 행동은 method로 해야하지만 어쩔수 없는 경우에 사용
-> 컨트롤 uri
