## Local
### setting python virtualenv

```angular2html
cd backend

pip install virtualenv

virtualenv ssdam_env --python=python3.9

source ssdam_env/bin/activate

pip install -r requirements.txt
```

### create .env file
ssdam/backend/.env
```angular2html
# DEV
DB_DEV_URL="mysql+pymysql://anam:1234@localhost:3306/ssdam"
OPENAI_API_KEY="your-api-key"
```

### uvicorn run
```angular2html
uvicorn main:app --reload
```

## Docker 
### docker build
```angular2html
docker build -t ssdam -f dockerfile.dev .
```

```angular2html
docker run -p 8000:8000 --name ssdam-server ssdam
```
