## config, filter, interceptor, jwt, utils, health check 설정

1. swagger사용을 위한 SwaggerConfig

```

@Configuration
@EnableSwagger2
public class SwaggerConfig {
//http://localhost:8090/api/swagger-ui/index.html
//https://j7d106.p.ssafy.io/api/swagger-ui/index.html
    @Bean
    public Docket api(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())     ->      Swagger API 문서에 대한 설명을 표기하는 메소드
                .groupName("drink")
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.ssafy.drink.controller"))        ->      Swagger API 문서로 만들기 원하는 BasePackage 경로
                .paths(PathSelectors.any())         ->      경로 필터링 any 라서 필터링x
                .build();
    }
    public ApiInfo apiInfo(){
        return new ApiInfoBuilder()
                .title("전통주 REST API")
                .version("0.01v")
                .description("전통주 BackEnd")
                .license("ssafy")
                .licenseUrl("https://www.ssafy.com/ksp/jsp/swp/etc/swpPrivacy.jsp")
                .build();
    }
}

```

2. WebConfig

- interceptor 등록을 위한 WebMvcConfigurer을 implemets한 class

```
@Configuration
public class WebConfig implements WebMvcConfigurer {


    public final AuthenticationInterceptor authenticationInterceptor;         ->        interceptor에 들어갈 내용을 prehandle등으로 만든 class 객체

    public WebConfig(AuthenticationInterceptor authenticationInterceptor){      ->      싱글톤
        this.authenticationInterceptor=authenticationInterceptor;
    }

    public void addInterceptors(InterceptorRegistry registry){
        ->      webmvcconfigurere에 default void addInterceptors(InterceptorRegistry registry) {}   메소드가 존재한다 override해서 사용
        System.out.println("인터셉터 등록");
        registry.addInterceptor(authenticationInterceptor)      ->      interceptor객체등록
                .excludePathPatterns("/member/signup/**")       ->      인터셉터에서 제외할 api요청
                .excludePathPatterns("/member/checkid/**")
                .excludePathPatterns("/member/login/**")
                .addPathPatterns("/member/**")
                .addPathPatterns("/review/**")
                .addPathPatterns("/feed/valid/**");
    }
}
```
