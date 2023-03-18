## 3xx : redirect

영구적 redirect / 301 : redirct시 메시지 제거 및 GET요청으로 변경될 수 도 있음 -> 해결 위해서 308 하지만 대부분 301사용

일시적 redircet / 302, 307, 303 : Get으로 변하고 본문 제거 될 수 있음, 안바뀜, 반드시 바뀜

ex ) Nginx Certbot redirect

80포트로 들어온 요청을 redirect

```
if ($scheme != "https") {
        return 301 https://$host$request_uri;
    } # managed by Certbot
```

---

### Request 1

```
Get /event HTTP/1.1
Host: localhost:8080
```

### Response 1

```
HTTP/1.1 301 Moved Permanently
Location: /new-event
```

### Request 2

```
Get /new-event HTTP/1.1
Host: localHost:8080
```

### Response 2

```
HTTP/1.1 200 OK
Body
```

---

### 영구적 redirct와 일시적 redirct의 활용

```
@Get("/15rXN3N")
@Redirect("/16rXN3N", 301)
async redirectToBridge() {
    const url = "/16rXN3N"
    return { url }
}

@Get("/16rXN3N")
@Redirect("https://www.daum.net", 303)
async redirectToTargetUrl() {
    const url = "https://www.daum.net"
    return { url }
}
```

url을 계속해서 변경해야 하는 경우에 303은 301과 202의 다리 역할이 가능

301 : 항상 /16rXN3N으로 redirect
303 : www.daum.net으로 redirect

---

### 301 과 302의 차이점

인터넷 브라우저에서 사용자가 A라는 페이지를 요청했는데, Url이 B라는 페이지로 변경되었다면 해당 페이지는 리다이렉트가 되었다는 것을 뜻한다.

이럴때, 301 리다이렉트를 한다면 검색엔진 크롤링에서는 B라는 페이지에 대한 수집을 하지만

302 리다이렉트를 한다면, A라는 페이지에 대해서 수집할 것이다.

---

### 302의 사용

주문 Post요청 -> 200 response -> 새로고침 -> 이 전의 요청인 주문 Post재요청

### PRG : post/redirect/get

post주문 후 -> 주문결과 화면을 get 메서드로 리다이렉트 -> 새로고침해도 결과 화면을 get으로 조회 -> 중복 주문 대신 결과 화면만 get으로 다시 요청

### Request 1

```
POST /order HTTP/1.1
Host: localhost:8080

itemId=mouse&count=1
```

### Response 1

```
HTTP/1.1 302 Found
Location: /order-result/19
```

여기서 301을 사용하게 되면 영구히 redirct이기 때문에 302로 사용

### Request 2

```
GET /order-result/19 HTTP/1.1
Host: localhost:8080
```

### Request 2

```
HTTP/1.1 200 OK

body : 주문완료
```

---
