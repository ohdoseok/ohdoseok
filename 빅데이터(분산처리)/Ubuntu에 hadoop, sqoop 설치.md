## Ubuntu에 hadoop, sqoop 설치

첫 번째로 hadoop클러스터관리를 위한 사용자를 생성하는게 좋다. 필자는 그냥 ubuntu계정을 사용해서 했다.

1. 업데이트

```
$ sudo apt-get update
```

2. jdk 설치

```
$ sudo apt-get install openjdk-8-jdk
```

3. java, javac 버전 확인

```
$ java -version
$ javac -version
```

4. 하둡만을 위한 계정 만들기

- localhost와 ssh통신을 위한 openssh-server openssh-client 설치

```
$ sudo apt install openssh-server openssh-client -y
```

- 계정 추가 및 비밀번호 설정

```
$ sudo adduser hdoop
```

- hdoop으로 접속

```
$ su - hdoop
or
$ sudo -u hdoop -s
```

5. 비밀번호없는 ssh통신 가능하게 하기
