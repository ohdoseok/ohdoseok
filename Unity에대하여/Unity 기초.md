## Unity 기초

### 스크립트 작성

public GameObject go;
go = GameObject.Find("오브젝트이름");
go.GetComponent<Transform>().Translate(동일);
this.transform.Translate(Vector3.forward _ 3.0f _ Time.deltaTime); -> deltaTime은 시간의 싱크로율을 맞춰줌, 어떤 컴퓨터에서도 동일한 만큼

Input.GetKey(keyCode.upArrow) -> 위로키가 눌리면
this.transform.Translate(x , y , z); x->좌우 z->앞뒤

public Animator animator;
animator = GetComponent<Animator>();
animator.Play("애니메이션이름",-1,0); -> -1은 해당레이어, 0은 시간차없애줌

드래그해서 object에 넣어줌

Input.GetAxis("Horizontal"); 현재 해당 정보를 가져옴(-1~1)
Input.GetAxis("Vertical");

animator.SetFloat("h",h);
animator.SetFloat("v",v);

Blend Tree는 여러개의 변수를 효율적으로 관리해줌(상,하,좌,우)

public Rigidbody rigidbody;
rigidbody = GetComponent<Rigidbody>();
rigidbody.velocity = new Vector3(x,y,z);

GameObject child = GameObject.Find("Cube") as GameObject;
child.transform.parent = this.transform;

this.transform.Rotate(0, -3f \* Time.deltaTime, 0); y 축기준으로 돌기

### 애니메이션 컨트롤러

create -> animator controller
object선택후 오른쪽 animaotr 선택해줌
Entry(시작) ->

### capsule collider(캡슐형태의 충돌감지)

OnCollisionEnter충돌 발생
collision.collider.tag == "Cube" 충돌이 큐브라면~
OnCollisionStay충돌 유지
OnCollisionExit충돌 끝날때

---

### 충돌시 특정 text 생성

```
if (collision.collider.tag == "NPC")
        {
            Epush.SetActive(true);



            if (Input.GetKey(KeyCode.E))
            {
                GameObject canvas = GameObject.FindWithTag("Canvas");
                if (canvas == null)
                {
                    return;
                }
                Transform tf = canvas.transform;
                GameObject panel = tf.Find("Panel").gameObject;
                if (panel == null)
                {
                    return;
                }
                panel.SetActive(true);


            }


        }
```

### 모든 스크립트를 다눌렀을 때 다음 npc로 이동하기위한 표시 생성

```
{
            GameObject canvas = GameObject.FindWithTag("Canvas");
            if (canvas == null)
            {
                return;
            }
            Transform tf = canvas.transform;
            GameObject panel = tf.Find("Panel").gameObject;
            if (panel == null)
            {
                return;
            }

            if (panel.activeSelf == true && Input.GetKeyDown(KeyCode.P))
            {
                chat[0] += 1;
            }
        }
```
