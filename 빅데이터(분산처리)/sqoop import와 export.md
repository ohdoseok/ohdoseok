## sqoop import와 export

```
sqoop import  --connect jdbc:mysql://j7d106.p.ssafy.io/jujuclub --table Review --target-dir /output1006 --columns "reviewIndex, memberIndex, drinkIndex, createdAt, updatedAt, weekday, memberId, age, gender, score, review, isCrawled" --username hive --P -m 1
```

```
sqoop export --connect jdbc:mysql://j7d106.p.ssafy.io/jujuclub --table TagDrink --export-dir /export/part-00000-4b325ba9-b5c4-48a4-9dde-12a0f8cf8599-c000.csv --update-key drinkIndex --update-mode allowinsert --username hive --P -m 1
```