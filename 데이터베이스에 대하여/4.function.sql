INSERT INTO TBL_USER_KR(USER_SEQ,USER_ID,USER_PASS,USER_NAME,USER_EMAIL)
VALUES(NEXTVAL('userSeq'),'userKr1',sha2('1111', 256),'유저명1','userKr1@gmail.com');


INSERT INTO TBL_USER_EN(USER_SEQ,USER_ID,USER_PASS,USER_NAME,USER_EMAIL)
VALUES(NEXTVAL('userSeq'),'userEn2',sha2('1111', 256),'userName2','userEn2@gmail.com');


INSERT INTO TBL_BOARD(USER_SEQ, BOARD_TITLE, BOARD_CONTENTS)
VALUES (1, '첫번째 게시판 글 제목', '첫번째 게시판 글 내용');

INSERT INTO TBL_BOARD(USER_SEQ, BOARD_TITLE, BOARD_CONTENTS)
VALUES (2, '두번째 게시판 글 제목', '두번째 게시판 글 내용');


INSERT INTO TBL_BOARD(USER_SEQ, BOARD_TITLE, BOARD_CONTENTS)
VALUES (1, '세번째 게시판 글 제목', '세번째 게시판 글 내용');



select * from TBL_USER_KR;

select * from TBL_USER_EN;

select * from TBL_BOARD;


-- 작성한 글 조회시 항상 작성자 아이디, 이름 함께 보여줘야 함
DROP FUNCTION IF EXISTS `FN_GET_USER_NAME`;
DELIMITER ;;
CREATE FUNCTION `FN_GET_USER_NAME`(_userSeq BIGINT) RETURNS VARCHAR(40)
BEGIN
DECLARE krUserCnt TINYINT;
DECLARE _userName VARCHAR(40);
	SELECT COUNT(*) INTO krUserCnt
    FROM TBL_USER_KR 
    WHERE USER_SEQ = _userSeq;
	
    IF krUserCnt > 0 THEN
		SELECT USER_NAME INTO _userName
		FROM TBL_USER_KR
		WHERE USER_SEQ = _userSeq;
	ELSE
		SELECT USER_NAME INTO _userName
		FROM TBL_USER_EN
		WHERE USER_SEQ = _userSeq;
	END IF;
RETURN _userName;
END
;;
DELIMITER ;

SELECT FN_GET_USER_NAME (1) as USER_NAME;

SELECT FN_GET_USER_NAME (2) as USER_NAME;

SELECT *, FN_GET_USER_NAME (USER_SEQ) as USER_NAME FROM TBL_BOARD;




-- 회원정보 조회시 회원이 작성한 글 수를 항상 함께 보여줘야 함
DROP FUNCTION IF EXISTS `FN_GET_BOARD_CNT`;
DELIMITER ;;
CREATE FUNCTION `FN_GET_BOARD_CNT`(_userSeq BIGINT) RETURNS VARCHAR(40)
BEGIN
DECLARE _boardCnt INTEGER;

SELECT COUNT(*) INTO _boardCnt
FROM TBL_BOARD
WHERE USER_SEQ = _userSeq;
RETURN _boardCnt;
END
;;
DELIMITER ;


SELECT FN_GET_BOARD_CNT(1) AS BOARD_CNT;

SELECT *, FN_GET_BOARD_CNT(USER_SEQ) AS BOARD_CNT FROM TBL_USER_KR;

SELECT *, FN_GET_BOARD_CNT(USER_SEQ) AS BOARD_CNT FROM TBL_USER_EN;