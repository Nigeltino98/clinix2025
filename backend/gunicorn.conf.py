
# Bind Gunicorn to all interfaces on port 8000
bind = "0.0.0.0:8000"


# Number of workers
workers = 2


# Worker type
worker_class = "sync"


# Timeout for a worker handling a request
timeout = 120


# Time allowed for graceful shutdown
graceful_timeout = 30


# Keep-alive connections
keepalive = 5


# Restart workers periodically
max_requests = 1000


# Random variation prevents all workers restarting together
max_requests_jitter = 100


# Logging
accesslog = "-"


errorlog = "-"


# Log level
loglevel = "info"


# Capture stdout/stderr
capture_output = True
