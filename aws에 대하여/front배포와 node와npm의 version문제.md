node와 npm을 삭제하고 높은 버전으로 재설치

---

```
sudo apt remove nodejs npm
```

node.js와 npm 을 완전히 제거하는 명령어

```
sudo apt remove --purge nodejs npm
```

node.js와 npm 이전 파일을 삭제하는 명령어

```
sudo apt install npm
sudo apt install nodejs
```

설치해도 구버전

```
sudo npm cache clean -f
sudo npm install -g n
sudo n lts
node -
```

node를 최신버전으로 업데이트

```
do npm i -g npm
npm -v
```

npm을 최신버전으로 업데이트

---

---

nvm을 설치해서 node를 처음에 설치할때 바로 높은 버전으로 설치

```
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

터미널 종료후 재접속 한뒤

```
nvm
```

해서 확인

```
nvm ls-remote
```

설치 가능한 버전 확인 후

```
nvm install 16.16
```

```
npm -v
npm install -g npm@8.15.1
```

```
sudo apt update && sudo apt upgrade
```

설치 후에는 습관처럼 업데이트

```
npm i
```

하면 npm을 업그레이드 해서 재설치 하라고 나온다 재설치를 하면 다시 install

```
npm start
```

react 실행완료
