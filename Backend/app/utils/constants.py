from enum import Enum
# User Roles
class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    PHARMACY = "PHARMACY"

# Pharmacy Status
class PharmacyStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    SUSPENDED = "SUSPENDED"
# User Status
class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    DELETED = "DELETED"

# Token Types
class TokenType(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    PHARMACY = "PHARMACY"

# OTP Configuration
OTP_LENGTH = 6
OTP_EXPIRY_MINUTES = 10
# Password Policy
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 32

# Pagination Defaults
DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 10
MAX_PAGE_SIZE = 3000