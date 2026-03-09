# your_app/pagination.py
from rest_framework.pagination import PageNumberPagination

class NotePagination(PageNumberPagination):
    page_size = 10  # Number of notes per page
    page_size_query_param = 'page_size'  # Allow ?page_size=20
    max_page_size = 100  # Prevent abuse of huge page sizes
