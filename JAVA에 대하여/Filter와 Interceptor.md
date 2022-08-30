## 필터란?

필터는 **디스패처 서블릿에 요청이 전달되기 전/후에 url패턴에 맞는 모든 요청에 대해 부가작업을 처리할 수 있는 기능을 제공한다.**
_디스패처 서블릿은 스프링의 가장 앞단에 존재하는 프론트 컨트롤러이므로, 필터는 스프링 범위 밖에서 처리가 되는 것이다._
즉, 스프링 컨테이너가 아닌 **톰캣과 같은 웹 컨테이너에 의해 관리가 되는것** 이고 디스패처 서블릿 전/후에 처리하는 것이다.
![img](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbZQx9K%2Fbtq9zEBsJ75%2FdEAKj1HEymcKyZGZNOiA80%2Fimg.png)

### 필터의 메소드

- init 메소드
- doFilter 메소드
- destroy 메소드

```
public interface Filter {

    public default void init(FilterConfig filterConfig) throws ServletException {}

    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException;

    public default void destroy() {}
}
출처: https://mangkyu.tistory.com/173 [MangKyu's Diary:티스토리]

```

#### init 메소드

init 메소드는 필터 객체를 초기화하고 서비스에 추가하기 위한 메소드이다.
웹컨테이너가 1회 init메소드를 호출하여 필터 객체를 초기화하면 이후의 요청들은 doFilter를 통해 처리된다.

#### doFilter 메소드

doFilter메소드는 url-pattern에 맞는 모든 HTTP 요청이 디스패처 서블릿으로 전달되기 전에 웹 컨테이너에 의해 실행되는 메소드이다. doFilter의 파라미터로는 FilterChain이 있는데, FilterChain의 doFilter 통해 다음 대상으로 요청을 전달하게 된다. chain.doFilter() 전/후에 우리가 필요한 처리 과정을 넣어줌으로써 원하는 처리를 진행할 수 있다.

#### destroy 메소드

destroy 메소드는 필터 객체를 서비스에서 제거하고 사용하는 자원을 반환하기 위한 메소드이다. 이는 웹 컨테이너에 의해 1번 호출되며 이후에는 이제 doFilter에 의해 처리되지 않는다.

---

## 인터셉터란?

![img](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FSz6DV%2Fbtq9zjRpUGv%2F68Fw4fZtDwaNCZiCFx57oK%2Fimg.png)

인터셉터는 **필터와 달리 spring이 제공하는 기술로써, 디스패처 서블릿이 컨트롤러를 호출하기 전과 후에 요청과 응답을 참조하거나 가공할 수 있는 기능**을 제공한다.

**필터는 웹 컨테이너에서 동작하고 인터셉터는 스프링 컨텍스트에서 동작한다.**

디스패처 서블릿은 핸들러 매핑을 통해 적절한 컨트롤러를 찾도록 요청하는데, 그 결과로 실행체인을 돌려준다. 이 실행 체인은 1개 이상의 인터셉터가 등록되어 있다면 순차적으로 인터셉터들을 거쳐 컨트롤러가 실행되도록 한다.

### 인터셉터의 메소드

- preHandle 메소드
- postHandle 메소드
- afterCompletion 메소드

```
public interface HandlerInterceptor {

    default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
        throws Exception {

        return true;
    }

    default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
        @Nullable ModelAndView modelAndView) throws Exception {
    }

    default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
        @Nullable Exception ex) throws Exception {
    }
}
```

#### perHandle 메소드

**preHandle 메소드는 컨트롤러가 호출되기 전에 실행된다.** 컨트롤러 이전에 처리해야 하는 전처리 작업이나 요청 정보를 가공하거나 추가하는 경우에 사용할 수 있다.
preHandle 의 handler 파라미터는 핸들러 매핑이 찾아준 컨트롤러 빈에 매핑되는 HandlerMethod라는 새로운 타입의 객체로써 @RequestMapping이 붙은 메소드의 정보를 추상화한 객체이다.
preHanlde의 반환타입은 boolean 인데 반환값이 true이면 다음 단계로 진행이 되지만, false라면 작업을 중단하여 이후의 작업(다음 인터셉터 또는 컨트롤러)은 진행되지 않는다.

#### postHandle 메소드

**postHandle 메소드는 컨트롤러를 호출된 후에 실행된다.** 그렇기 때문에 컨트롤러 이후에 처리해야 하는 후처리 작업이 있을 때 사용할 수 있다.
이 메소드에는 컨트롤러가 반환하는 ModelAndView 타입의 정보가 제공되는데ㅡ 최근에는 json형태로 데이터를 제공하는 restapi 기반의 컨트롤러(@RestController)를 만들면서 자주 사용되지는 않는다.

#### afterCompletion 메소드

모든 뷰에서 최종 결과를 생성하는 일을 포함해 모든 작업이 완료된 후에 실행된다. 요청 처리 중에 사용한 리소스를 반환할 때 사용하기 적합하다.

---

## 인터셉터와 AOP의 비교

Spring의 컨트롤러는 타입과 실행 메소드가 모두 제각각이라 포인트컷(적용할 메소드 선별)의 작성이 어렵다.
Spring의 컨트롤러는 파라미터나 리턴 값이 일정하지 않다.

다음과 같은 이유로 인터셉터를 사용

---

![img](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fcjsq60%2FbtrzjoZ0qcq%2FEDsLOVpZNcmFu6prkzALFk%2Fimg.png)


filter는 filterchain.dofilter(request, response); 로 request와 response를 조작가능하지만
interceptor는 return 값이 boolean이므로 다른 request,response 객체를 넘겨줄 수 없다.