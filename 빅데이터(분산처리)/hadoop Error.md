## hadoop Error

### hdfs mkdir 디렉토리 에러

```
$ hdfs dfs -mkdir 디렉토리명
mkdir error
hadoop의 HDFS 디렉토리 확인
$ hdfs dfs -mkdir /user
$ hdfs dfs -mkdir /user/hadoop
```

### hdfs safemode error

name node의 비정상 종료 시 safemode 활성화
종료시 꼭

```
stop-dfs.sh
```

safemdoe 탈출

```
$ hdfs dfsadmin -safemode leave
```
