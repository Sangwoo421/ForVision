from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import cv2
import numpy as np
from ultralytics import YOLO
import requests  # requests 모듈 추가

app = FastAPI()

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처를 허용하려면 ["*"]
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드를 허용
    allow_headers=["*"],  # 모든 HTTP 헤더를 허용
)

def spoil(image):
    model = YOLO(r'Spoilage_Detection_AI\best.pt')  # SDA 모델 경로
    results = model(image)
    annotated_frame = results[0].plot()
    
    spoil_names = [results[0].names[int(box.cls)] for box in results[0].boxes]  # 모든 검출된 객체의 클래스 이름
    
    return annotated_frame, spoil_names

def food_detection(image):
    model = YOLO(r'Food_Detection_AI\FDAprotoType.pt')  # FDA 모델 경로
    results = model(image)
    annotated_frame = results[0].plot()
    
    food_names = [results[0].names[int(box.cls)] for box in results[0].boxes]  # 모든 검출된 객체의 클래스 이름
    
    return annotated_frame, food_names

def saves(img, name):
    cv2.imwrite(name, img)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    result_path = 'output_images.jpg'
    
    # 음식 객체 검출
    processed_image, food_names = food_detection(image)
    saves(processed_image, result_path)
    
    # 상함 여부 검출
    processed_image, spoil_names = spoil(processed_image)
    saves(processed_image, result_path)
    
    # 실제 결과 데이터
    result_data = {
        "foodNames": food_names,
        "spoilNames": spoil_names
    }

    # 결과값을 외부 서버로 전송 (SSL 인증서 검증 비활성화)
    #response = requests.post('https://220.69.241.62:8080/result', json=result_data, verify=False)
    response = requests.post('https://192.168.0.115:3005/result', json=result_data, verify=False)

    # 서버 응답 확인
    if response.status_code == 200:
        return JSONResponse(content={"message": "Data successfully sent", "status_code": response.status_code})
    else:
        return JSONResponse(content={"message": "Failed to send data", "status_code": response.status_code})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8082)
