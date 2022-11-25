## @configuration과 @component

@Component

- 개발자가 직접 작성한 클래스를 bean 등록하고자 할 경우 사용

@Configuration + @Bean

- 외부라이브러 또는 내장 클래스를 bean으로 등록하고자 할 경우 사용.

- 1개 이상의 @Bean을 제공하는 클래스의 경우 반드시 @Configuraton을 명시

```
// @Configuration 사용 예제
@Configuration
public static class Config {

    @Bean
    public SimpleBean simpleBean() {
        return new SimpleBean();
    }

    @Bean
    public SimpleBeanConsumer simpleBeanConsumer() {
        return new SimpleBeanConsumer(simpleBean());
    }
}
```

```
// @Component 사용 예제
@Component
public static class Config {

    @Bean
    public SimpleBean simpleBean() {
        return new SimpleBean();
    }

    @Bean
    public SimpleBeanConsumer simpleBeanConsumer() {
        return new SimpleBeanConsumer(simpleBean());
    }
}
```

두 개는 다르다.
@Configuration은 기본적으로 @Bean 메소드의 내부에서 호출한 메소드가 @Bean 메소드일 경우 컨텍스트에 등록된 빈을 반환하도록 되어 있다.
@Component는 스프링컨텍스트에 등록되어 있는 빈이 반환되는 것이 아니라 새로 생성된 빈이 반환된다.

즉,

```
@Component
public static class Config {
    @Autowired
    SimpleBean simpleBean;

    @Bean
    public SimpleBean simpleBean() {
        return new SimpleBean();
    }

    @Bean
    public SimpleBeanConsumer simpleBeanConsumer() {
        return new SimpleBeanConsumer(simpleBean);
    }
}
```

@Autowired해줘야함
