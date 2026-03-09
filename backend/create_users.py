
import django
from django.contrib.auth import get_user_model
User = get_user_model
AUTH_USER_MODEL = get_user_model
from management.models import User
from django.conf import settings
from django.contrib.auth.hashers import make_password 
# Set up Django environment
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import the User model from Django's auth module


def create_users():
    # List of user data (username, email, password)
    users_data = [
        ('Adama', 'Jammeh', 'adxma@outlook.com', 'Anna Duffie', 'Male','10 Kestrel Cl,Horsham,RH12 5WD',
		'PH239897B','2001-10-31', 'Black','', 'Single','','British','Christianity','','Senior Support Worker', 'Adama01Sea'),
		
        ('Brenda','Nangonzi', 'enidbrenda600@gmail.com', 'Milcah Walusimbi', 'Female','Flat 31 Flenninng Court,Mitchan,CR44ER',
		'TL226575D','1979-08-08', 'Black','','Single','07522637530', 'Ugandan', 'Christianity','2021-10-25','Management', 'Nango79Cole'),
		
        ('Brendon', 'Madziwa', 'brendonmadziwa07@gmail.com', 'Ellenah Murahwa','Male', '1 Rose Farm Cottage,Horsham,RH12 4SE',
		'00000', '1997-10-17', 'Black', '', 'Single', '7721094745', 'Zimbabwean', 'Christianity','2023-05-31', 'Senior Support Worker', 'BreCole24'),
	   # Add more users as needed
    ]

    # Create users based on the data
    for first_name, last_name, email, next_of_kin, gender, address, NI_number, dob, ethnic_origin, location, marital_status, mobile, nationality,religion, start_date, category, password in users_data:
        if not User.objects.filter(email=email).exists():
            user = User.objects.create_user(
                first_name= first_name, last_name= last_name, email=email, next_of_kin =next_of_kin, gender=gender, address=address, NI_number=NI_number, dob=dob, ethnic_origin=ethnic_origin, location=location,
				marital_status=marital_status, mobile=mobile, nationality=nationality, religion=religion, start_date=start_date, category=category,
                password=password
            )
            print(f'User {first_name} created successfully.')
        else:
            print(f'User {first_name} already exists.')

if __name__ == '__main__':
    create_users()

