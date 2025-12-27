#!/bin/bash
# Entrypoint script for Railway deployment

# Use PORT from environment or default to 8000
PORT=${PORT:-8000}

echo "Starting Gunicorn on port $PORT"

# Run gunicorn
exec gunicorn --bind 0.0.0.0:$PORT --workers 3 pregnancy.wsgi:application
