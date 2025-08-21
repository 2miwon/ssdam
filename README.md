📚 쓰담 (Ssdam) - AI 기반 글쓰기 도우미

책 집필부터 출간까지, AI와 함께하는 완전한 글쓰기 플랫폼

쓰담은 작가들의 창작 여정을 지원하는 종합 글쓰기 플랫폼입니다. AI 기술을 활용해 주제 발굴부터 교정·교열, 온라인 출간까지 원스톱으로 지원합니다.
✨ 주요 기능

📝 AI 교정·교열: 맞춤법, 띄어쓰기, 문법, 문장 구조를 자동으로 개선
💡 주제 추천: AI가 제안하는 창의적인 글쓰기 아이디어
📖 온라인 출간: 작성한 책을 바로 온라인으로 출간
🎨 직관적인 에디터: 사용하기 쉬운 글쓰기 환경
📊 진행상황 관리: 챕터별 작성 진도 추적

# Quick Start
```
# using Makefile

make backend-setup: backend 환경 설정
make backend-run: backend 실행
make backend-docker: backend docker 환경에서 실행
make backend-docker-down: backend docker 환경 종료

make frontend-setup: frontend 환경 설정
make frontend-run: frontend 실행
```

# 1. Environment Setting
## backend 환경 설정
backend/src/.env 파일을 생성하고 다음 내용을 입력하세요:
```
env# 데이터베이스 설정
DB_DEV_URL="mongodb://host.docker.internal:27017"
DB_DEV_NAME="ssdam"

# AI API 설정
OPENAI_API_KEY="your-openai-api-key-here"

# JWT 보안 설정
JWT_SECRET_KEY="your-secret-key-here"
JWT_ACCESS_TOKEN_EXPIRE_SECONDS=3600
JWT_ALGORITHM="HS256"

# Google 소셜 로그인
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_SECRET_KEY="your-google-secret-key"
GOOGLE_REDIRECT_URL="your-google-redirect-url"
GOOGLE_SCOPE_PROFILE="https://www.googleapis.com/auth/userinfo.profile"
GOOGLE_SCOPE_EMAIL="https://www.googleapis.com/auth/userinfo.email"

# 네이버 소셜 로그인
NAVER_CLIENT_ID="your-naver-client-id"
NAVER_SECRET_KEY="your-naver-secret-key"
NAVER_REDIRECT_URL="your-naver-redirect-url"
```
## frontend 환경 설정
frontend/.env 파일을 생성하고 다음 내용을 입력하세요:
```
envVUE_APP_MEASUREMENT_ID="your-google-analytics-id"
VUE_APP_DEFAULT_COVER_IMAGE="your-default-book-cover-url"
VUE_APP_API_HOST="http://localhost:8000"
```

# 2. Run Application
프로젝트 루트 디렉토리에서 다음 명령어를 실행하세요:
docker-compose -f docker-compose-dev.yml up --build
실행이 완료되면:

프론트엔드: http://localhost:3000
백엔드 API: http://localhost:8001
API 문서: http://localhost:8001/docs

## frontend
```
cd frontend
npm install
npm run serve  # 개발 서버 실행
```
## backend
```
cd backend

# 가상환경 생성 및 활성화
python -m venv ssdam_env
source ssdam_env/bin/activate  # Windows: ssdam_env\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 개발 서버 실행
uvicorn main:app --reload
```

# 3. Project Structure
```
ssdam/
├── frontend/           # Vue.js 프론트엔드
│   ├── src/
│   │   ├── components/ # UI 컴포넌트
│   │   ├── views/      # 페이지 뷰
│   │   └── store/      # Vuex 상태 관리
│   └── public/
├── backend/            # FastAPI 백엔드
│   ├── src/
│   │   ├── auth/       # 인증 관련
│   │   ├── revision/   # AI 교정 기능
│   │   ├── prompts/    # AI 프롬프트
│   │   └── models/     # 데이터 모델
│   └── requirements.txt
└── docker-compose-dev.yml
```

# 4. Technical Stack
## frontend
Vue.js 3: 모던 웹 프레임워크
Vuex: 상태 관리
Vue Router: 라우팅
EditorJS: 리치 텍스트 에디터

## backend
FastAPI: 고성능 Python 웹 프레임워크
MongoDB: NoSQL 데이터베이스
OpenAI API: AI 교정·교열 서비스
JWT: 사용자 인증

## Database
MongoDB: 데이터베이스

# 5. Contribute

이 저장소를 포크하세요
기능 브랜치를 생성하세요 (git checkout -b feature/amazing-feature)
변경사항을 커밋하세요 (git commit -m 'Add amazing feature')
브랜치에 푸시하세요 (git push origin feature/amazing-feature)
Pull Request를 생성하세요

# 6. Troubleshooting
## 자주 발생하는 문제
### Docker 컨테이너가 실행되지 않는 경우
```
docker-compose down
docker system prune -f
```

다시 빌드 후 실행
docker-compose -f docker-compose-dev.yml up --build --force-recreate
### MongoDB 연결 오류

Docker Desktop이 실행 중인지 확인
.env 파일의 데이터베이스 URL이 올바른지 확인

### OpenAI API 오류

API 키가 유효한지 확인
API 사용량 한도를 확인

# 7. License
이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.
## 📞 Support

🐛 버그 리포트: GitHub Issues
💡 기능 요청: GitHub Discussions
📧 이메일: zhengsfsf@gmail.com