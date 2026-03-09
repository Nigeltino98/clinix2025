AUTH_USER_MODEL = 'management.User'
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth import get_user_model
User = get_user_model()

try:
	user = User.objects.get(email='nickysibanda20@gmail.com')
	user.set_password('Nicky1988s')
	user.save()
except User.DoesNotExist:
	print('User not found')

# Replace 'username_here' and 'new_password_here' with actual values
#user = User.objects.get(username='leonmurahwa20@gmail.com')
#user.password = make_password('LeoTM2004')
#user.save()

