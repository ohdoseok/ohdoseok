## 왕초보도 따라만하면 되는 EC2, Jenkins, Nginx, Certbot, Gitlab, React, SpringBoot, Mysql을 사용하는 CI/CD

## 개념

EC2에 설치된 Jenkins가 Gitlab의 지정된 branch에서 trigger를 감지하면 자동으로 EC2내의 지정된 장소로 지속적인 통합(CI) 한다.
그리고 미리 정해놓은 shell명령어로 Build한다. (만약 한 repository에서 frontend와 backend를 모두 관리하고 있다면 각각을 Build해주는 명령어를 넣어줘야한다.)
Build가 완료 되었다면 jenkins가 실행까지 했을텐데(지속적인 배포 : CD), 여기서 nginx가 들어오는 요청을 보고 각각 front쪽인지 back쪽인지 판단해서 api를 보내주는 api_gateway 역할을 한다.
또한 Certbot덕에 https://publicip/ 로 들어왔을것이다. 여기 까지가 전체적인 CI/CD 흐름이다.

---

## 시작

준비물 : 간단한 frontend코드, 간단한 backend코드 -> 왕초보는 천천히 수동으로 build하면서 확인해보는게 좋은 것 같다. 그러려면 작동을 하는지 확인을 할 수있는 간단한 코드가 필요하다.

### 먼저 EC2에 접속하고 root 비밀번호와 ubuntu 비밀번호를 생성하자

private key(~.pem)으로 접속하는 것이 가장 좋긴하다.

```
- root 비밀번호 생성
1. ubuntu계정으로 접속(처음접속하면 ubuntu계정이다)
2. sudo passwd root
3. Enter new UNIX password:
4. Retype new UNIX password:
passwd: password updated successfully
성공!

- ubuntu 계정 비밀번호 생성
1. ubuntu계정으로 접속(처음접속하면 ubuntu계정이다)
2. sudo su(root 계정으로 변경)
3. passwd ubuntu

위의 2~4까지 동일

```

- 팁

```

sudo passwd root ( root 비밀번호 변경 )

```

### EC2에 jenkins와 mysql, nginx를 설치해보자

#### jenkins설치

```
1. apt-get update
2. sudo apt-get install openjdk-11-jdk (뒤에 나오는 jenkins와 git의 연결에 8버전이면 버그가 있어서 11버전 추천, 무조건 8이상이어야함)
3. wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -  (repository키 추가)
4. sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list' (sources.list에 추가)
5. sudo apt-get update && apt-get install jenkins (jenkins를 apt-get 으로 설치)
6. sudo ufw allow 8080 (혹시 방화벽있으면 열기, 방화벽 확인 : ufw status)
7. sudo systemctl start jenkins (jenkins 시작)
8. sudo cat /var/lib/jenkins/secrets/initialAdminPassword (http://publicIP:8080으로 최초 접속시 필요한 Administrator password)
```

- 젠킨스 포트변경?

```
1. sudo vi /etc/default/jenkins
<img src = "./images/jenkinsport1.png">
i (insert mode)
HTTP_PORT = 바꿀포트번호

ESC -> :wq! (저장후 나감)
sudo ufw allow 9090

2. sudo vi /etc/sysconfig/jenkins
![젠킨스포트변경](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FwmWXN%2FbtryRspsX2J%2FlvKJjaakDdAkKv9qQwovAk%2Fimg.png)
나는 없어서 new file이 열린다.

3.
sudo chmod 777 /usr/lib/systemd/system/jenkins.service (777은 소유자(첫번째숫자), 그룹 사용자(두번째숫자), 기타사용자(마지막숫자) 모두가 읽기4 + 쓰기2 + 실행1 권한을 jenkins.service에 가진다)
sudo vi /usr/lib/systemd/system/jenkins.service
![젠킨스포트변경](images/jenkinsport3.png)
sudo chmod 444 /usr/lib/systemd/system/jenkins.service (444는 모든 사용자가 읽기만 가능)

이후에
sudo systemctl daemon-reload
sudo service jenkins restart

```

초기 화면이 나오면 설치 8 : sudo cat /var/lib/jenkins/secrets/initialAdminPassword 으로 password를 복사해서 붙여넣는다.
-> install suggested plugins
-> 계정, 암호, 이름, 이메일 주소 넣고
-> Jenkins관리 -> 플러그인 관리 -> gitlab 설치, nodejs 설치, post build task 설치

일단 여기까지 하고 나머지 설치하자

---

#### Mysql설치

```
sudo apt-get update
sudo apt-get install mysql-server (설치 중간중간에 password를 물어보는데 빈칸으로 두고 ok를 누르면 ubuntu 서버 비밀번호와 동기화 된다)
sudo ufw allow mysql (외부 접속을 허용해주자)
sudo service mysql start
sudo systemctl enable mysql ( ubuntu 서버가 재시작 되더라도 mysql이 자동 시작되도록 등록)
sudo mysql -u root -p (root로 접속, 비밀번호는 동일)
mysql>
use mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY '바꿀비밀번호';    or    ALTER user 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '바꿀 비밀번호'; (비밀번호는 반드시 바꿔야 하고 굉장히 어렵게 해야 해킹당하지않는다)
flush privileges; (변경사항 저장)
create user '사용자 계정명'@'%' identified by '비밀번호'  (%는 사용자 계정을 허용하는 접속 ip이다)
SELECT User, Host, authentication_string FROM mysql.user; (계정이 만들어졌나 확인가능)
GRANT ALL PRIVILEGES ON *.* to 만든계정이름@'%'; (모든권한을 모든db에 허용, 정말 조심해야함 !! 꼭 비밀번호는 어렵게!!!)
exit
sudo su
cd /etc/mysql/mysql.conf.d
vi mysqld.cnf
bind-address를 찾아서 0.0.0.0으로 변경. (mysql의 외부접속 허용)
![젠킨스포트변경](images/mysql.png)
service mysql restart
```

이제 workbench에 가서 publicIp와 username, pwd로 서버내의 mysql에 접속할수있다!

- 팁

```
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' -> mysql 서버가 켜져있는지 확인

service mysql stop (mysql 중지)
service mysql start (mysql 시작)
service mysql restart (mysql 재시작)
service mysql status (mysql 상태확인)

```

---

#### Nginx설치

```
sudo apt install nginx
sudo find / -name nginx.conf (nginx.conf 위치 찾기)
cd 나온경로

sites-available : 가상 서버 환경들에 대한 설정 파일들이 위치하는 부분입니다. 가상 서버를 사용하거나 사용하지 않던간에 그에 대한 설정 파일들이 위치하는 곳이다.
sites-enabled : sites-available 에 있는 가상 서버 파일들중에서 실행시키고 싶은 파일을 symlink로 연결한 폴더입니다. 실제로 이 폴더에 위치한 가상서버 환경 파일들을 읽어서 서버를 세팅합니다.
nginx.conf : Nginx에 관한 설정파일로 Nginx 설정에 관한 블록들이 작성되어 있으며 이 파일에서 sites-enabled 폴더에 있는 파일들을 가져옵니다.

그중 sites-available, sites-enabled 폴더를 수정하게 된다.
sudo cp -r /etc/nginx/sites-available/ /etc/nginx/sites-available-origin (백업)
sudo cp -r /etc/nginx/sites-enabled/ /etc/nginx/sites-enabled-origin (백업)

그 다음에 sites-available, sites-enabled 폴더 내부의 default 설정 파일들을 아래 명령어로 제거해주자.
sudo rm /etc/nginx/sites-available/default
sudo rm /etc/nginx/sites-enabled/default

sudo touch /etc/nginx/sites-available/아무거나.conf (react 프로젝트의 build 결과물을 배포할 설정 파일을 생성)

sudo vi /etc/nginx/sites-available/아무거나.conf
server {
  listen 80;
  location / {
    root   /home/hanumoka/examples/myapp/build; (빌드경로)
    index  index.html index.htm;
    try_files $uri /index.html;
  }
}

sudo ln -s /etc/nginx/sites-available/myapp.conf /etc/nginx/sites-enabled/myapp.conf (siete-enabled 폴더에 심볼릭 링크를 만들자)

sudo systemctl stop nginx
sudo systemctl start nginx
sudo systemctl status nginx

sudo iptables -I INPUT 1 -p tcp --dport 80-j ACCEPT (방화벽 80포트 허가)

만약 500에러를 던진다면 conf파일이나 build 경로에 문제가 있다

출처 : https://www.hanumoka.net/2019/12/29/react-20191229-react-nginx-deploy/

```

이제 EC2에 설치할 모든 것들을 설치했다!

나는 왕초보라서 깃에 연결된 젠킨스가 가져온 파일들을 EC2에서 직접 빌드 해보려고 nodejs와 npm을 최신버전으로 설치해서 사용했다.
젠킨스를 사용하면서 React가 build가 되지않는 문제 때문에 git을 직접 설치해서 직접 clone해서 build도 해보기 위해서 git도 설치했다.

이러한 이유로 nodejs와 git 설치하는 방법도 명시한다.

---

### 번외 : nodejs와 git설치

- NodeJs설치

nodejs와 npm은 최신버전으로 설치해야한다!
또한 깃에 연결된 jenkins가 가져오는 파일들은 사용자가 jenkins이기 때문에 sudo su jenkins로 해서 nodejs와 npm을 최신버전으로 설치해야한다

```
1. curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_16_setup.sh (설치 스크립트를 다운로드합니다)(원하는 버전이 있다면 16자리에 넣자 ex)14,15 등 )
2. sudo bash nodesource_setup.sh (그 다음 다운로드한 스크립트를 실행시킵니다)(스크립트를 실행하면 ppa 등록이 완료됩니다.)
3. sudo apt install nodejs (nodejs설치)
4. sudo apt install build-essential (추가적으로 npm으로 패키지를 설치할 때 컴파일이 필요한 경우가 있으니 각종 빌드 툴이 포함된 build-essential 패키지가 설치되어 있지 않다면 설치해줍니다)
출처 : https://kingofbackend.tistory.com/166
5. sudo npm install -g npm (npm 최신버전으로 upgrade)

```

- 에러 팁

```

sh: 1: node: Permission denied 와 같은 err가 나면 사용자를 jenkins로 변경하고 nodejs와 npm버전을 확인해보자

```

- git설치

```

1. sudo apt-get update (설치 전후로 반드시 update!)
2. sudo apt-get install git (깃 설치)
3. git --version or git -version or git -V (설치가 잘되었는지 버전확인)
4. mkdir /home/원하는이름 (원하는 이름으로 디렉토리생성)
5. cd /home/원하는이름
6. git clone 주소 (clone 잘되는지 확인)

```

---

## Jenkins와 Gitlab 연결

깃랩연결은 ssh연결과 accessToken연결 두가지가 있다
나는 accessToken으로 한다.
jenkins와 gitlab을 연결해서 webhook을 걸기 위해서 git의 accesstoken과 jenkins의 시크릿토큰, 웹훅 url이 필요하다.
jenkins프로젝트 생성, Build Triggers에 Build when a change is pushed to GitLab. GitLab webhook URL을 체크하면 gitlab 웹훅 url이 나온다.
아래에 고급 버튼을 누르고 generate 누르면 시크릿 토큰이 나오는데 이 두가지를
![webhook](images/webhook.png)
에 넣어준다.

그리고 발급받은 accessToken은 jenkins 소스 코드 관리의 Repository URL에 넣는다.
https://safers_repository:accessToken@gitlab repository url

연결이 완료되면 Build의 Execute shell을 작성하자

```
echo 'jenkins build started...'

### frontend build ###
cd frontend-web
npm install
CI= npm run build:dev (eslint 무시)

### backend build ###
cd ..
sudo chmod -R 777 backend-web
cd backend-web
./gradlew clean build

pid=$(ps -eaf | grep Mybuddy-0.0.1-SNAPSHOT.jar | grep -v "grep" | grep -v $0 | awk '{print $2}')
if [[ $pid == "" ]]
then
 echo Mybuddy-0.0.1-SNAPSHOT.jar is not running
else
 sudo kill -9 $pid
 echo Mybuddy-0.0.1-SNAPSHOT.jar process killed forcefully, process id $pid.
fi
```

빌드 후 조치
Post build task
Log text : BUILD SUCCESS
Script :
BUILD_ID=dontKillMe
sudo nohup java -jar /var/lib/jenkins/workspace/ssafyD208/backend-web/build/libs/Mybuddy-0.0.1-SNAPSHOT.jar & (백그라운드에서도 실행)
echo $!

Escalate script ececution status to job status 체크

---

## Nginx설정

참고 : https://codechacha.com/ko/deploy-react-with-nginx/
위에서 작성한 conf파일에 작성
server{
listen 80;
root 젠킨스가 깃에서 받아온 프론트 파일을 빌드하고 생기는 build 폴더
index index.html index.htm;
location / { (프론트)
try_files $uri $uri/ /index.html;
}

location /mybuddy { (백)
proxy_pass https://localhost:9999;
proxy_redirect off;
charset utf-8;

proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy-set_header X-Forwarded-Proto $scheme;
proxy_set_header X-NginX-Proxy true;

    proxy_set_header Host $http_host;

}
}

---

## https 적용을 위한 Certbot 설치하기

참고 : https://velog.io/@kimmjieun/nginx%EC%97%90-SSLHTTPS-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0

```
# sudo su #/var/www/html 안에서
# apt-get update
# apt-get install software-properties-common
# add-apt-repository universe
# add-apt-repository ppa:certbot/certbot
# apt-get update

# apt install certbot
# apt install python-certbot-nginx -> nginx와 사용할때

# certbot --nginx


Enter email
A
Y
2

# certbot certonly --nginx

1 2
2

# vi /etc/crontab (자동갱신)
0  0 * * * root certbot -q renew --nginx >> /var/log/letscript.renewal.log 2>&1 #추가
# service cron restart

```
