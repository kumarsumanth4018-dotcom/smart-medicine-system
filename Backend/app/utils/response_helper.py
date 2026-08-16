from fastapi.responses import JSONResponse


def success_response(message: str, data=None, status_code: int = 200):
    """
    Returns a standard success response.
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data
        }
    )


def error_response(message: str, status_code: int = 400):
    """
    Returns a standard error response.
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": None
        }
    )