
import django
from django.contrib.auth import get_user_model
from django.conf import settings




# Set up Django environment
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import the User model
User = get_user_model()

def create_users():
    # List of user data (first_name, last_name, email, next_of_kin, gender, address, NI_number, dob, ethnic_origin, location, marital_status, mobile, nationality, religion, start_date, category, password)
    users_data = [
       
       

      ('Malcom','Choga','chogamalcom@gmail.com','Editor Chiyangwa','Male','17 Hayes Barton','TJ950882C','2003-11-17','Black','Pinewood','Single','7526030147','Zimbabwean','Christianity','2024-07-15','Support Worker','MCJ95')

        # Add more users as needed
    ]

    # Create users based on the data
    for first_name, last_name, email, next_of_kin, gender, address, NI_number, dob, ethnic_origin, location, marital_status, mobile, nationality, religion, start_date, category, password in users_data:
        if not User.objects.filter(email=email).exists():
            user = User.objects.create_user(
                first_name=first_name, 
                last_name=last_name, 
                email=email, 
                next_of_kin=next_of_kin, 
                gender=gender, 
                address=address, 
                NI_number=NI_number, 
                dob=dob, 
                ethnic_origin=ethnic_origin, 
                location=location, 
                marital_status=marital_status, 
                mobile=mobile, 
                nationality=nationality, 
                religion=religion, 
                start_date=start_date, 
                category=category, 
                password=password
                
            )
            
            print(f'User {first_name} created successfully.')
            
        else:
            print(f'User {first_name} already exists.')

if __name__ == '__main__':
    create_users()

