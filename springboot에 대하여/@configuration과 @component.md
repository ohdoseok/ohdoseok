## @configuration과 @component

@Component

- 개발자가 직접 작성한 클래스를 bean 등록하고자 할 경우 사용

@Configuration + @Bean

- 외부라이브러 또는 내장 클래스를 bean으로 등록하고자 할 경우 사용.

- 1개 이상의 @Bean을 제공하는 클래스의 경우 반드시 @Configuraton을 명시
