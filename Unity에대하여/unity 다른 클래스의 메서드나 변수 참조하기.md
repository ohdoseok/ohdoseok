## unity 다른 클래스의 메서드나 변수 참조하기

```
public 참조할클래스 onbridge;
```

start나 awake에서 초기화

```
fo = FindObjectOfType<BridgeFO>();
```

메서드 사용

```
fo.~();
```
