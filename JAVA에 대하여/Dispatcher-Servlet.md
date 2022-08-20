## Dispatcher-Servlet이란?

dispatcher-servlet은 HTTP 프로토콜로 들어오는 모든 요청을 가장 먼저 받아 적합한 컨트롤러에 위임해주는 front-controller이다.
클라이언트로부터 어떠한 요청이 오면 Tomcat과 같은 서블릿 컨테이너가 요청을 받는다. 그리고 이 모든 요청을 프론트 컨트롤러인 디스패처 서블릿이 가장먼저 받게 된다.
그러면 디스패처 서블릿은 공통적인 작업을 먼저 처리한 후에 해당 요청을 처리해야 하는 컨트롤러를 찾아서 작업을 위임한다.

### Dispatcher-Servlet의 장점?

Spring MVC는 DispatcherServlet이 등장함에 따라 web.xml의 역할을 상당히 축소시켜주었다.
과거에는 모든 서블릿을 URL 매핑을 위해 web.xml에 모두 등록해야 했지만, dispatcher-servlet이 해당 어플리케이션으로 들어오는 모든 요청을 핸들링해주고 공통 작업을 처리하면서 상당히 편리해졌다.
이로써 우리는 컨트롤러를 구현하기만 하면 dispatcher-servlet이 적합한 컨트롤러로 위임을 해주는 구조가 되었다.

### 정적자원의 처리

dispatcher servlet이 모든 요청을 처리하다보니 이미지나 HTML/CSS/JavaScript 등과 같은 정적 파일에 대한 요청마저 모두 가로채는 바람에 정적자원을 불러오지 못하는 상황도 발생했다. 이러한 문제를 해결하기 위해 2가지 방법을 고안했다.

1. 정적 자원에 대한 요청과 어플리케이션에 대한 요청을 분리
2. 애플리케이션에 대한 요청을 탐색하고 없으면 정적 자원에 대한 요청으로 처리

#### 정적 자원에 대한 요청과 애플리케이션에 대한 요청을 분리

- /apps 의 URL로 접근하면 Dispatcher Servlet이 담당
- /resources 의 URL 로 접근하면 Dispatcher Servlet이 컨트롤 할 수 없으므로 담당하지 않는다.
  이러한 방식은 괜찮지만 코드가 지저분해지고 url을 붙여줘야 하므로 직관적인 설계가 될 수 없다.

#### 애플리케이션에 대한 요청을 탐색하고 없으면 정적 자원에 대한 요청으로 처리

dispatcher servlet이 요청을 처리할 컨트롤러를 먼저 찾고, 요청에 대한 컨트롤러를 찾을 수 없는 경우에, 2차적으로 설정된 자원(Resource) 경로를 탐색하여 자원을 탐색
이렇게 영역을 분리하면 효율적인 리소스 관리를 지원할 뿐 아니라 추후에 확장을 용이하게 해준다는 장점이 있다.

---

### Dispatcher-Servlet의 동작 과정

dispatcher servlet은 적합한 컨트롤러와 메소드를 찾아 요청을 위임해아 한다.
![img](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbImFbg%2FbtrGzZMTuu2%2FCkY4MiKvl5ivUJPoc5I3zk%2Fimg.png)

1. 클라이언트의 요청을 디스패처 서블릿이 받음
2. 요청 정보를 통해 요청을 위임할 컨트롤러를 찾음
3. 요청을 컨트롤럴로 위임할 핸들러 어댑터를 찾아서 전달함
4. 핸들러 어댑터가 컨트롤러로 요청을 위임함
5. 비지니스 로직을 처리함
6. 컨트롤러가 반환값을 반환함
7. HandlerAdapter가 반환값을 처리함
8. 서버의 응답을 클라이언트로 반환함