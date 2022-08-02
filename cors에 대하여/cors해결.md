1. 예비요청에 대한 응답이 헤더에 제대로 들어가지않은 경우

```
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
```

filter를 사용해서 예비요청을 판단하고 헤더에 값을 세팅해서 response한다.

---

2. OPTIONS 리퀘스트를 보낼 때 토큰이 헤더의 Authorization으로 안 넘어가서 OPTION의 preflight일 경우 유효성 검사를 하지않고 넘어가도록 세팅

```
@Component
public class BearerAuthInterceptor implements HandlerInterceptor {
    private AuthorizationExtractor authExtractor;
    private JwtTokenProvider jwtTokenProvider;

    public BearerAuthInterceptor(AuthorizationExtractor authExtractor, JwtTokenProvider jwtTokenProvider) {
        this.authExtractor = authExtractor;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler) {


        // start
        // 브라우저가 options 메서드인 preflight 요청에 jwt엑세스 토큰을 담은 authorization헤더가 존재하지 않기 때문에
        // 유효성검사에서 에러 발생 -> 브라우저에 cors위반으로 인식 // 정식요청이아니라 preflight 요청일결우 유효성 검사로직을 타지않도록설정
        if (HttpMethod.OPTIONS.matches(request.getMethod())){
            return true;
        }
        // end


        System.out.println(">>> interceptor.preHandle 호출");
        String token = authExtractor.extract(request, "Bearer");
        if (StringUtils.hasLength(token)) {
            System.out.println("성공");
        }

        if (!jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("유효하지 않은 토큰");
        }

        String email = jwtTokenProvider.getSubject(token);
        System.out.println("email : " + email);
        request.setAttribute("email", email);
        return true;
    }
}
```
