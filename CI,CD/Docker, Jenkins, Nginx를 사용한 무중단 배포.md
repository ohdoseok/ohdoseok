## Docker, Jenkins, Nginx를 사용한 무중단 배포

### 기본 코드

컨테이너 목록

```
$ docker ps
```

컨테이너 종료

```
$ docker stop 컨테이너
```

컨테이너 shell 환경으로 접근하기

```
$ docker exec -it 컨테이너 /bin/bash
```

다른 컨테이너 명령어 참고 : https://velog.io/@bbangi/Docker-%EC%83%9D%EC%84%B1-%EC%8B%A4%ED%96%89-%EC%A2%85%EB%A3%8C

### 기본준비 코드는 구글링

1. Docker와 Docker-compose 설치
2. EC2에 Jenkins 이미지 pull, 실행
   9000포트를 사용해서 접속하도록 컨테이너 실행

```
$ docker run -itd --name jenkins -p 9000:8080 jenkins/jenkins:lts-jdk11
```

3. Nginx는 local에 설치

---

### 스프링 프로젝트 설정

blue green 무중단 배포를 위해서는 스프링도 2개의 profile을 사용해서 포트 분리를 해야한다.
포트가 2개로 분리가 되면 각각의 포트를 사용할 때 컨테이너로 만들어서 run 할 예정

잘못설정하면 database의 datasource url 이 없다고 오류가 나온다.

다른 부분은 동일해서 놔두고 다른 부분만 가져왔다

```
server:
  servlet:
    context-path: /api
  port: 8888
spring:
  config:
    activate:
      on-profile: production-set1

    ......

---

server:
  servlet:
    context-path: /api
  port: 8889
spring:
  config:
    activate:
      on-profile: production-set2
```

하나는 production-set1이라는 profile에 8888포트를 사용하고 하나는 production-set2라는 profile에 8889포트를 사용한다.

#### 프로파일 조회 API 추가

현재 profile을 조회하기 위한 API

```
@RestController
@RequiredArgsConstructor
@RequestMapping("/utils")
public class UtilController {

    private final Environment env;

    @GetMapping("/profile")
    public String getProfile() {
        return Arrays.stream(env.getActiveProfiles()).findFirst().orElse("");
    }
}
```

/utils/profile로 get api가 오면 현재 활성화 되어있는 profile을 찾아서 return한다 없으면 공백이 출력된다.

#### 라이브러리 추가

배포 과정에서 health check를 하기 위해 라이브러리를 추가한다.

```
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```

get으로 /actuator/health를 요청하면 json 형태로 state가 출력된다.

---

### gitlab과 jenkins 설정

처음으로 jenkins에 접속하면 initialAdminPassword를 요구하는데

```
$ docker exec cat 주소
```

로 확인하자

suggest plugin으로 설치를 완료하면 gitlab 플러그인을 설치

#### gitlab과 jenkins 연걸, webhook

jenkins와 gitlab연결 순서

```
1. gitlab 프로젝트의 accesstoken 발급
2. jenkins의 addcredentials로 GitLab API token / Global / accesstoken 을 입력해서 redentials 생성
3. jenkins의 시스템 설정에서 gitlab 부분에 credential추가 Gitlab host URL : gitlab_url / Credentials : 생성한 credential
4. Freestyle project 생성
5. 소스코드관리의 Git에서 프로젝트 url을 입력하고 credential 추가 -> Username with password / Global / 깃랩아이디 / 깃랩비밀번호 -> 오류가 안나면 성공
6. gitlab trigger 발생시 젠킨스에서 해당 레포지토리를 가져오도록 webhook설정
7. 빌드 유발에서 Build when a change is pushed to GitLab. GitLab webhook URL: [URL] 체크 -> 나오는 url 저장
8. 고급탭 클릭 -> Secret token에서 Generate해서 토큰 생성, 저장
9. gitlab에서 repository의 setting/webhook 클릭 -> URL 7번 , Secret token 8번 , Trigger Push event 체크 + 브랜치(master or develop)
10. add webhook하면 아래에 웹훅이 생기는데 test로 push event 발생시 jenkins에서 빌드가 확인된다. success시 성공
```

#### 프로젝트를 빌드하기위한 gradle설정

```
1. jenkins관리의 Global Tool Configuration - Gradle 부분에서 Add Gradle 클릭
2. 스프링 프로젝트의 gradle 버전에 맞는 버전 선택
3. 스프링 프로젝트 gredle 버전 확인은 gradle폴더 하위에 있다
4. 이전에 생성한 jenkins프로젝트의 아이템 구성에서 Build의 Add build step 의 Invoke Gradle script에서 설정
5. 앞서 생성한 gradle선택 / Tasks : clean build
6. 만약 오류가 생긴다면 필자는 Execute shell에서 command로 설정했다. 반드시 chmod 권한 부여 해줘야함

cd /var/jenkins_home/workspace/ssafyD106
chmod -R 777 BE
cd BE/Drink
./gradlew clean build

```

#### SSH 설정

```
1. 배포를 위한 젠킨스와 EC2연결, gradle로 빌드한 jar 파일을 EC2로 전송하려고 한다
2. Public Over SSH 플러그인 설치 or SSH 플러그인 설치
3. Public over SSH Key에 EC2 접속에 사용한 pem키를 메모장이나 워드패드로 열어서 복사 붙여넣기한다
4. SSH Server 에 이름을 지정하고, Hostname에 EC2 ip/ Username 에 접속시 사용한 이름 필자는 ubuntu 입력
5. test configuration success
6. 고급클릭 -> Port 22, Timeout 0
7. jenkins내부의 jar파일을 보내기 위해서 pem파일을 jenkins 내부로 보내야함
8. mobaxterm을 사용해서 window에 있는 pem파일을 EC2로 끌어넣음
9. 로컬(EC2)에서 jenkins컨테이너로 pem 파일 보내기 ->

$ docker cp 보내는파일위치 컨테이너이름:/root/data/


10. Execute shell에

chmod 400 /var/jenkins_home/J7D106T.pem

scp -v -o StrictHostKeyChecking=no -i /var/jenkins_home/J7D106T.pem /var/jenkins_home/workspace/ssafyD106/BE/Drink/build/libs/Drink-0.0.1-SNAPSHOT.jar ubuntu@j7d106.p.ssafy.io:/home/ubuntu/app-server

scp로 전송을 하는데 젠킨스내의 pem 파일 경로, 전송할 jar파일 경로, EC2내부의 전송위치를 입력한다


```

#### Nginx 설정

```
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install nginx
$ sudo service nginx start
$ sudo service nginx status

```

- nginx.conf
  **fileupload시 nginx가 기본 1MB로 제한하고 있어서**

```
http {
    client_max_body_size 0;
}
```

1. /etc/nginx/sites-enable/ 내부의 파일에 설정

```


server {
  listen 80 default_server;
  listen [::]:80 default_server;
  root   /home/ubuntu/app-server2/dist;
  index  index.html index.htm;
  server_name j7d106.p.ssafy.io;
  include /etc/nginx/conf.d/service-url.inc;    ->    proxy_pass가 되는 url이 계속해서 바뀌는데 inc파일에 계속해서 다르게 저장한다.

  resolver 127.0.0.53 valid=5s;
  set $elb " j7d106.p.ssafy.io ";

  location / {
    client_max_body_size 0;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-Proto https;
    try_files $uri /index.html;
  }
   location /api {
        client_max_body_size 0;
        proxy_pass $service_url;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }


listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/j7d106.p.ssafy.io/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/j7d106.p.ssafy.io/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
```

2. /etc/nginx/conf.d/service-url.inc

```
set $service_url http://j7d106.p.ssafy.io:8889; -> 포트는 계속해서 바뀔 예정
```

3. sudo service nginx restart

#### 배포 스크립트 작성

```
docker빌드시 도커 파일의 위치를 경로로 지정한다


흐름 :
현재 profile을 확인하고 새로운 포트를 가지는 jar파일을 이미지화, 컨테이너 실행,

현재 사용중인 port의 profile을 확인하고

nginx의 proxy_pass를 새로실행한 컨테이너의 포트를 가지는 url로 변경

현재 사용중인 profile명으로 된 컨테이너 삭제

nginx reload

새로운 포트로 api redirect
```

1. /home/ubuntu/app-server/deploy.sh

```
#!/bin/bash
echo "> 현재 구동중인 profile 확인"
CURRENT_PROFILE=$(curl -s http://j7d106.p.ssafy.io/api/utils/profile)
echo "> $CURRENT_PROFILE"

if [ $CURRENT_PROFILE == production-set1 ]
then
  IDLE_PROFILE=production-set2
  IDLE_PORT=8889
elif [ $CURRENT_PROFILE == production-set2 ]
then
  IDLE_PROFILE=production-set1
  IDLE_PORT=8888
else
  echo "> 일치하는 Profile이 없습니다. Profile: $CURRENT_PROFILE"
  echo "> set1을 할당합니다. IDLE_PROFILE: set1"
  IDLE_PROFILE=production-set1
  IDLE_PORT=8888
fi

IMAGE_NAME=app_server
TAG_ID=$(docker images | sort -r -k2 -h | grep "${IMAGE_NAME}" | awk 'BEGIN{tag = 1} NR==1{tag += $2} END{print tag}')

echo "> 도커 build 실행 : docker build --build-arg IDLE_PROFILE=${IDLE_PROFILE} -t ${IMAGE_NAME}:${TAG_ID} ."
docker build --build-arg IDLE_PROFILE=${IDLE_PROFILE} -t ${IMAGE_NAME}:${TAG_ID} /home/ubuntu/app-server

echo "> $IDLE_PROFILE 배포"
echo "> 도커 run 실행 :  sudo docker run --name $IDLE_PROFILE -d --rm -p $IDLE_PORT:${IDLE_PORT} ${IMAGE_NAME}:${TAG_ID}"
docker run --name $IDLE_PROFILE -d --rm -p $IDLE_PORT:${IDLE_PORT} ${IMAGE_NAME}:${TAG_ID}

echo "> $IDLE_PROFILE 10초 후 Health check 시작"
echo "> curl -s http://j7d106.p.ssafy.io:$IDLE_PORT/api/actuator/health "
sleep 10

for retry_count in {1..10}
do
  response=$(curl -s http://j7d106.p.ssafy.io:$IDLE_PORT/api/actuator/health)
  up_count=$(echo $response | grep 'UP' | wc -l)

  if [ $up_count -ge 1 ]
  then
    echo "> Health check 성공"
    break
  else
    echo "> Health check의 응답을 알 수 없거나 혹은 status가 UP이 아닙니다."
    echo "> Health check: ${response}"
  fi

  if [ $retry_count -eq 10 ]
  then
    echo "> Health check 실패. "
    echo "> Nginx에 연결하지 않고 배포를 종료합니다."
    exit 1
  fi

  echo "> Health check 연결 실패. 재시도..."
  sleep 10
done

echo "> 스위칭을 시도합니다..."
sleep 5

/home/ubuntu/app-server/switch.sh

```

2. /home/ubuntu/app-server/switch.sh

```
#!/bin/bash
echo "> 현재 구동중인 Port 확인"
CURRENT_PROFILE=$(curl -s http://j7d106.p.ssafy.io/api/utils/profile)

if [ $CURRENT_PROFILE == production-set1 ]
then
  CURRENT_PORT=8888
  IDLE_PORT=8889
elif [ $CURRENT_PROFILE == production-set2 ]
then
  CURRENT_PORT=8889
  IDLE_PORT=8888
else
  echo "> 일치하는 Profile이 없습니다. Profile:$CURRENT_PROFILE"
  echo "> 8888을 할당합니다."
  IDLE_PORT=8888
fi

echo "> 현재 구동중인 Port: $CURRENT_PORT"
echo "> 전환할 Port : $IDLE_PORT"
echo "> Port 전환"
echo "set \$service_url http://j7d106.p.ssafy.io:${IDLE_PORT};" | sudo tee /etc/nginx/conf.d/service-url.inc

echo "> ${CURRENT_PROFILE} 컨테이너 삭제"
sudo docker stop $CURRENT_PROFILE

echo "> Nginx Reload"

sudo service nginx reload


```

3. /home/ubuntu/app-server/Dockerfile

```
FROM openjdk:8                              // openjdk 8 을 기반으로 컨테이너 생성
ARG IDLE_PROFILE                            // ARG는 변수명
ARG JAR_FILE=Drink-0.0.1-SNAPSHOT.jar
RUN echo $JAR_FILE
ENV ENV_IDLE_PROFILE=$IDLE_PROFILE
COPY ${JAR_FILE} app.jar                    // jar파일을 app.jar로 copy
RUN echo $ENV_IDLE_PROFILE
ENTRYPOINT ["java","-Dspring.profiles.active=${ENV_IDLE_PROFILE}","-jar","/app.jar"]    // dockerfile에서 해당 이미지를 컨테이너로 생성할때 실행하고자 하는 명령어를 작성

```

**앞서 작성한 deploy.sh, switch.sh, Dockerfile은 모두 chmod 755로 설정**

**_Docker 관련_**

```
1. profile을 선택해서 실행하려면
2. java -jar myapp.jar --spring.profiles.active=profile이름
3. 2의 형태로 되기 때문에 ENTRYPOINT ["java","-Dspring.profiles.active=${ENV_IDLE_PROFILE}","-jar","/app.jar"]
4. 이미지가 컨테이너로 생성될때 profile의 이름으로 실행된다.
```

참고 : https://1minute-before6pm.tistory.com/12

```
1. Dockerfile 작성
From : 이미지를 생성할 때 사용할 기반 이미지
ARG : 변수선언
COPY : 실행할 jar파일을 도커 컨테이너 내부에 복사, 상대 경로로 위치도 같이 설정가능
ENTRYPOINT : 컨테이너가 시작될 때 실행할 스크립트 혹은 명령을 정의
```

docker build 와 run, Dockerfile 설명

참고 : https://ssyoni.tistory.com/m/22
참고 : https://frozenpond.tistory.com/98

---

#### 마지막으로 jenkins에서 excute shell과 빌드후 조치 Send build artifacts over SSH

**Execute shell**

```
cd /var/jenkins_home/workspace/ssafyD106
chmod -R 777 BE
cd BE/Drink
./gradlew clean build

chmod 400 /var/jenkins_home/J7D106T.pem
scp -v -o StrictHostKeyChecking=no -i /var/jenkins_home/J7D106T.pem /var/jenkins_home/workspace/ssafyD106/BE/Drink/build/libs/Drink-0.0.1-SNAPSHOT.jar ubuntu@j7d106.p.ssafy.io:/home/ubuntu/app-server

cd /var/jenkins_home/workspace/ssafyD106
chmod -R 777 FE
cd FE/joojooclub
rm -rf dist
npm install
npm run build
tar -zcvf front.tar.gz dist
scp -v -o StrictHostKeyChecking=no -i /var/jenkins_home/J7D106T.pem /var/jenkins_home/workspace/ssafyD106/FE/joojooclub/front.tar.gz ubuntu@j7d106.p.ssafy.io:/home/ubuntu/app-server2

```

**빌드후조치**
이 부분은 SSH 사용에 있어서 오류가 있다 추후 수정 예정

```
Source files -> /var/jenkins_home/workspace/ssafyD106/BE/Drink/build/libs/Drink-0.0.1-SNAPSHOT.jar
Remove prefix -> /var/jenkins_home/workspace/ssafyD106/BE/Drink/build/libs
Remote directory -> /home/ubuntu/app-server
Exec command -> /home/ubuntu/app-server/deploy.sh


Source files -> /var/jenkins_home/workspace/ssafyD106/FE/joojooclub/front.tar.gz
Remove prefix -> /var/jenkins_home/workspace/ssafyD106/FE/joojooclub
Remote directory -> /home/ubuntu/app-server2
Exec command ->
cd /home/ubuntu/app-server2
tar -zxvf front.tar.gz
```

---

전체적인 코드 참고 : https://gksdudrb922.tistory.com/236

---

### 진행중에 생긴 모든 이슈들

```
Nginx 오류 로그 : /var/log/nginx/error.log
Nginx 시작시 오류 : sudo nginx -t 로 확인
Nginx 실행,중단,상태 보기 등의 코드 : https://computer-science-student.tistory.com/393

```

1. 컨테이너 내부에서 설치를 위한 root 계정으로 컨테이너 접속

```
$ docker exec -it -u 0 컨테이너이름 /bin/bash
```

2. 최신버전의 nodejs와 npm 설치

```
1. curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_16_setup.sh (설치 스크립트를 다운로드합니다)(원하는 버전이 있다면 16자리에 넣자 ex)14,15 등 )
2. sudo bash nodesource_16_setup.sh (그 다음 다운로드한 스크립트를 실행시킵니다)(스크립트를 실행하면 ppa 등록이 완료됩니다.)
3. sudo apt install nodejs (nodejs설치)
4. sudo apt install build-essential (추가적으로 npm으로 패키지를 설치할 때 컴파일이 필요한 경우가 있으니 각종 빌드 툴이 포함된 build-essential 패키지가 설치되어 있지 않다면 설치해줍니다)
5. sudo npm install -g npm (npm 최신버전으로 upgrade)
```

3. domain이름 could not be resolved (110: Operation timed out) 과 같은 nginx 오류

```
resolver 설정 해야함
1. cat /etc/resolv.conf/nameserver
2. nginx에서

resolber 1번값 valid=5s;
set $elb domain이름

참고 : https://betheproud.medium.com/nginx-proxy-pass-with-aws-elb-domain-ba279821e60f
```

4. SSH 키 이용 시 bad permissions: ignore key: 에러가 발생

```
키의 권한 (Permission) 을 chmod 를 통해 400 으로 변경

$ chmod 400 ./{key_name}

출처: https://www.deok.me/entry/SSH-키-이용-시-bad-permissions-ignore-key-에러가-발생할-경우
```

5. Nginx 웹서버 Config 설정시 Conflicting Server Name 에러 발생

```
다른 설정 파일에서 동일한 server name이 설정됨

보통 default와 새로 생성한 server name이 겹친다. 둘 중 하나 삭제

```

6. Bash Shell Script의 "[: too many arguments" 에러

```
나의 경우에는 Dockerfile의 if문의 수와 fi의 수가 달랐고
elseif 나 if의 then이 없었다.
그리고 then은 newline으로 써야함
```

7. tar 압축, 압축 풀기

```
tar -zcvf abc.tar.gz abc -> 압축
tar -xvf abc.tar    -> 압축풀기

참고 : https://cryptosalamander.tistory.com/99
```
