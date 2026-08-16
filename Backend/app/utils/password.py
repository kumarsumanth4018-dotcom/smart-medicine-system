import bcrypt
def hash_password(password: str) -> str:
    """Convert a plain-text password into a secure bcrypt hash."""
    password_bytes = password.encode("utf-8")

    salt = bcrypt.gensalt()

    hashed_password = bcrypt.hashpw(
        password_bytes,
        salt
    )

    return hashed_password.decode("utf-8")
def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
 
    """Verify a plain-text password against a stored bcrypt hash."""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )