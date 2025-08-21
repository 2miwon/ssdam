import motor.motor_asyncio
from src.config import settings
import certifi

ca = certifi.where()

client_args = {
    'uuidRepresentation': 'standard',
}

if settings.ENV == 'prod':
    client_args['tlsCAFILE'] = ca

DATABASE_URL = settings.DB_URL
DB_NAME = settings.DB_NAME
client = motor.motor_asyncio.AsyncIOMotorClient(
    DATABASE_URL, **client_args
)
db = client[DB_NAME]
