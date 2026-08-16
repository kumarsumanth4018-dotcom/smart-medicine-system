import logging
import os

# Create logs folder automatically if it doesn't exist
os.makedirs("logs", exist_ok=True)

# Create logger
logger = logging.getLogger("smart_medicine_system")

# Configure logger only once
if not logger.handlers:

    # Set log level
    logger.setLevel(logging.INFO)

    # Log format
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(message)s"
    )

    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)

    # File Handler
    file_handler = logging.FileHandler(
        "logs/app.log",
        encoding="utf-8"
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)

    # Add handlers
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)


# Test Logger
if __name__ == "__main__":
    logger.info("Logger Test - INFO")
    logger.warning("Logger Test - WARNING")
    logger.error("Logger Test - ERROR")

    print("Logger tested successfully!")