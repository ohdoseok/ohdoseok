## Nginx라우팅과 나의 설정

nginx에서는 /etc/nginx/sites-available/ 폴더 내에 있는 default 파일을 기준으로 라우팅한다.
나는 default 파일을 삭제하고 myapp.conf 파일을 만들어서 sites-enable에 심볼릭 링크를 만들어서 사용했다

```
$ sudo touch /etc/nginx/sites-available/myapp.conf
$ sudo ln -s /etc/nginx/sites-available/myapp.conf /etc/nginx/sites-enabled/myapp.conf
```

### 라우팅 코드 분석

server {
listen 80 default_server;
listen [::]:80 default_server;
root /home/ubuntu/app-server2/dist;
index index.html index.htm;
server_name j7d106.p.ssafy.io;
include /etc/nginx/conf.d/service-url.inc;

resolver 127.0.0.53 valid=5s;
set $elb " j7d106.p.ssafy.io ";

location / {
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-Proto https;
try_files $uri /index.html;
}
location /api {
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

#### 코드 블럭

server{} : 도메인 단위의 1차 라우팅 https://j7d106.p.ssafy.io
location{} : 도메인 내부의 2차 라우팅 https://j7d106.p.ssafy.io/api

#### server 블럭 내 구문들

server_name : server블록에서 어떤 도메인을 라우팅 할 것인가.
access_log / error_log : 서버에 대한 로그를 남긴다.
root : server_name에 해당하는 도메인이 있을 때, root 폴더를 지정할 수 있다.
index : 어떤 파일을 index로 지정할 것인가를 설정.

#### location 블럭 내 구문들

try_files $uri $uri/ =404; : nginx는 정적 파일 호스팅을 기본적으로 지원하지 않아서 root 폴더 내에 uri에 따른 폴더가 있는지 찾아보고, 만약 없다면 404 에러를 보여준다.
proxy_set_header X-Real-IP $remote_addr; : 실제 접속자의 IP를 X-Real-IP 헤더에 입혀서 전송.
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; : 프록시나 로드 밸런서를 통해 들어온 요청에서 클라이언트 원 IP주소를 확인하기 위해 사용하는 헤더값
proxy_set_header Host $http_host; : http reques의 host 헤더값
proxy_set_header X-Forwarded-Proto https; : 클라이언트가 프록시 또는 로드 밸런서에 연결하는데 사용되는 프로토콜(http or https)를 식별하기 위한 표준헤더
try_files $uri /index.html; : 요청한 주소의 uri를 무시하고 index.html파일을 제공한다.

#### certbot을 사용한 http->https 리다이렉트

location / {
return 301 https://$server_name$request_uri;
}
http로 들어오는 모든 경우 모든 요청을 https로 리다이렉트 시킨다.
certbot 설치를 하면서 생성된 ssl, ssl_key 모두 자동으로 certbot이 default에 입력한다.
