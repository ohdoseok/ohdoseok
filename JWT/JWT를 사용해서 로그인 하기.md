## JWT를 사용해서 로그인 하기

기본적으로 모든 request는 spring context의 dispatcher servlet을 통해서 들어온 request가 handler mapping으로 들어가고 handler mapping은 컨트롤러를 지정해준다. 각각의 컨트롤러로 request가 전달되는데 컨트롤러로 request가 전달되기 전에 작동하는 것이 interceptor이다.
이런 interceptor를 이용해서 request의 header에 jwt의 유무를 확인하고 있다면 토큰을 분석해서 토큰이 담고있는 내용으로 로그인 시키는 역할이 가능하다.

```
@Component
public class JwtTokenProvider {
    private String secretKey;
    private long validityInMilliseconds;

    public JwtTokenProvider(@Value("${security.jwt.token.secret-key}") String secretKey, @Value("${security.jwt.token.expire-length}") long validityInMilliseconds) {
        this.secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
        this.validityInMilliseconds = validityInMilliseconds;
    }

    //토큰생성
    public String createToken(String subject) {
        Claims claims = Jwts.claims().setSubject(subject);

        Date now = new Date();

        Date validity = new Date(now.getTime()
                + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    //토큰에서 값 추출
    public String getSubject(String token) {
        System.out.println("이메일들어감");
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }

    //유효한 토큰인지 확인
    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            if (claims.getBody().getExpiration().before(new Date())) {
                return false;
            }
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

```
@Component
public class AuthorizationExtractor {
    public static final String AUTHORIZATION = "Authorization";
    public static final String ACCESS_TOKEN_TYPE = AuthorizationExtractor.class.getSimpleName() + ".ACCESS_TOKEN_TYPE";

    public String extract(HttpServletRequest request, String type) {
        Enumeration<String> headers = request.getHeaders(AUTHORIZATION);
        System.out.println("Headers " + headers);
        while (headers.hasMoreElements()) {
            String value = headers.nextElement();
            if (value.toLowerCase().startsWith(type.toLowerCase())) {
                System.out.println(value.substring(type.length()).trim());
                return value.substring(type.length()).trim(); // 토큰
            }
        }

        return Strings.EMPTY;
    }
}
```

인터셉터를 사용해서 request에 jwt가 존재하는지 확인
preHandle 은 컨트롤러가 호출되기 전에 실행된다.

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
        String token = authExtractor.extract(request, "Bearer");//request 에 Bearer이 존재하는지 확인
        if (StringUtils.hasLength(token)) {//존재한다면
            System.out.println("성공");
        }

        if (!jwtTokenProvider.validateToken(token)) {//만료가 된건지 확인
            throw new IllegalArgumentException("유효하지 않은 토큰");
        }

        String email = jwtTokenProvider.getSubject(token);
        System.out.println("email : " + email);
        request.setAttribute("email", email);//토큰에서 나온값을 request에 추가해주고
        return true;
    }
}
```
