import serial
import time
import webbrowser
import requests
from urllib import parse


word = parse.quote('안녕 나는 단짝친구야!')
url = ('http://localhost:8000/tts?word='+word)

word2 = parse.quote('여기와봐')
url2 = ('http://localhost:8000/tts?word='+word2)
chrome_path = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe %s'

py_serial = serial.Serial(
    port='COM3',
    baudrate=9600,
)
while True:
    if py_serial.readable():
        response = py_serial.readline()
        allStr = response[:len(response) - 1].decode()
        check = allStr[0:7]

        if check == 'Sensor1' and int(float(allStr[-3:])) < int(20):
            # print(response[:len(response) - 1].decode())
            # print(int(float(allStr[-3:])))
            req = requests.get(url)
            is_ok = req.ok
            print(req)
            # webbrowser.get(chrome_path).open(url)
            break
        elif check == "Sensor1" and int(float(allStr[-3:])) > int(50) and int(float(allStr[-3:])) < int(200):
            req = requests.get(url2)
            break
        print(response[:len(response) - 1].decode())