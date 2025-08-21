from fastapi import Depends
from src.accounts.models import User
from src.accounts.schemas import UpdateUserInput
from src.accounts.repository import UserRepository


class AccountsService:
    def __init__(self, user_repository: UserRepository = Depends(UserRepository)):
        self.user_repository = user_repository

    def update(self, user: User, update_user_input: UpdateUserInput):
        user.update_by_request(update_user_input)
        return self.user_repository.update_user(user)

    def delete(self):
        pass
