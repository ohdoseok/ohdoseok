int trigPin1 = 11;
int echoPin1 = 10;
int trigPin2 = 9;
int echoPin2 = 8;

//변수를 설정합니다. 
long duration1, distance1;
long duration2, distance2;

void setup() {
  pinMode(trigPin1, OUTPUT); // trigPin을 출력으로 
  pinMode(echoPin1, INPUT); // echoPin을 입력이다.
  pinMode(trigPin2, OUTPUT); // trigPin을 출력으로 
  pinMode(echoPin2, INPUT); // echoPin을 입력이다.
  Serial.begin(9600); // 시리얼 포트를 시작합니다.
}

void loop() {
  digitalWrite(trigPin1, LOW); //초음파 센서를 초기화 하는 과정입니다.
  delayMicroseconds(2);
  digitalWrite(trigPin1, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin1, LOW);
  duration1 = pulseIn(echoPin1, HIGH); // 트리거 핀에서 나온 펄스를 받아서 
  distance1= duration1*0.034/2; // 거리를 측정합니다. 

  if (distance1 >= 500 || distance1 <= 0){ //500보다 크거나, 0보다 작으면 측정이 불가하다는 것을 프린트합니다.
    Serial.println("Out of range"); //측정 불가 라는 것을 프린트 합니다. 
  }
  else {
    Serial.print ( "Sensor1 : "); //센서 1에
    Serial.println ( distance1);// 거리 값
//    Serial.println("cm"); // cm를 출력합니다.
  }
  delay(1000); //2초마다 , 그리고 아래의 과정은 모두 동일합니다. 

  digitalWrite(trigPin2, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin2, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin2, LOW);
  duration2 = pulseIn(echoPin2, HIGH);
  distance2= duration2*0.034/2;

  if (distance2 >= 500 || distance2 <= 0){
    Serial.println("Out of range");
  }
  else {
    Serial.print("Sensor2 : ");
    Serial.println(distance2);
  }

  delay(1000);


}
