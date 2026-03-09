# Use Python 3.11 slim image
FROM python:3.11-slim

# Environment settings
ENV PYTHONUNBUFFERED 1
ENV DJANGO_ENV dev

# Install dependencies
RUN apt-get update --fix-missing && \
    apt-get -y upgrade && \
    apt-get install -y --no-install-recommends \
    # Add any additional system dependencies here, if needed \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY ./requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

# Set up directory structure
WORKDIR /usr/src/app
COPY . /usr/src/app

# Run migrations and start the Django development server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]

