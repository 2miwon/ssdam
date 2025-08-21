ENV ?= dev

.PHONY: venv backend-setup backend-run backend-docker backend-docker-down frontend-setup frontend-run

venv:
	cd backend && python3.12 -m venv .venv
	chmod +x backend/.venv/bin/activate

backend-setup: venv
	cd backend && .venv/bin/pip install --no-cache-dir --upgrade -r requirements.txt

backend-run:
	cd backend && .venv/bin/python -m uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload

backend-run-background:
	cd backend && nohup .venv/bin/python -m uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload &

backend-docker:
	docker-compose -f docker-compose-dev.yml up --build

backend-docker-down:
	cd backend && docker-compose -f docker-compose-dev.yml down

frontend-setup:
	cd frontend && npm install

frontend-run: frontend-setup
	cd frontend && npm run serve
