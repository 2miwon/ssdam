## Getting Started


### create .env file
ssdam/backend/src/.env
```
DB_DEV_URL="mongodb://host.docker.internal:27017"

DB_DEV_NAME="ssdam"


OPENAI_API_KEY="your-api-key"

JWT_SECRET_KEY="secret-key"
JWT_ACCESS_TOKEN_EXPIRE_SECONDS=3600
JWT_ALGORITHM = "HS256"


GOOGLE_CLIENT_ID = "google-client-id"
GOOGLE_SECRET_KEY = "google-secret-key"
GOOGLE_REDIRECT_URL = "google-redirect-url"

GOOGLE_SCOPE_PROFILE = "https://www.googleapis.com/auth/userinfo.profile"
GOOGLE_SCOPE_EMAIL = "https://www.googleapis.com/auth/userinfo.email"

NAVER_CLIENT_ID = "naver-cliend-id"
NAVER_SECRET_KEY = "naver-secret-key"
NAVER_REDIRECT_URL = "naver-redirect-url"
```

ssdam/frontend/src/.env
```
VUE_APP_MEASUREMENT_ID="your-measurement-id"
VUE_APP_DEFAULT_COVER_IMAGE="your-default-cover-image"
VUE_APP_API_HOST="http://localhost:8000"
```

### docker-compose up 
```
docker-compose -f docker-compose-dev.yml up --build
```