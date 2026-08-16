from pydantic import BaseModel
class TokenPayload(BaseModel):
    """JWT Payload Schema"""
    sub: str
    role: str
    exp: int