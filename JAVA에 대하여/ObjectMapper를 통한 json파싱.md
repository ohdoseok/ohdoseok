json 관련 라이브러리
ObjectMapper

---
gradle이나 maven을 사용하지 않는 옛날에는 직접 lib폴더에 jar파일을 추가해줘야 했음
하지만 gradle이나 maven을 사용하면서 간단하게  dependency추가하는 것 만으로도 라이브러리를 사용할수있다.

---
objectMapper.writevalueasstring(string)하면 string을 json객체로 만들어준다.

JsonNode jsonNode = objectMapper.readTree(String객체);
jsonNode.get("key").asText(); or asInt(); 하면 key에 맞는 value를 가져온다.

그렇다면 배열로 이루어진 json은?
똑같이 jsonNode.get("배열key")로 받고
(ArrayNode) 객체로 변환;
objectMapper.convertValue(변환된 객체, new TypeReference<List<객체>>(){});

그렇다면 json에서 변경하고 싶은 부분이 있다면?
ObjectNode objectNode = (ObjectNode) jsonNode;
objectNode.put("key","value")로 변경
---
jsonvalidator사이트를 이용하면 깔끔하게 보여줌

---
snake-case여야한다.
@JsonProperty("snake_case") 이런식으로 변경해준다.

---
