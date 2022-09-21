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

9. mapred-site.xml 파일 편집하기

- **mapreduce 파일의 값을 정의하기 위한 파일입니다.**

```
$ vi $HADOOP_HOME/etc/hadoop/mapred-site.xml
```

<configuration>

<property>

<name>mapreduce.framework.name</name>

<value>yarn</value>

</property>

</configuration>

10. yarn-site.xml 파일 편집하기

- **yarn-site.xml은 yarn에 관련된 세팅들을 정의 하는 파일이다.**
- **node manager, Resource manager, containers, application master설정에 관한것을 포함합니다.**

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

---

### sqoop 설치하기
