from src.accounts.models import User


class UserRepository:
    def __init__(self):
        pass

    async def update_user(self, user: User):
        return await user.save()

