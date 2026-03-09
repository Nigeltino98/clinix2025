from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Permission, Group

from .models import *
from django.contrib.auth import (
    get_user_model,
    authenticate,
)


class PermissionnsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionnsSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object"""

    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionnsSerializer(many=True, read_only=True)

    def create(self, validated_data):
        groups_data = validated_data.pop("groups", [])  # Get groups data if available
        user = User.objects.create(**validated_data)
        user.groups.set(groups_data)  # Set the user's groups
        return user

    def update(self, instance, validated_data):
        groups_data = validated_data.pop("groups", [])  # Get groups data if available
        for group in groups_data:
            instance.groups.add(group)  # Add each group to the user
        return super().update(instance, validated_data)

    class Meta:
        model = get_user_model()
        exclude = ["password", "leave_date", "start_date", "last_login"]


class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user auth token"""

    email = serializers.EmailField()
    password = serializers.CharField(
        style={"input_type": "password"},
        trim_whitespace=False,
    )

    def validate(self, attrs):
        """Validate and authenticate the user"""
        email = attrs.get("email")
        password = attrs.get("password")
        user = authenticate(
            request=self.context.get("request"),
            username=email,
            password=password,
        )
        if not user:
            msg = _("Unable to authenticate with provided credentials")
            raise serializers.ValidationError(msg, code="authorization")

        attrs["user"] = user
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = "__all__"


class ResidentDischargeSerializer(serializers.ModelSerializer):
    discharged_by_first_name = serializers.CharField(source='discharged_by.first_name', read_only=True)
    discharged_by_last_name = serializers.CharField(source='discharged_by.last_name', read_only=True)
    name_first_name = serializers.CharField(source='resident.first_name', read_only=True)
    name_last_name = serializers.CharField(source='resident.last_name', read_only=True)

    class Meta:
        model = ResidentDischarge
        fields = "__all__"

    def get_created_by(self, obj):
        return {
                 'username': obj.discharged_by.username,
                 'name': obj.first_name,
              }


class DailyCareSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyCare
        fields = "__all__"


class AttachmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachments
        fields = "__all__"


class BodyMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyMap
        fields = "__all__"


class HandoverPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HandoverPayment
        fields = "__all__"


class HomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Home
        fields = ["id", "name", "address", "capacity"]

class ResidentSerializer(serializers.ModelSerializer):
    home = HomeSerializer(read_only=True)
    home_id = serializers.PrimaryKeyRelatedField(
        queryset=Home.objects.all(),
        source="home",
        write_only=True
    )

    class Meta:
        model = Resident
        fields = "__all__"


class PettyCashSerializer(serializers.ModelSerializer):
    class Meta:
        model = PettyCash
        fields = "__all__"


class FinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finance
        fields = "__all__"


class SuggestionComplainsSerializer(serializers.ModelSerializer):
    resident = ResidentSerializer(read_only=True)
    resident_id = serializers.PrimaryKeyRelatedField(
        queryset=Resident.objects.all(),
        source="resident",
        write_only=True
    )

    class Meta:
        model = SuggestionComplains
        fields = "__all__"

class RotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rota
        fields = "__all__"


class SupportPlanFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = SupportPlanFile
        fields = "__all__"

    def get_file_url(self, obj):
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url  # fallback relative URL


class SupportPlanSerializer(serializers.ModelSerializer):
    name_first = serializers.CharField(source='created_by.first_name', read_only=True)
    name_last = serializers.CharField(source='created_by.last_name', read_only=True)
    firstname = serializers.CharField(source='resident.first_name', read_only=True)
    lastname = serializers.CharField(source='resident.last_name', read_only=True)
    next_assement_date = serializers.DateTimeField()

    attachment = SupportPlanFileSerializer(source='supportplanfile_set', many=True, read_only=True)
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = SupportPlan
        fields = "__all__"

    def get_created_by(self, obj):
        return obj.created_by.username if obj.created_by else None

    def get_resident_name(self, obj):
        return f"{obj.resident.first_name} {obj.resident.last_name}"


class PlanEvaluationSerializer(serializers.ModelSerializer):
    name_first = serializers.CharField(source='staff.first_name', read_only=True)
    name_last = serializers.CharField(source='staff.last_name', read_only=True)

    class Meta:
        model = PlanEvaluation
        fields = "__all__"
        extra_kwargs = {
            'support_plan': {'read_only': True},
            'staff': {'read_only': True},
            'resident': {'read_only': True},

        }

    def create(self, validated_data):
        # Ensure support_plan is not passed multiple times
        support_plan = validated_data.pop('support_plan', None)
        staff = validated_data.pop('staff', None)
        resident = validated_data.pop('resident', None)

        # Create the PlanEvaluation instance
        instance = PlanEvaluation.objects.create(
            support_plan=support_plan,
            staff=staff,
            resident=resident,
            **validated_data  # Pass remaining validated_data
        )
        return instance


class AppointmentSerializer(serializers.ModelSerializer):
    name_first_name = serializers.CharField(source='resident.first_name', read_only=True)
    name_last_name = serializers.CharField(source='resident.last_name', read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"



class NoteSerializer(serializers.ModelSerializer):
    name_first_name = serializers.CharField(source='resident.first_name', read_only=True)
    name_last_name = serializers.CharField(source='resident.last_name', read_only=True)
    created_by_first_name = serializers.CharField(source='staff.first_name', read_only=True)
    created_by_last_name = serializers.CharField(source='staff.last_name', read_only=True)

    class Meta:
        model = Note
        fields = "__all__"

# serializers.py
class NoteExportSerializer(serializers.ModelSerializer):
    name_first_name = serializers.CharField(source='resident.first_name', read_only=True)
    name_last_name = serializers.CharField(source='resident.last_name', read_only=True)
    created_by_first_name = serializers.CharField(source='staff.first_name', read_only=True)
    created_by_last_name = serializers.CharField(source='staff.last_name', read_only=True)

    class Meta:
        model = Note
        fields = "__all__"



class WeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weight
        fields = "__all__"


class FluidIntakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FluidIntake
        fields = "__all__"


class SleepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sleep
        fields = "__all__"


class MentalStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentalState
        fields = "__all__"


class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = "__all__"


class BathSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bath
        fields = "__all__"


class MorningRoutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = MorningRoutine
        fields = "__all__"


class AfternoonRoutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = AfternoonRoutine
        fields = "__all__"


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"


class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = "__all__"


class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = "__all__"


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = "__all__"


class PosibleAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosibleAnswer
        fields = "__all__"


class AssignHomeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignHomeUser
        fields = "__all__"


class AtRiskOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AtRiskOption
        fields = ["name"]


class RiskActionPlanSerializer(serializers.ModelSerializer):
    name_first = serializers.CharField(source='created_by.first_name', read_only=True)
    name_last = serializers.CharField(source='created_by.last_name', read_only=True)
    firstname = serializers.CharField(source='resident.first_name', read_only=True)
    lastname = serializers.CharField(source='resident.last_name', read_only=True)
    riskperson = serializers.CharField(source='atriskoption.name', read_only=True)

    at_risk = serializers.PrimaryKeyRelatedField(queryset=AtRiskOption.objects.all(), many=True)

    class Meta:
        model = RiskActionPlan
        fields = "__all__"

    def create(self, validated_data):
        # Django handles ManyToMany fields automatically if we use PrimaryKeyRelatedField
        at_risk_data = validated_data.pop('at_risk', [])
        risk_action_plan = RiskActionPlan.objects.create(**validated_data)
        risk_action_plan.at_risk.set(at_risk_data)  # set handles the adding
        return risk_action_plan

    def update(self, instance, validated_data):
        at_risk_data = validated_data.pop('at_risk', [])
        instance = super().update(instance, validated_data)
        instance.at_risk.set(at_risk_data)  # set handles clearing and adding new ones
        return instance





class RiskSchedulerSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskScheduler
        fields = "__all__"


class SupportPlanSchedulerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportScheduler
        fields = "__all__"


class AccidentPlanSchedulerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuggestionComplainsScheduler
        fields = "__all__"


class EvaluationPlanSchedulerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReminderEvaluationScheduler
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class InventoryItemSerializer(serializers.ModelSerializer):
    created_by_first_name = serializers.CharField(source='created_by.first_name', read_only=True)
    created_by_last_name = serializers.CharField(source='created_by.last_name', read_only=True)

    class Meta:
        model = InventoryItem
        fields = "__all__"

    def get_queryset(self):
        selected_resident = self.context['request'].query_params.get('resident')
        queryset = super().get_queryset().filter(resident__national_id=selected_resident)
        return queryset

    def create(self, validated_data):
        created_by = self.context['request'].user
        validated_data['created_by'] = created_by
        return super().create(validated_data)

    def get_created_by(self, obj):
        return obj.created_by.username if obj.created_by else None


class InventoryItemDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'


class UserHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHistory
        fields = "__all__"

    def get_user(self, obj):
        return {
            'username': obj.user.username,
            'id': obj.user.id,
        }


def get_recorded_by(obj):
    return obj.recorded_by.username if obj.recorded_by else None


class HouseAssetsSerializer(serializers.ModelSerializer):
    recorded_by_first_name = serializers.CharField(source='recorded_by.first_name', read_only=True)
    recorded_by_last_name = serializers.CharField(source='recorded_by.last_name', read_only=True)
    house_name = serializers.CharField(source='location.name', read_only=True)

    class Meta:
        model = HouseAssets
        fields = "__all__"

    def get_created_by(self, obj):
        return obj.recorded_by.username if obj.recorded_by else None


class HouseStockSerializer(serializers.ModelSerializer):
    recorded_by_first_name = serializers.CharField(source='recorded_by.first_name', read_only=True)
    recorded_by_last_name = serializers.CharField(source='recorded_by.last_name', read_only=True)
    house_name = serializers.CharField(source='house.name', read_only=True)

    class Meta:
        model = HouseStock
        fields = "__all__"

    def get_created_by(self, obj):
        return obj.recorded_by.username if obj.recorded_by else None


class RepairRecordSerializer(serializers.ModelSerializer):
    recorded_by_first_name = serializers.CharField(source='recorded_by.first_name', read_only=True)
    recorded_by_last_name = serializers.CharField(source='recorded_by.last_name', read_only=True)
    house_name = serializers.CharField(source='house.name', read_only=True)

    class Meta:
        model = RepairRecord
        fields = '__all__'

    def get_created_by(self, obj):
        return obj.recorded_by.username if obj.recorded_by else None


class DeletionRecordSerializer(serializers.ModelSerializer):
    deleted_by_first_name = serializers.CharField(source='deleted_by.first_name', read_only=True)
    deleted_by_last_name = serializers.CharField(source='deleted_by.last_name', read_only=True)

    class Meta:
        model = DeletionRecords
        fields = '__all__'

    def get_deleted_by(self, obj):
        return obj.deleted_by.username if obj.deleted_by else None


class ConfidentialRecordSerializer(serializers.ModelSerializer):
    created_by_first_name = serializers.CharField(source='created_by.first_name', read_only=True)
    created_by_last_name = serializers.CharField(source='created_by.last_name', read_only=True)
    name_first_name = serializers.CharField(source='resident.first_name', read_only=True)
    name_last_name = serializers.CharField(source='resident.last_name', read_only=True)

    class Meta:
        model = ConfidentialRecord
        fields = '__all__'


class AllowedLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AllowedLocations
        fields = '__all__'

