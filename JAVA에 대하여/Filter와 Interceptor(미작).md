## 필터란?
필터는 **디스패처 서블릿에 요청이 전달되기 전/후에 url패턴에 맞는 모든 요청에 대해 부가작업을 처리할 수 있는 기능을 제공한다.**
*디스패처 서블릿은 스프링의 가장 앞단에 존재하는 프론트 컨트롤러이므로, 필터는 스프링 범위 밖에서 처리가 되는 것이다.*
즉, 스프링 컨테이너가 아닌 **톰캣과 같은 웹 컨테이너에 의해 관리가 되는것** 이고 디스패처 서블릿 전/후에 처리하는 것이다.
![img](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbZQx9K%2Fbtq9zEBsJ75%2FdEAKj1HEymcKyZGZNOiA80%2Fimg.png)

### 필터의 메소드
* init 메소드
* doFilter 메소드
* destroy 메소드

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