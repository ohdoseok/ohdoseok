@ToString
@Setter
@Getter

---

*생성자관련   
@NoArgsConstructor
인자가 없음

@AllArgsConstructor
객체에 있는 모든 필드들을 인자로 받아서 생성

@RequiredArgsConstructor
필요한 인자만을 이용해서 생성자를 생성
require을 주지않으면 noargsconstructor와 동일하다.
@NonNull을 필드에 넣어주게 되면 필수값이 된다.

---

@EqualsAndHashCode란?

---

@Data
tostring, getter, setter, requiredargsconstructor, equalsandhashcode와 동일하다.

---

@Builder
allargsconstructor와 비슷하게 객체를 생성하고 필드값을 주입해주는데, builder의 형식으로

ex) User user = User.builder().name("justin").email("asdf@gmail.com").build();
