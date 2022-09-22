## Mysql에 csv넣기

```
$ sudo mysql --local-infile=1 -u root -p1
```

infile을 위해 접속

```
> LOAD DATA LOCAL INFILE "/home/ubuntu/gitclone/S07P22D106/data/testutf8.csv" INTO TABLE test.review2 CHARACTER SET utf8mb4  FIELDS TERMINATED BY "," IGNORE 1 ROWS (`reviewIndex` , `memberIndex` , `drinkIndex` , `createdAt` , `updatedAt` , `weekday` , `memberId` , `age` , `gender` , `score` , `review` , `isCrawled`);
```

데이터 넣기

```
$ iconv -c -f CP949 -t utf-8 reviewERD.csv > testutf8.csv
```

인코딩변환

```
$ file -bi reviewERD.csv
```

인코딩찾기
