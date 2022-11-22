-- 스키마 생성 후 한번씩 실행

-- 워크벤치의 기능으로 광범위한 수의 데이터에 대해 update, delete를 하려고 할때 에러가 발생하는 경우 처리방법 
SET SQL_SAFE_UPDATES=0;


-- 	funtion 등을 생성하는 것을 막아 둔 옵션.
SET GLOBAL log_bin_trust_function_creators = 1;