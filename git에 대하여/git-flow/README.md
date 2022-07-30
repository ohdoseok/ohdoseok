* master : 제품으로 출시될 수 있는 브랜치
* develop : 다음 출시 버전을 개발하는 브랜치
* feature : 기능을 개발하는 브랜치
* release : 이번 출시 버전을 준비하는 브랜치
* hotfix : 출시 버전에서 발생한 버그를 수정 하는 브랜치
![image](https://user-images.githubusercontent.com/61822619/179235146-d14d9671-889b-4752-bb67-ef0da0022547.png)
master에서 생성된 develop브랜치 에서는 상시로 버그를 수정한 커밋들이 추가된다.
새로운 기능 추가 작업이 있는 경우 develop 브랜치에서 feature브랜치를 생성한다.
feature브랜치는 언제나 develop 브랜치에서부터 시작된다.
기능 추가 작업이 완료되었다면 feature브랜치는 develop 브랜치로 merge되고 로컬과 원격feature브랜치를 삭제해준다. develop에 이번 버전에 포함되는 모든 기능이 merge 되었다면 QA를 하기 위해 develop 브랜치에서부터 release 브랜치를 생성합니다.
QA를 진행하면서 발생한 버그들은 release 브랜치에 수정, QA를 무사히 통과했다면 release 브랜치는 특정버전에서 완성된 것을 가지고있는 브랜치이다. 이런 release 브랜치를 master와 develop 브랜치로 merge한다. 마지막으로 출시된 master 브랜치에서 버전태그를 추가.
---
feature브랜치는 feature/#이슈번호-내용 으로 만들고
commit은 #이슈번호-내용 으로 commit