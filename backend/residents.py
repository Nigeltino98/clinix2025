
import django
from management.models import Resident
from django.conf import settings

# Set up Django environment
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def add_resident():
    # Define the details of the new resident
    resident_data = {
        'national_id': 'JN316507D',
        'first_name': 'Carl',
        'last_name': 'Taylor',
        'gender': 'Male',
	'date_of_birth': '1982-12-23',
	'room': '5',
	'phone_number': '07935033154',
	'email': '',
        'address': '17 Johnston Green Guildford Surrey GU29XS',
        'home': 'Johnstone',
	'height': '1.00',
	'NHS_number': '4320428307',
	'next_of_kin': 'Angela Dadson',
        
        # Add more fields as needed
    }

    # Create the new resident
    resident = Resident.objects.create(**resident_data)
    print('Resident added successfully.')

if __name__ == '__main__':
    add_resident()

