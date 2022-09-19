## hadoop 클러스터 실행 오류

하둡 클러스터 실행시 ssh exited exit 1 이라는 오류가 발생

hadoop디렉토리에 logs 에서 찍히는 로그 확인

각 node마다 실행되는 log를 확인 해본 결과 datenode를 제외한 모든 노드들의 포트가 사용중이라고 나옴

각각의 node를 확인해서 사용중인 포트를 kill해야함

가장먼저 namenode를 초기화 해야함

$ hdfs namenode -format

netset -nap | grep 포트번호
로 pid를 확인하고

kill -9 PID번호 를 해줌.

하지만 secondaryNameNode는 ERROR org.apache.hadoop.hdfs.server.namenode.SecondaryNameNode: Exception in doCheckpoint
이런 오류를 발생하는데
core-site.xml에서 hadoop.tmp.dir 로 작성한 디렉토리를 삭제해주면된다.
필자의 경우 /home/ubuntu/tmpdata 였는데 rm -rf tmpdata로 디렉토리를 삭제후 mkdir tmpdata로 디렉토리를 재생성 해줬다.

core-site.xml은 vi $HADOOP_HOME/etc/hadoop/core-site.xml 로 확인가능하다.

그리고 또 다른 오류를 발생하는게 datenode인데 Initialization failed for Block pool <registering> (Datanode Uuid unassigned)
이런 오류를 발생한다.
로그를 확인해보면 datenode 클러스터 ID와 namenode 클러스터 ID가 달라서 나는 오류라고 한다.
log상의 namenode 클러스터 ID를 복사해놓고 datanode/current/VERSION에 붙여넣으면 된다.
필자는 home/ubuntu/dfsdata/datanode/current/VERSION에 있다.
