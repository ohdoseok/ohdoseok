import datetime

import cv2
frame=cv2.resize
import cvzone
import mediapipe
import firebase_admin
from cvzone.SelfiSegmentationModule import SelfiSegmentation
from firebase_admin import storage
from uuid import uuid4
from firebase_admin import credentials


seg=SelfiSegmentation()
img=cv2.imread("image/img.png")
img=cv2.resize(img,(1240,640))

cap=cv2.VideoCapture(0)

cnt = 1

PROJECT_ID = "my-buddy-359c8"


cred = credentials.Certificate("SDK/my-buddy-359c8-firebase-adminsdk-9vyrm-60b4fbbdf5.json")
default_app = firebase_admin.initialize_app(cred, {
    #gs://smart-mirror-cf119.appspot.com
    'storageBucket': f"{PROJECT_ID}.appspot.com"
})

bucket = storage.bucket()
def fileUpload(file):
    blob = bucket.blob('captureImages/'+file)
    #new token and metadata 설정
    new_token = uuid4()
    metadata = {"firebaseStorageDownloadTokens": new_token} #access token이 필요하다.
    blob.metadata = metadata

    #upload file
    blob.upload_from_filename(filename='result/'+file, content_type='image/jpeg')
    print(blob.public_url)

while True:
    ret, frame=cap.read()
    frame=cv2.resize(frame,(1240,640))
    imgout=seg.removeBG(frame,img)

    frame=cv2.imshow("FRAME",imgout)
    if cv2.waitKey(1)&0xFF == ord('s'):
        print("Screenshot saved...")
        filename = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")+'screenshot{}.jpg'
        cv2.imwrite('result/'+filename.format(cnt), imgout, params=[cv2.IMWRITE_PNG_COMPRESSION, 0])
        fileUpload(filename.format(cnt))
        cnt += 1
    elif cv2.waitKey(1)&0xFF==27:
        cv2.imwrite("image/photo.jpg", frame)
        break



cap.release()
cv2.destroyAllWindows()