nginx

ssafy환경에서 서버운영하기

aws란?
가장 성숙한 클라우드 서비스 제공사
광범위한 서비스 및 파트너 생태계를 갖춘 시스템
많은 레퍼런스

AWS EC2 키페어 : 자격 증명 입증에 사용하는 보안 자격 증명 집합
인스턴스 접근 키

how to cerbot in ec2 command

sudo : 슈퍼 유저
ls : 현재 위치에서의 파일/폴더 목록
vi : 편집기 모드
ll : 현재 위치에서의 리스트 권한 및 파일/폴더 목록
cd : 이동
<편집기 모드>
a : insert mode
esc + wq : 저장후 quit

nginx
다양한 기능 가능, 편리하다

ec2접속 -> ec2 기본 설치 -> mysql 세팅 -> nginx 세팅 -> https 세팅 -> 배포

mysql 세팅 : root 계정 비밀번호 바꾸기, 프로젝트용 계정 생성하기, 인바운드 확인하기
https 세팅

ec2 접속 : mobaxterm ssh : ubuntu@url


dist파일, jar 파일 올리기
location ~/dist

sudo service nginx restart

nohup java -jar ~.jar & => 백그라운드
ps -ef | grep ~.jar	=> jar pid확인
kill -9 pid

front -> build -> nginx restart
back -> build -> jar 돌아가면 kill jar후 새로운 jar 실행 ornot jar실행

이 과정을 자동으로 해주는게 jenkins 이걸 docker로 이미지화 하면 세팅된 환경 사용가능

총 목표는 도메인으로 접속해 사용해보기
