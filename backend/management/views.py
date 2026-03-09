from django.http import Http404
from rest_framework import generics, authentication, permissions, viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.views.decorators.http import require_http_methods
from django.contrib.auth import get_user_model
from .models import *
from .serializers import *
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ViewSet
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import Permission, Group
from rest_framework import filters
from django.contrib.auth.decorators import login_required, permission_required
# API view for django.contrib.auth.models.User
from django.views.decorators.cache import cache_control
from django.db import models
from .pagination import NotePagination
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import PlanEvaluation
from .serializers import PlanEvaluationSerializer
from .models import SupportPlan
from django.conf import settings
from django.utils.dateparse import parse_date
from django.utils.timezone import make_aware
from datetime import datetime, time


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system"""

    serializer_class = UserSerializer


class CreateTokenView(ObtainAuthToken):
    """Create a new auth token"""

    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES


class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """

    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(
                serializer.data.get("old_password")
            ):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                "status": "success",
                "code": status.HTTP_200_OK,
                "message": "Password updated successfully",
                "data": [],
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""

    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Retrieve and return the authenticated user"""
        return self.request.user


class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        user = self.request.user
        if self.request.user.is_staff:
            queryset = Reminder.objects.all()
        else:
            queryset = Reminder.objects.filter(staff=user)
        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
           serializer.save()
           return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class StaffViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        queryset = get_user_model().objects.all()

        gender = self.request.query_params.get('gender')

        if gender:
            queryset = queryset.filter(gender=gender)

        return queryset


class PermissionsViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionnsSerializer
    permission_classes = [permissions.DjangoModelPermissions]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.DjangoModelPermissions]


class ResidentDischargeViewSet(viewsets.ModelViewSet):
    queryset = ResidentDischarge.objects.all()
    serializer_class = ResidentDischargeSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident = instance.resident
            resident.is_discharged_status = True
            resident.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='dischargeList',
                details=f'Discharged a patient: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident = instance.resident
            resident.is_discharged_status = True
            resident.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='SelectedDischarge',
                details=f'Discharging: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class DailyCareViewSet(viewsets.ModelViewSet):
    queryset = DailyCare.objects.all()
    serializer_class = DailyCareSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        user = self.request.user
        if self.request.user.is_staff:
            queryset = DailyCare.objects.all()
        else:
            queryset = DailyCare.objects.filter(staff=user)
        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class AttachmentsViewSet(viewsets.ModelViewSet):
    serializer_class = AttachmentsSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        queryset = Attachments.objects.all()
        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='attachmentList',
                details=f' Added a new attachment:{instance.description}',
            )

            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='selectedAttachment',
                details=f'Edited the selected attachment: {instance.description}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class BodyMapViewSet(viewsets.ModelViewSet):
    serializer_class = BodyMapSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        queryset = BodyMap.objects.all()
        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class ResidentViewSet(viewsets.ModelViewSet):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer
    permission_classes = [permissions.DjangoModelPermissions]
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'national_id']

    # The syntax below allows for filtering based on homes
    def get_queryset(self):
        queryset = self.queryset

        home_id = self.request.query_params.get('home')
        if home_id:
            queryset = queryset.filter(home_id=home_id)

        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.validated_data['created_by'] = self.request.user
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='residentList',
                details=f'Added new resident: {instance.first_name} {instance.last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.validated_data['created_by'] = self.request.user
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='residentList',
                details=f'Edited resident: {instance.first_name} {instance.last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class PettyCashViewSet(viewsets.ModelViewSet):
    queryset = PettyCash.objects.all()
    serializer_class = PettyCashSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        user = self.request.user
        if self.request.user.is_staff:
            queryset = PettyCash.objects.all()
        else:
            queryset = PettyCash.objects.filter(staff=user)
        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='pettyList',
                details=f'Deposited in petty cash amount of: {instance.ammount} for {instance.resident_id}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='pettyList',
                details=f'Withdrew from petty cash amount of : {instance.ammount} for {instance.resident_id}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class FinanceViewSet(viewsets.ModelViewSet):
    queryset = Finance.objects.all()
    serializer_class = FinanceSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        queryset = Finance.objects.all()

        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='financeList',
                details=f'Deposited into resident cash amount of : {instance.amount} for {instance.resident_id}',
            )

            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='financeList',
                details=f'Transaction into resident cash, amount of : {instance.amount} for resident'
                        f' {instance.resident_id}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class SuggestionComplainsViewSet(viewsets.ModelViewSet):
    queryset = SuggestionComplains.objects.all().order_by('-created_on')
    serializer_class = SuggestionComplainsSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        queryset = super().get_queryset()
        home = self.request.query_params.get("home")
        resident = self.request.query_params.get("resident")

        if home:
            queryset = queryset.filter(resident__home_id=home)
        if resident:
            queryset = queryset.filter(resident__national_id=resident)

        return queryset.select_related("resident__home")  # 🔥 critical for performance

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='Accidents and Incidences',
                details=f'Recorded {instance.report_type} for: {instance.resident_id} ',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='Accident/Incidents',
                details=f'Recorded {instance.report_type} for: {instance.resident_id} ',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class RotaViewSet(viewsets.ModelViewSet):
    queryset = Rota.objects.all()
    serializer_class = RotaSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        user = self.request.user
        if self.request.user.is_staff:
            queryset = Rota.objects.all()
        else:
            queryset = Rota.objects.filter(staff=user)
        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class SupportPlanViewSet(viewsets.ModelViewSet):
    queryset = SupportPlan.objects.all()
    serializer_class = SupportPlanSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]


    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        return super().get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        print("DEBUG request.user:", self.request.user, self.request.user.is_authenticated)
        instance = serializer.save(created_by=self.request.user)

        # Save uploaded files
        files = self.request.FILES.getlist('files')
        for f in files:
            SupportPlanFile.objects.create(support_plan=instance, file=f)

        # Save user history
        UserHistory.objects.create(
            user=self.request.user,
            action='Support Plans',
            details=f'Recorded Support Plan for: {instance.resident_id}',
        )

    def perform_update(self, serializer):
        instance = serializer.save()

        # Save uploaded files
        files = self.request.FILES.getlist('files')
        for f in files:
            SupportPlanFile.objects.create(support_plan=instance, file=f)

        # Save user history
        UserHistory.objects.create(
            user=self.request.user,
            action='Support Plans',
            details=f'Updated Support Plan for: {instance.resident_id}',
        )


class PlanEvaluationViewSet(viewsets.ModelViewSet):
    queryset = PlanEvaluation.objects.all()
    serializer_class = PlanEvaluationSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        support_plan_id = self.kwargs.get('support_plan_id')
        if support_plan_id:
            return PlanEvaluation.objects.filter(support_plan_id=support_plan_id)
        return super().get_queryset()

    def perform_create(self, serializer):
        support_plan_id = self.kwargs.get('support_plan_id')
        if not support_plan_id:
            return Response({"detail": "Support plan ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            support_plan = SupportPlan.objects.get(id=support_plan_id)
        except SupportPlan.DoesNotExist:
            return Response({"detail": "Support plan not found."}, status=status.HTTP_404_NOT_FOUND)

        staff = self.request.user
        serializer.save(
            support_plan=support_plan,
            staff=staff,
            resident=support_plan.resident,
        )

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        # Set the created_by field to the current authenticated user
        serializer.save(created_by=self.request.user)
        appointment = serializer.save(created_by=self.request.user)

        # Access the newly created instance
        instance = serializer.instance
        name_first_name = instance.resident.first_name
        name_last_name = instance.resident.last_name


        # Log the action in UserHistory
        UserHistory.objects.create(
            user=self.request.user,
            action='appointmentList',
            details=f'Appointment for resident: {name_first_name} {name_last_name}',
        )

        recipient_email = appointment.notify_email
        if recipient_email:
            subject = 'New Appointment Notification'
            message = f"""
            A new appointment has been added, details are as below.
            
            📝 Title: {appointment.title}
            📋 Description: {appointment.description}
            ⏰ Start: {appointment.start_time}
            ⏰ End: {appointment.due_time}
            👤 Resident: {appointment.resident.first_name} {appointment.resident.last_name}
            
            Kind Regards,
            IT Support 
            """
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [recipient_email],
                fail_silently=False,
            )

    def perform_update(self, serializer):
        # Save the instance and perform the update
        serializer.save()

        # Access the updated instance
        instance = serializer.instance
        name_first_name = instance.resident.first_name
        name_last_name = instance.resident.last_name

        # Log the update action in UserHistory
        UserHistory.objects.create(
            user=self.request.user,
            action='appointmentList',
            details=f'Appointment for {name_first_name} {name_last_name}',
        )


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        user = self.request.user
        if self.request.user.is_staff:
            queryset = Task.objects.all()
        else:
            queryset = Task.objects.filter(staff=user)
        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class HomeViewSet(viewsets.ModelViewSet):
    queryset = Home.objects.all()
    serializer_class = HomeSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        queryset = Home.objects.all()
        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.DjangoModelPermissions]
    pagination_class = NotePagination

    def get_queryset(self):
        # Optimize query: select_related to reduce DB hits
        queryset = Note.objects.filter(is_deleted=False).select_related('resident', 'staff').order_by('-created_on')

        # Filter by resident
        resident_id = self.request.query_params.get('resident')
        if resident_id:
            queryset = queryset.filter(resident__national_id=resident_id)

        # Date range filters
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(created_on__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_on__date__lte=end_date)

        return queryset

    def list(self, request, *args, **kwargs):
        # Disable pagination for export
        if request.query_params.get('export') == 'true':
            serializer = self.get_serializer(self.get_queryset(), many=True)
            return Response(serializer.data)

        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='export')
    def export_notes(self, request):
        """
        Custom endpoint for exporting notes in a date range.
        Returns all matching notes without pagination.
        """
        queryset = self.get_queryset()

        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(created_on__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_on__date__lte=end_date)

        # Use the lean serializer for performance
        serializer = NoteExportSerializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='Daily Notes',
                details=f'Recorded {instance.subject} for: {instance.resident_id} as daily notes',
            )

            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='Daily Notes',
                details=f'Recorded {instance.subject} for: {instance.resident_id} as daily notes',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class WeightViewSet(viewsets.ModelViewSet):
    queryset = Weight.objects.all()
    serializer_class = WeightSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='weightList',
                details=f'Added weight for resident: {resident_first_name} {resident_last_name}',

            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='weightList',
                details=f' Edited weight for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class FluidIntakeViewSet(viewsets.ModelViewSet):
    queryset = FluidIntake.objects.all()
    serializer_class = FluidIntakeSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='fluidIntakeList',
                details=f'Added fluid information for resident: {resident_first_name} { resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='fluidIntakeList',
                details=f'Edited fluid information for resident: {instance.resident_id}',
            )


            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class SleepViewSet(viewsets.ModelViewSet):
    queryset = Sleep.objects.all()
    serializer_class = SleepSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='sleepList',
                details=f'Added sleep information for resident: {instance.resident_id}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='sleepList',
                details=f'Added sleep information for resident: {instance.resident_id}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class MentalStateViewSet(viewsets.ModelViewSet):
    queryset = MentalState.objects.all()
    serializer_class = MentalStateSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class MoodViewSet(viewsets.ModelViewSet):
    queryset = Mood.objects.all()
    serializer_class = MoodSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='moodList',
                details=f'Added mood information for resident: {resident_first_name}{resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='moodList',
                details=f'Added mood information for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class BathViewSet(viewsets.ModelViewSet):
    queryset = Bath.objects.all()
    serializer_class = BathSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class MorningRoutineViewSet(viewsets.ModelViewSet):
    queryset = MorningRoutine.objects.all()
    serializer_class = MorningRoutineSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='morningRoutineList',
                details=f'Added morning routine information for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class AfternoonRoutineViewSet(viewsets.ModelViewSet):
    queryset = AfternoonRoutine.objects.all()
    serializer_class = AfternoonRoutineSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='Added afternoon RoutineList',
                details=f'Added afternoon routine information for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='afternoon routine',
                details=f'Edited afternoon routine information for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='Assessments',
                details=f'Added assessment for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='Assessment',
                details=f'Added assessment for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='Evaluation',
                details=f'Added evaluation information for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='Evaluation',
                details=f'Edited evaluation information for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class ChoiceViewSet(viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class PosibleAnswerViewSet(viewsets.ModelViewSet):
    queryset = PosibleAnswer.objects.all()
    serializer_class = PosibleAnswerSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class AssignHomeUserViewset(viewsets.ModelViewSet):
    queryset = AssignHomeUser.objects.all()
    serializer_class = AssignHomeUser
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class RiskActionPlanViewSet(viewsets.ModelViewSet):

    serializer_class = RiskActionPlanSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        return RiskActionPlan.objects.filter(is_deleted=False)

    def perform_create(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='Risk Plan',
                details=f'Added Risk Plan for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()

            resident_first_name = instance.resident.first_name
            resident_last_name = instance.resident.last_name

            UserHistory.objects.create(
                user=self.request.user,
                action='Risk Plan',
                details=f'Edited Risk plan for resident: {resident_first_name} {resident_last_name}',
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class AtRiskOptionViewSet(viewsets.ModelViewSet):
    queryset = AtRiskOption.objects.all()
    serializer_class = AtRiskOptionSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class RiskSchedulerViewSet(viewsets.ModelViewSet):
    queryset = RiskScheduler.objects.all()
    serializer_class = RiskSchedulerSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class PlanSchedulerViewSet(viewsets.ModelViewSet):
    queryset = SupportScheduler.objects.all()
    serializer_class = SupportPlanSchedulerSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class AccidentSchedulerViewSet(viewsets.ModelViewSet):
    queryset = SuggestionComplainsScheduler.objects.all()
    serializer_class = AccidentPlanSchedulerSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class EvaluationSchedulerViewSet(viewsets.ModelViewSet):
    queryset = ReminderEvaluationScheduler.objects.all()
    serializer_class = EvaluationPlanSchedulerSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class Choices(viewsets.ViewSet):
    def list(self, request):
        data = JSONParser().parse(request)
        answer = PosibleAnswear.objects.get(id=data["answer"])
        comment = data["comment"]
        evaluation = Evaluation.objects.get(id=data["evaluation"])
        question = Question.objects.get(id=data["question"])
        try:
            choice = Choice.objects.get(
                comment=comment, question=question, evaluation=evaluation
            )
            choice.answer = answer
            choice.save()
        except Exception as e:
            Choice.objects.create(
                comment=comment,
                evaluation=evaluation,
                question=question,
                answer=answer,
            )
        queryset = Choice.objects.all()
        serializer = ChoiceSerializer(queryset, many=True)
        return Response(serializer.data)


class NextofKeenViewSet(viewsets.ViewSet):
    def list(self, request):
        data = JSONParser().parse(request)
        family = Family.objects.get(id=data["family"])
        resident = Resident.objects.get(national_id=data["resident"])
        try:
            nxtkin = NextofKeen.objects.get(resident=resident)
            nxtkin.family = family
            nxtkin.save()
        except Exception as e:
            NextofKeen.objects.create(
                family=family,
                resident=resident,
            )
        queryset = NextofKeen.objects.all()
        serializer = NextofKeenSerializer(queryset, many=True)
        return Response(serializer.data)



    from rest_framework import generics


class InventoryItemViewSet(viewsets.ModelViewSet):

    queryset = InventoryItem.objects.filter(is_deleted=False)
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        selected_resident = self.request.query_params.get('resident')
        selected_category = self.request.query_params.get('category')

        queryset = InventoryItem.objects.filter(resident_id=selected_resident)

        if selected_category:
            queryset = queryset.filter(category=selected_category)

        return queryset

    def perform_create(self, serializer):
        if self.request.user is not None:
            serializer.validated_data['created_by'] = self.request.user
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='inventoryList',
                details=f' Added new inventory item: {instance.item_name}'
            )

            return Response(status=status.HTTP_201_CREATED)
        return Response({"detail": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)

    def perform_update(self, serializer):
        if self.request.user is not None:
            serializer.validated_data['created_by'] = self.request.user
            instance = serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='inventoryList',
                details=f'Updated an inventory item: {instance.item_name}'
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response({"detail": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()

        UserHistory.objects.create(
            user=self.request.user,
            action='deleteInventoryItem',
            details=f'Deleted inventory item: {instance.item_name}'

        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()

        UserHistory.objects.create(
            user=self.request.user,
            action='deleteInventoryItem',
            details=f'Soft-deleted inventoryItem: {instance.item_name}'
        )

        return Response(status=status.HTTP_204_NO_CONTENT)


class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.DjangoModelPermissions]


class InventoryCategoryListView(generics.ListAPIView):
    serializer_class = InventoryItemSerializer

    def get_queryset(self):
        selected_resident = self.request.query_params.get('resident')
        selected_category = self.request.query_params.get('category')

        queryset = InventoryItem.objects.filter(resident_id=selected_resident, category=selected_category)
        return queryset


class InventoryItemDeleteViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.filter(is_deleted=False)
    serializer_class = InventoryItemDeleteSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_update(self, serializer):
        serializer.save(is_deleted=True)


class UserHistoryViewSet(viewsets.ModelViewSet):
    queryset = UserHistory.objects.all()
    serializer_class = UserHistorySerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get(self, request):
        user = request.user  # Get the currently logged-in user
        user_history = UserHistory.objects.filter(user=user)  # Fetch user history records
        serializer = UserHistorySerializer(user_history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteNonSuperusersViewSet(viewsets.ViewSet):
    def post(self, request, format=None):
        # Get a list of non-superusers
        non_superusers = get_user_model().objects.filter(is_superuser=False)

        # Delete non-superusers
        non_superusers.delete()

        return Response({"message": "Non-superusers deleted successfully."}, status=status.HTTP_200_OK)


class HouseAssetsViewSet(viewsets.ModelViewSet):
    queryset = HouseAssets.objects.all()
    serializer_class = HouseAssetsSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        queryset = HouseAssets.objects.all()
        if category:
            queryset = queryset.filter(category=category)

        sort_by = self.request.query_params.get('sort_by', 'date_of_acquisition')
        queryset = queryset.order_by(sort_by)

        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            name = serializer.validated_data.get('name', '')
            serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='assetList',
                details=f'Added an asset : {name}'
            )

            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            name = serializer.validated_data.get('name', '')
            serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='assetList',
                details=f'Deleted, the asset: {name}'
            )

            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class HandoverPaymentViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = HandoverPayment.objects.all()
        serializer = HandoverPaymentSerializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request):
        data = JSONParser().parse(request)
        email = data["email"]
        password = data["password"]
        amount = data["amount"]
        resident = data["resident"]
        resident = Resident.objects.get(national_id=resident)
        user = authenticate(request, username=email, password=password)
        if user is not None:
            if user != request.user:
                HandoverPayment.objects.create(
                    incoming=user,
                    outgoing=request.user,
                    resident=resident,
                    amount=amount,
                )
        queryset = HandoverPayment.objects.all()
        serializer = HandoverPaymentSerializer(queryset, many=True)
        return Response(serializer.data)


class HouseStockViewSet(viewsets.ModelViewSet):
    queryset = HouseStock.objects.all()
    serializer_class = HouseStockSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        queryset = HouseStock.objects.all()
        if category:
            queryset = queryset.filter(category=category)

        sort_by = self.request.query_params.get('sort_by', 'date_of_acquisition')
        queryset = queryset.order_by(sort_by)

        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            name = serializer.validated_data.get('name', '')
            serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='stockList',
                details=f'Added stock item: {name}'
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            name = serializer.validated_data.get('name', '')
            serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='stockList',
                details=f'Updated stock item: {name}'
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    @action(detail=True, methods=['delete'])
    def archive(self, request, pk):
        item = self.get_object(pk)
        item.is_deleted = True
        item.save()

        UserHistory.objects.create(
            user=self.request.user,
            action='stockList',
            details=f'Deleted stock item: {item.name}'
        )

        return Response({'status': 'Item archived'}, status=status.HTTP_200_OK)


class RepairRecordViewSet(viewsets.ModelViewSet):
    queryset = RepairRecord.objects.all()
    serializer_class = RepairRecordSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        asset_type = self.request.query_params.get('asset_type', None)
        queryset = RepairRecord.objects.all()
        if asset_type:
            queryset = queryset.filter(asset_type=asset_type)

        sort_by = self.request.query_params.get('sort_by', 'date_reported')
        queryset = queryset.order_by(sort_by)

        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            asset_name = serializer.validated_data.get('asset_name', '')
            serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='repairList',
                details=f' Added item for repair: {asset_name}'
            )
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            asset_name = serializer.validated_data.get('asset_name', '')
            serializer.save()

            UserHistory.objects.create(
                user=self.request.user,
                action='repairList',
                details=f' Deleted the repair item: {asset_name}'
            )

            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class DeletionRecordViewSet(viewsets.ModelViewSet):
    queryset = DeletionRecords.objects.all()
    serializer_class = DeletionRecordSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def perform_create(self, serializer):
        if serializer.is_valid():
            deleted_item_id = serializer.validated_data['deleted_item'].id
            reason_text = self.request.data.get('deletionReason')
            serializer.save(reason_text=reason_text, deleted_item_id=deleted_item_id)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class ConfidentialRecordViewSet(viewsets.ModelViewSet):
    queryset = ConfidentialRecord.objects.all()
    serializer_class = ConfidentialRecordSerializer
    permission_classes = [permissions.DjangoModelPermissions]


    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class AllowedLocationViewSet(viewsets.ModelViewSet):


    def get(self, request):
        locations = AllowedLocations.objects.all()
        serializer = AllowedLocationSerializer(locations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AllowedLocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllowedLocationDetailViewSet(viewsets.ModelViewSet):


    def get_object(self, pk):
        try:
            return AllowedLocations.objects.get(pk=pk)
        except AllowedLocations.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        location = self.get_object(pk)
        serializer = AllowedLocationSerializer(location)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        location = self.get_object(pk)
        serializer = AllowedLocationSerializer(location, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        location = self.get_object(pk)
        location.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def view_residents(request):
    user = request.user
    if user.is_staff:
        # Staff user can view all residents and all homes
        residents = Resident.objects.all()

    elif user.home:
       # Non-staff user assigned to a home can view only residents in that home
        residents = Resident.objects.filter(home=user.home)

    else:
        residents = []

    return request, {'residents': residents}

