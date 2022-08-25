# CORS?

---

### CORS정책이란?

Cross-Origin Resource Sharing
교차 출처 리소스 공유를 제한, 또 다른 정책으로 SOP(Same-Origin Policy) SOP는 같은 출처에서만 리소스를 공유할 수 있는데 이런경우는 굉장히 드문 경우라서 CORS정책을 지킨 리소스 요청은 허용한다.

출처 Origin이란?
!(img)[https://evan-moon.github.io/static/e25190005d12938c253cc72ca06777b1/d9199/uri-structure.png]
출처는 Protocol과 Host, 포트번호까지 모두 합친것
브라우저의 개발자도구에서 Location객체가 가지고있는 origin에 접근함으로 쉽게 어플리케이션이 실행되는 출처를 알아낼 수 있다. -> console.log(location.origin) : http://~

출처를 비교하는 로직이 서버에 구현된 스펙이 아니라 브라우저에 구현되어 있기 때문에
우리가 CORS정책을 위반하는 리소스 요청을 하더라도 해당 서버가 같은 출처에서 보낸 요청만 받겠다는 로직을 가지고 있는 경우가 아니라면 서버는 정상적으로 응답을 하고
브라우저가 이 응답을 분석해서 CORS 정책 위반이라고 판단되면 그 응답을 사용하지 않고 그냥 버린다.

---

### CORS의 작동원리

웹 클라이언트 어플리케이션이 다른 출처의 리소스를 요청할 때는 HTTP 프로토콜을 사용하여 요청을 보내는데,
이때 브라우저는 요청 헤더에 **_Origin이라는 필드에 요청을 보내는 출처_**를 함께 담아보낸다.
이후 서버가 이 요청에 대한 응답을 할 때 응답헤더의 **Access-Control-Allow-Origi** 이라는 값에 이 리소스를 접근하는 것이 허용된 출처 를 내료주고, 이후 응답을 받은 브라우저는 자신이 보냈던 요청의 Origin과 서버가 보내준 응답의 Access-Control-Allow-Origi을 비교해본 후 이 응답이 유효한 응답인지 아닌지를 결정한다.

CORS가 동작하는 방식은 한 가지가 아니라 세 가지의 시나리오에 따라 변경된다.

---

### CORS가 동작하는 시나리오

1.  Preflight Request
    일반적으로 마주치는 시나리오.
    이 시나리오에 해당하는 상황일 때 브라우저는 요청을 한번에 보내지 않고 예비 요청과 본 요청으로 나누어서 서버로 전송된다.
    이때 브라우저가 본 요청을 보내기 전에 보내는 예비요청을 preflight라고 부르는 것이며, 이 예비 요청에는 HTTP 메소드 중 OPTIONS 메소드가 사용된다.
    예비 요청의 역할은 본 요청을 보내기 전에 브라우저 스스로 이 요청을 보내는 것이 안전한지 확인하는 것이다.
    !(img)[https://evan-moon.github.io/static/c86699252752391939dc68f8f9a860bf/d9199/cors-preflight.png]
    js에서 fetch API를 사용하여 브라우저에게 리소스를 받아오라는 명령을 내린다, -> 브라우저는 서버에게 예비 요청을 보낸다 -> 서버는 이 예비 요청에 대한 응답으로 현재 자신이 어떤 것들을 허용하고, 어떤 것들을 금지하고 있는지에 대한 정보를 응답 헤더에 담아서 브라우저에게 보낸다 -> 브라우저는 자신이 보낸 예비 요청과 서버가 응답에 담아준 허용 정책을 비교한 후, 이 요청을 보내는 것이 안전하다고 판단되면 같은 엔드포인트로 다시 본 요청을 보내게 된다. -> 서버가 본 요청에 대한 응답을 하면 브라우저는 최종적으로 이 응담 데이터를 자바스크립트로 넘겨준다.

    실제로 브라우저가 요청한 예비 요청을 보면 Origin에 대한 정보 뿐만 아니라 자신이 에비 요청 이후에 보낼 본 요청에 대한 다른 정보들도 함께 포함되어 있다.
    이런 에비 요청에 대한 서버의 응답을 보면 Access-Control-Allow-Origin 이 중요하다. 서버는 이 리소스에 접근이 가능한 출처는 Access-Control-Allow-Origin에 담아서 브라우저에게 보내주고, 브라우저가 요청을 보낸 Origin과 같은지 비교한다.
    같지 않다면 CORS에러가 발생한다.

    중요한건 서버에서는 정상적으로 응답을 해서 200이 난다는 것이다.
    예비 요청의 성공 여부와 상관없이, 브라우저가 CORS 정책 위반 여부를 판단하는 시점은 예비 요청에 대한 응답을 받은 이후이다.
    예비 요청이 실패해도 CORS위반일 수 있지만, 중요한건 **Access-Control-Allow-Origin** 값이 존재하는가 이다. 만약 200이 아닌 상태 코드가 내려오더라도 헤더에 저 값이 제대로 들어가 있다면 CORS정책 위반은 아니다.

2.  Simple Request
    모든 경우가 preflight request인 경우는 아니다. 특정 조건을 만족하면 예비 요청없이 **본 요청으로만 CORS 정책 위반 여부를 검사하기도 하는데 simple request**이다.
    !(img)[https://evan-moon.github.io/static/d8ed6519e305c807c687032ff61240f8/d9199/simple-request.png]
    서버에게 바로 본요청을 보내면, 서버가 이에 대한 응답의 헤더에 Access-Control-Allow-Origin 과 같은 값을 보내주면 그때 브라우저가 CORS 정책 위반 여부를 검사한다.

    필요한 조건은

    ```
    1. 요청의 메소드는 GET, HEAD, POST 중 하나여야 한다.
    2. Accept, Accept-Language, Content-Language, Content-Type, DPR, Downlink, Save-Data, Viewport-Width, Width를 제외한 헤더를 사용하면 안된다.
    3. 만약 Content-Type를 사용하는 경우에는 application/x-www-form-urlencoded, multipart/form-data, text/plain만 허용된다.
    ```

    하지만 이 조건을 모두 만족하기는 쉽지 않다.
    당장 사용자 인증에 사용되는 **Authorization 헤더** 조차 저 조건에는 포함되지 않는다.

3.  Credentialed Request
    3번째 시나리오는 인증된 요청을 사용하는 방법이다. 이 시나리오는 CORS의 기본적인 방식이라기 보다는 다른 출처간 통신에서 좀 더 보안을 강화하고 싶을 때 사용하는 방법이다.
    기본적으로 브라우저가 제공하는 비동기 리소스 요청 API인 **XMLHttpRequest** 객체나 **fetch API**는 _별도의 옵션 없이 브라우저의 쿠키 정보나 인증과 관련된 헤더를 함부로 요청에 담지 않는다._ 이때 요청에 인증과 관련된 정보를 담을 수 있게 해주는 옵션이 바로 **credentials** 옵션이다.

    옵션에는 총 3가지의 값을 사용할 수 있다.

        | 옵션                 | 값                                             | 설명 |
        | -------------------- | ---------------------------------------------- | ---- |
        | same-origin (기본값) | 같은 출처 간 요청에만 인증 정보를 담을 수 있다 |
        | include              | 모든 요청에 인증 정보를 담을 수 있다           |
        | omit | 모든 요청에 인증 정보를 담지 않는다 |

    만약 same-origin 이나 include와 같은 옵션을 사용하여 리소스 요청에 인증 정보가 포함된다며느 이제 브라우저는 다른 출처의 리소스를 요청할때 Access-Control-Allow-Origin 만 확인하는 것이 아니라 좀 더 빡빡한 검사 조건을 추가하게 된다.

    **_Access-Control-Allow-Origin:\* 의 경우!?_**
    모든 출처를 허용 한다는 의미이지만 CORS 정책 상 Access-Control-Allow-Origin: \* 인 경우 Origin의 제한없이 요청하고 결과를 읽을 수 있지만, 이러한 경우 쿠키를 제거하고 요청하도록 정책이 구성되어 있어서 인증 정보를 포함한 요청에서는 불가능합니다.

    ```
    fetch('https://evan-moon.github.io/feed.xml', {
    credentials: 'include', // Credentials 옵션 변경!
    });
    ```

    동일 출처 여부와 상관없이 무조건 요청에 인증 정보가 포함되어야 하기 때문에 이번 요청에는 브라우저의 쿠키 정보가 함께 담겨있는 것을 확인해봐야한다.
    브라우저는 인증 모드가 include일 경우, 모든 요청을 허용한다는 의미의 \*를 Access-Control-Allow-Origin 헤더에 사용하면 안된다

    이처럼 요청에 인증 정보가 담겨있는 상태에서 다른 출처의 리소스를 요청하게 되면 브라우저는 CORS 정책 위반 여부를 검사하는 룰에 다음 두 가지를 추가하게 된다.

    ```
    1. Access-Control-Allow-Origin에는 *를 사용할 수 없으며, 명시적인 URL이어야한다.
    2. 응답 헤더에는 반드시 Access-Control-Allow-Credentials: true가 존재해야한다.
    ```

---

### CORS의 해결방법

나는 filter를 적용해서 모든 요청에 웹 브라우저에서 권한을 허용할수있도록 해줬다
코드는 다음과 같다

```
package com.ssafy.mybuddy.filter;

import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

// 브라우저의 요청을 확인하고 헤더에 필요한 정보를 넣어줌
// 모든 request는 filter를 탄다. request의 header의 origin을 확인해서 response의 header에 set
@Component
public class AddResponseHeaderFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String origin = request.getHeader("Origin");
        response.setHeader("Access-Control-Allow-Origin", origin );

        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "authorization, content-type, xsrf-token, Sec-Fetch-Mode, Sec-Fetch-Site, Sec-Fetch-Dest");
        response.addHeader("Access-Control-Expose-Headers", "xsrf-token");
        if ("OPTIONS".equals(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            filterChain.doFilter(request, response);
        }
    }
}

```
