## Ubuntu에 hadoop, sqoop 설치

### 하둡 설치하기

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

```
$ ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
$ cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
$ chmod 0600 ~/.ssh/authorized_keys
$ ssh localhost
```

비밀번호를 묻지않으면 성공

만약 이후에도 계속 비밀번호를 묻는다면

```
$ sudo vi /etc/ssh/sshd_config
```

PermitRootLogin yes
StrictModes no
AuthorizedKeysFile .ssh/authorized_keys .ssh/authorized_keys2
PasswordAuthentication yes
ChallengeResponseAuthentication no
UsePAM no

```
$ sudo service network-manager restart
$ sudo service ssh restart
```

6. 하둡 설치
   버전이 계속 바뀌기 때문에 https://downloads.apache.org/hadoop/common 에서 확인 후 wget

```
$ cd
$ wget https://downloads.apache.org/hadoop/common/hadoop-3.2.3/hadoop-3.2.3.tar.gz
$ tar xzf hadoop-3.2.3.tar.gz
```

- 하둡 환경변수 설정하기

```
$ vi ~/.bashrc
```

- 다음의 내용을 추가하기

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_HOME=/home/ubuntu/hadoop

export HADOOP_CLASSPATH=/home/ubuntu/sqoop/lib/
export HADOOP_INSTALL=$HADOOP_HOME
export HADOOP_MAPRED_HOME=$HADOOP_HOME

export HADOOP_COMMON_HOME=$HADOOP_HOME

export HADOOP_HDFS_HOME=$HADOOP_HOME

export YARN_HOME=$HADOOP_HOME

export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native

export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib/native"

- 변경내용 적용하기

```
$ source ~/.bashrc
```

- hadoop-env.sh 파일 편집하기

```
$ vi $HADOOP_HOME/etc/hadoop/hadoop-env.sh
```

yarn, HDFS, MapReduce 하둡관련된 프로젝트 셋팅에 관한 파일입니다.
#export JAVA_HOME= 부분을 수정
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64

- java path 확인

```
$ which javac
$ readlink -f /usr/bin/javac
```

7. core-site.xml 편집하기

- **core-site.xml 은 HDFS와 Hadoop 핵심 property들을 정의하는 파일**

```
$ vi $HADOOP_HOME/etc/hadoop/core-site.xml
```

start-dfs.sh 시에 Permission denied
![permission denied](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcrsUmd%2FbtqIVIJkjbr%2FkZsOl6iGq1zVhWvMSr4V1k%2Fimg.png)
해결방법

```
$ sudo vi ~/.bashrc
export PDSH_RCMD_TYPE=ssh 추가
```

```
<configuration>

<property>

<name>hadoop.tmp.dir</name>

<value>/home/ubuntu/tmpdata</value>

</property>

<property>

<name>fs.default.name</name>

<value>hdfs://127.0.0.1:9000</value>

</property>

</configuration>

```

hadoop.tmp.dir => 클러스터 내의 NameNode를 가리키는 URI (protocol 표시, host명, port) 이다. 모든 DataNode instance는 반드시 NameNode에 등록을 해야 하므로 DataNode는 NameNode의 주소를 알고 있어야 한다. 개별 클라이언트 프로그램은 이 정보를 통해 실제 파일 블록의 위치를 알아낼 수 있다.

hadoop의 핵심 property들을 정의하기위한 tmpdata를 만들어줘야함

```
$ cd
$ mkdir tmpdata
```

8. hdfs-site.xml 파일 편집하기

- **데이터 노드와 네임노드의 저장소 디렉토리를 설정하는 파일**

```
$ vi $HADOOP_HOME/etc/hadoop/hdfs-site.xml
```

```
<configuration>
<property>

<name>dfs.data.dir</name>

<value>/home/ubuntu/dfsdata/namenode</value>

</property>

<property>

<name>dfs.data.dir</name>

<value>/home/ubuntu/dfsdata/datanode</value>

</property>

<property>

<name>dfs.replication</name> //자신이 가지고 있는 data를 몇개나 복제할 것인가

<value>1</value>

</property>
</configuration>
```
9. mapred-site.xml 파일 편집하기

- **mapreduce 파일의 값을 정의하기 위한 파일입니다.**

```
$ vi $HADOOP_HOME/etc/hadoop/mapred-site.xml
```

```
<configuration>

<property>

<name>mapreduce.framework.name</name>

<value>yarn</value>

</property>

</configuration>

```
10. yarn-site.xml 파일 편집하기

- **yarn-site.xml은 yarn에 관련된 세팅들을 정의 하는 파일이다.**
- **node manager, Resource manager, containers, application master설정에 관한것을 포함합니다.**
```
$ vi $HADOOP_HOME/etc/hadoop/yarn-site.xml
```

```
<configuration>

<property>

<name>yarn.nodemanager.aux-services</name>

<value>mapreduce_shuffle</value>

</property>

<property>

<name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name> <value>org.apache.hadoop.mapred.ShuffleHandler</value>

</property>

<property>

<name>yarn.resourcemanager.hostname</name>

<value>0.0.0.0</value>

</property>

<property>

<name>yarn.resourcemanager.address</name>

<value>0.0.0.0:8032</value>

</property>

<property>

<name>yarn.web-proxy.address</name>

<value>0.0.0.0:8089</value>

</property>

<property>

<name>yarn.acl.enable</name>

<value>0</value>

</property>

<property>

<name>yarn.nodemanager.env-whitelist</name> <value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CONF_DIR,CLASSPATH_PERPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_MAPRED_HOME</value>

</property>

</configuration>

```

10. Format HDFS Namenode

- Hadoop 서비스를 처음 시작하기전에 namenode를 format 해야한다

```
$ hdfs namenode -format
```

11. 하둡클러스터 시작하기

```
$ start-dfs.sh
$ start-yarn.sh

or

$ start-all.sh
```

참고 : https://spidyweb.tistory.com/214
hadoop configure : https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=airguy76&logNo=150087361763

---

### sqoop 설치하기

http://archive.apache.org/dist/sqoop/ 이곳에서 설치할 sqoop 버전을 확인한다

1. 설치

```
$ wget https://archive.apache.org/dist/sqoop/1.4.7/sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
```

압축풀기

```
$ tar -xvf sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
```

심볼릭 링크 설정

```
ln -s sqoop-1.4.7.bin__hadoop-2.6.0 sqoop
```

심볼릭은 바로가기로 생각하면 된다 sqoop-1.4.7.bin\_\_hadoop-2.6.0 디렉토리를 sqoop으로 바로 연결된다.

2. 환경변수 세팅

**환경변수**
/etc/profile : 부팅시 적용되는 파일 (root)

/home/사용자계정/.bash_profile : 각 계정에 로그인할 때 로드

/home/사용자계정/.bashrc : 로그인 한 상태에서 터미널을 열면 실행

```
$ vi ~/.bashrc
```

export SQOOP_HOME=/home/ubuntu/sqoop
export SQOOP_CONF_DIR=$SQOOP_HOME/conf

export SPARK_HOME=/home/ubuntu/spark-3.2.2

export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin:$SQOOP_HOME/bin:$SPARK_HOME/bin:$SPARK_HOME/sbin

환경변수 적용

```
$ source ~/.bashrc
```

2. 스쿱 설정파일에 하둡관련 설정을 추가
   sqoop-env.sh 를 수정하는데 복사해서 만든다.

```
$ cp sqoop/conf/sqoop-env-template.sh sqoop/conf/sqoop-env.sh
```

- 해당 디렉토리로 이동

```
$ cd sqoop/conf/
```

- sqoop-env.sh수정

```
vi sqoop-env.sh
```

#Set Hadoop-specific environment variables here.
export HADOOP_HOME=/home/ubuntu/hadoop

#Set path to where bin/hadoop is available
export HADOOP_COMMON_HOME=/home/ubuntu/hadoop

#Set path to where hadoop-\*-core.jar is available
export HADOOP_MAPRED_HOME=/home/ubuntu/hadoop

#set the path to where bin/hbase is available
#export HBASE_HOME=

#Set the path to where bin/hive is available
export HIVE_HOME=/home/ubuntu/hive

하둡과 hive위치를 설정

3. 스쿱과 연동할 DBMS의 연결 드라이버를 다운

Mysql과 연결을 위한 db 커넥터 다운로드

```
$ wget https://downloads.mysql.com/archives/get/p/3/file/mysql-connector-java-5.1.46.tar.gz
```

압축 풀기

```
tar -xvf mysql-connector-java-5.1.46.tar.gz
```

폴더로 들어가서 jar 파일을 스쿱의 lib로 옮겨야함

```
$ cd mysql-connector-java-5.1.46/
$ mv mysql-connector-java-5.1.46-bin.jar /home/ubuntu/sqoop/lib/
```

스쿱의 jar파일을 하둡 lib로 복사

```
$ cd
$ cd sqoop
$ cp sqoop-1.4.7.jar /home/ubuntu/hadoop/share/hadoop/tools/lib/
```

4. sqoop import시에 java.lang.NoClassDefFoundError: org/apache/commons/lang/StringUtils 라는 에러를 방지하기위해서

```
$ cd

$ wget https://mirror.navercorp.com/apache//commons/lang/binaries/commons-lang-2.6-bin.tar.gz

$ tar -xvf commons-lang-2.6-bin.tar.gz

$ cd commons-lang-2.6
```

압축을 푼 디렉토리의 commons-lang-2.6jar 파일을 스쿱의 lib로 복사한다

```
$ cp commons-lang-2.6.jar /home/ubuntu/sqoop/lib
```

해당 디렉토리로 가서 겹치는 기존 파일의 이름을 바꿔준다.

```
$ cd /home/ubuntu/sqoop/lib/

$ ll common*

$ mv commons-lang3-3.4.jar commons-lang3-3.4.jar.bak
```

5. mysql 설정

만약 mysql의 기본포트 3306이 사용중이라는 오류가 나오면 mysql의 포트를 변경해준다.

```
$ sudo su
# vi /etc/mysql/mysql.conf.d/mysqld.cnf
```

port=3307로 변경

mysql 재구동

```
$ systemctl restart mysqld
```

mysql에 root로 접속

```
$ sudo mysql -u root -p
```

모든 외부접속을 허용하는 .% 사용자를 만든다

```
> create user 'hive'@'%' identified by '비밀번호';
```

이때 비밀번호가 맞지않는다고 나오면?
정책삭제

```
uninstall plugin validate_password;
```

권한부여

```
grant all privileges on *.* to 'hive'@'%';
```

항상 사용자를 만들거나 수정, 권한 변경시 flush

```
flush privileges;
```

반드시 mysql의 외부접속을 허용해야한다

```
$ vi /etc/mysql/my.cnf
```

!includedir /etc/mysql/conf.d/
!includedir /etc/mysql/mysql.conf.d/

다음과 같은 내용이 있다면

```
vi /etc/mysql/mysql.conf.d/mysqld.cnf
```

여기서 확인한다

bind-address = 0.0.0.0
로 변경

변경후

```
$ service mysql restart
```

오류가 안나면 잘 설치 된것

```
$ sqoop help
```

6. sqoop 명령어

데이터베이스 리스트 확인

```
$ sqoop list-databases --connect jdbc:mysql://ip주소:3306 --username hive --P

```

import

```
$ sqoop import --connect jdbc:mysql://ip주소:3306/스키마이름 --table 테이블이름 --target-dir /output저장할경로 --username hive --P -m 1
```

export

```
$ sqoop export --connect jdbc:mysql://ip주소:3306/스키마이름 --table 데이터가 들어갈 테이블명 --export-dir /input될데이터경로/part-m-00000 --username hive --P
```

참고 : https://earthconquest.tistory.com/241

import결과를 local로 옮기려면

```
$ hadoop fs -get /데이터경로/part-r-00000 $HOME/new1.csv
```

시각화, hadoop 명령어 : https://warm-uk.tistory.com/61?category=810504
