from django.conf import settings  # new
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
    Permission,
    Group,
)
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
import datetime as dt
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created

from django.core.mail import send_mail
from django.utils import timezone
from datetime import datetime
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType


STOOL_TYPE = (
    ("1", "Type 1"),
    ("2", "Type 2"),
    ("3", "Type 3"),
    ("4", "Type 4"),
    ("5", "Type 5"),
    ("6", "Type 6"),
    ("7", "Type 7"),
)

APPOINTMENT_STATUS = (("Done", "Done"), ("Pending", "Pending"))

GENDER_CHIOCES = (("Male", "Male"), ("Female", "Female"), ("Other", "Other"))
RATING_CHOICES = (("Low", "Low"), ("Medium", "Medium"), ("High", "High"))
RISK_LEVELS = (("Low", "Low"), ("Medium", "Medium"), ("High", "High"))
RISK_PERSONNEL = (("Service User", "Service User"), ("Staff", "Staff"),
                  ("Family Member", "Family Member"), ("Other", "Other"))
LIKELIHOOD = (("Unlikely", "Unlikely"), ("May Happen", "May Happen"), ("Likely", "Likely"))
SEVERITY = (("Low", "Low"), ("Medium", "Medium"), ("High", "High"))
DURATION_CHOICES = (
    ("Standard Care Plan", "Standard Care Plan"),
    ("ShortTerm", "Short Term"),
    ("LongTerm", "Long Term"),
)

BATH_TYPE = (
    ("full", "full"),

    ("half", "half"),
)

ATTACHMENT_CHOICES = (
    ("GP", "GP"),
    ("Resident", "Resident"),
    ("Finance", "Finance"),
    ("Home", "Home"),
)
CONTACT_CHOICES = (
    ("GeneralInfo", "GeneralInfo"),
    ("Psychiatrist", "Psychiatrist"),
    ("Optician", "Optician"),
    ("SocialWorker", "SocialWorker"),
    ("Family", "Family"),
    ("CareCoordinator", "Care Coordinator"),
)
DAILY_CARE_OPTIONS = (("bath", "bath"),)

CATEGORY_TYPE = (
    ("HousingTenancy", "Housing/Tenancy"),
    ("FinanceMoneyBenefitManagement", "Finance/Money/Benefit Management"),
    ("RentArrearsServiceUsers", "Rent Arrears - Service Users"),
    ("Education", "Education"),
    ("Training", "Training"),
    ("Employment", "Employment"),
    ("MentalHealthSubstanceUse", "Mental Health/Substance Use"),
    ("EthnicCulturalReligiousNeeds", "Ethnic/Cultural/Religious Needs -"),
    ("LeisureSocialNetwork", "LeisureSocialNetwork"),
    ("MovingOn", "Moving On"),
    ("FurtherConcernsNeeds", "Further Concerns/Needs -"),
    (
        "ServicesProvidedByHousingOrEstateManagementService",
        "Services provided by Housing or Estate Management Service",
    ),
    ("ServicesProvidedBySupportWorker", "Services provided by Support Worker"),
    (
        "SupportWorkersViewsofIssuesNeedsorActions",
        "Support Worker's Views of Issues, Needs or Actions",
    ),
    ("PhysicalHealth", "Physical Health "),
)

REPEAT_CHOICES = (
    ("no", "No"),
    ("daily", "Daily"),
    ("weekly", "Weekly"),
    ("monthly", "Monthly"),
    ("yearly", "Yearly"),
    ("norecur", "NoRecur"),
)

TRANSACTION_TYPE = (
    ("Cash", "Cash"),
    ("Bank", "Bank"),
    ("Confirm", "Confirm"),
    ("Other", "Other"),
)

YES_NO = (
    ("Unknown", "Unknown"),
    ("Yes", "Yes"),
    ("No", "No"),
)
MENTAL_STATE = (
    ("moody", "moody"),
    ("cool", "cool"),
    ("Other", "Other"),
)
EMOTION_CHOICES = (
    ("unknown", "Unknown"),
    ("happy", "Happy"),
    ("joyful", "Joyful"),
    ("sad", "Sad"),
    ("content", "Content"),
    ("worried", "Worried"),
    ("fearful", "Fearful"),
    ("sleepy", "Sleepy"),
    ("confused", "Confused"),
    ("angry", "Angry"),
    ("annoyed", "Annoyed"),
    ("sleeping", "Sleeping"),
    ("tearful", "Tearful"),
)
MOOD = (
    ("moody", "moody"),
    ("cool", "cool"),
    ("Other", "Other"),
)
SHIFT_CHOICES = (
    ("Night", "Night"),
    ("Day", "Day"),
    ("Off", "Off"),
)
DR_CR = (("cr", "cr"), ("dr", "dr"))
REPORT_TYPE = (
    ("accident", "accident"),
    ("incident", "incident"),
    ("compliment", "compliment"),
    ("complaint", "complaint"),
    ("suggestion", "suggestion"),
    ("near", "near"),
)
SUGGESTION_STATUS = (
    ("low", "low"),
    ("medium", "medium"),
    ("high", "high"),
)
INFO_SRC_CHOICES = (
    ("APPLICANT", "APPLICANT"),
    ("CARERS/FRIENDS", "CARERS/FRIENDS"),
    ("REFERRER", "REFERRER"),
    ("OTHER AGENCIES", "OTHER AGENCIES"),
)
ETHNIC_CHOICES = (
    ("ASIAN", "ASIAN"),
    ("BLACK", "BLACK"),
    ("MIDDLE-EASTERN", "MIDDLE-EASTERN"),
    ("WHITE", "WHITE"),
    ("OTHER", "OTHER"),
)
MARITAL_CHOICES = (
    ("SINGLE", "SINGLE"),
    ("MARRIED", "MARRIED"),
    ("DIVORCED", "DIVORCED"),
    ("SEPARATED","SEPARATED")

)

class Home(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=60)
    address = models.TextField()
    capacity = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    """Manager for Users"""

    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
                Create and save a SuperUser with the given email and password.indere
        Female
        3
        2022-11-22
        0784310433
        syne@gmail.com
        Rows per page:

        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user in the system"""

    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    home = models.ForeignKey(Home, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.CharField(max_length=50, null=True, blank=True)  #this is the position or rank in the addform
    dob = models.DateField(null=True, blank=True)
    training = models.TextField(null=True, blank=True)
    marital_status = models.CharField(max_length=255, null=True, blank=True)
    nationality = models.CharField(max_length=255, null=True, blank=True)
    religion = models.CharField(max_length=30, null=True, blank=True)
    next_of_kin = models.TextField()
    ethnic_origin = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=100)
    gender = models.CharField(choices=GENDER_CHIOCES, max_length=50)
    tel1 = models.CharField(max_length=30, null=True, blank=True)
    tel2 = models.CharField(max_length=30, null=True, blank=True)
    mobile = models.CharField(max_length=30, null=True, blank=True)
    is_archived = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    department = models.CharField(max_length=30, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    leave_date = models.DateField(null=True, blank=True)
    # rota_Category = models.DateField(null=True, blank=True)
    supervisor = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True
    )
    NI_number = models.CharField(max_length=30, null=True, blank=True)

    full_driving_license = models.BooleanField(null=True, blank=True)

    profile_pic = models.ImageField(
        upload_to="profiles/", null=True, blank=True
    )
    deletion_reason = models.TextField(null=True, blank=True, default="Not deleted")
    enable_reason = models.TextField(null=True, blank=True, default="Enabled")

    USERNAME_FIELD = "email"
    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.email}"
    
        
class Reminder(models.Model):
    """Manages Sites"""

    id = models.AutoField(primary_key=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("Staff"),
        on_delete=models.CASCADE,
    )
    subject = models.CharField(max_length=50)
    notes = models.TextField()
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("Staff"),
        on_delete=models.CASCADE,
        related_name="created_by",
    )

    def __str__(self):
        return f"{self.id}"


class Note(models.Model):
    """Manages Notes"""

    id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=50)
    entry = models.TextField()
    type_of_note = models.CharField(
        default="day",
        max_length=50,
        choices=(("day", "day"), ("night", "night")),
    )
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("Created By"),
        on_delete=models.CASCADE,
    )
    resident = models.ForeignKey("Resident", on_delete=models.CASCADE)
    emotion = models.CharField(
        _("Emotion"), choices=EMOTION_CHOICES, max_length=10, default="unknown"
    )
    is_deleted = models.BooleanField(default=False)
    deletion_reason = models.TextField(null=True, blank=True, default="Not deleted")

    class Meta:
        ordering = ["-created_on"]

    def __str__(self):
        return self.subject


class ResidentDischarge(models.Model):
    """Manages  Resident Discharge"""
    id = models.AutoField(primary_key=True)
    is_discharged_status = models.BooleanField(default=False)
    discharged_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("Staff"),
        on_delete=models.CASCADE,
    )
    reason = models.TextField()
    resident = models.ForeignKey("Resident", on_delete=models.CASCADE)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    check_date = models.DateTimeField(_("check_date"), default=timezone.now)
    type = models.CharField(
        default="checkin",
        max_length=50,
        choices=(("checkin", "checkin"), ("checkout", "checkout")),
    )

    def __str__(self):
        return self.resident


class UserAssigned(models.Model):
    """Staff Resident DailyCare"""

    id = models.AutoField(primary_key=True)
    activity = models.CharField(
        null=True, max_length=20, choices=DAILY_CARE_OPTIONS
    )
    notes = models.TextField()

    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("Staff"),
        on_delete=models.CASCADE,
    )
    resident = models.ForeignKey("Resident", on_delete=models.CASCADE)
    home = models.ForeignKey("Home", on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name_plural = "Personale"

    def __str__(self):
        return self.staff + " --> " + self.resident

    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)


class DailyCare(models.Model):
    """Staff Resident DailyCare"""

    id = models.AutoField(primary_key=True)
    activity = models.CharField(
        null=True, max_length=20, choices=DAILY_CARE_OPTIONS
    )
    notes = models.TextField()

    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("Staff"),
        on_delete=models.CASCADE,
    )
    resident = models.ForeignKey("Resident", on_delete=models.CASCADE)
    home = models.ForeignKey("Home", on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name_plural = "Personale"

    def __str__(self):
        return self.staff + " --> " + self.resident

    created_on = models.DateField(_("Created On"), auto_now_add=True)


class Attachments(models.Model):
    id = models.AutoField(primary_key=True)
    resident = models.ForeignKey(
        "Resident", on_delete=models.CASCADE, blank=True, null=True
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )
    subject = models.CharField(max_length=30, blank=True, null=True)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(choices=ATTACHMENT_CHOICES, max_length=60)
    attachment = models.FileField(upload_to="attachments")

    def __str__(self):
        return "Attachment: " + self.subject


class BodyMap(models.Model):
    id = models.AutoField(primary_key=True)
    resident = models.ForeignKey(
        "Resident", on_delete=models.CASCADE, blank=True, null=True
    )
    accident = models.ForeignKey(
        "SuggestionComplains", on_delete=models.CASCADE, blank=True, null=True
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )
    treatment_plan = models.CharField(max_length=500, blank=True, null=True)

    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    comment = models.TextField(blank=True, null=True)
    wound_lenght = models.IntegerField()
    wound_width = models.IntegerField()
    pain = models.IntegerField()
    wound_depth = models.IntegerField()
    condition = models.CharField(max_length=150, blank=True, null=True)
    attachment = models.FileField(upload_to="attachments")

    next_assement_date = models.DateTimeField(
        _("Asssment date"), default=timezone.now
    )


class Resident(models.Model):
    """Resident"""

    # make sure a discharged resident doesnt show up @ queries
    national_id = models.CharField(max_length=25, primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    gender = models.CharField(max_length=30, choices=GENDER_CHIOCES)
    date_of_birth = models.DateField()
    next_of_kin = models.CharField(max_length=100, null=True, blank=False)
    relative = models.CharField(max_length=40, null=True,blank=False)
    is_archived = models.BooleanField(
        default=False
    )  # we must be able to achieve a resident
    is_discharged_status = models.BooleanField(
        default=False
    )  # we must be able to discharge a resident
    height = models.FloatField(_("height"), null=True, blank=True)
    NHS_number = models.CharField(max_length=255, null=True, blank=True)

    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    room = models.CharField(max_length=3, blank=True, null=True)
    home = models.ForeignKey(
        "Home", on_delete=models.CASCADE, null=True
    )  # what info is recorded abt a home
    profile_pic = models.ImageField(
        upload_to="profiles/", null=True, blank=True
    )
    phone = models.CharField(_("Contact"), max_length=20, null=True, blank=True)
    email = models.EmailField(max_length=255, unique=False, null=True, blank=True)
    address = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey('User', on_delete=models.CASCADE, null=True, blank=True)
    clinical_diagnosis = models.TextField(null=True, blank=True)
    medical_condition = models.TextField(null=True, blank=True)
    allergies = models.TextField(blank=True, null=True)
    risk = models.CharField(max_length=9999,blank=True, null=True)
    date_of_admission = models.DateField(blank=True, null=True)
    ethnic_origin = models.CharField(default= 'Unknown', max_length=30)
    marital_status = models.CharField(default='NonApplicable', max_length=100)


    def __str__(self):
        return f"{self.first_name } {self.last_name } {self.national_id}"

    class Meta:
        ordering = ["-is_archived"]


class HandoverPayment(models.Model):
    """HandoverPayment"""

    id = models.AutoField(primary_key=True)
    incoming = models.ForeignKey(
        "User", related_name="incoming", on_delete=models.CASCADE
    )
    outgoing = models.ForeignKey(
        "User", related_name="outgoing", on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    resident = models.ForeignKey("Resident", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_on"]


class PettyCash(models.Model):
    """Petty Cash"""

    id = models.AutoField(primary_key=True)
    resident = models.ForeignKey("Resident", on_delete=models.CASCADE)
    ammount = models.DecimalField(max_digits=20, decimal_places=2)
    description = models.TextField()
    attachment = models.ForeignKey(
        "Attachments", on_delete=models.CASCADE, null=True
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)

    def __str__(self):
        return self.description


class Finance(models.Model):
    """Petty Cash"""

    id = models.AutoField(primary_key=True)
    transaction_type = models.CharField(
        choices=TRANSACTION_TYPE, max_length=20
    )
    resident = models.ForeignKey("Resident", on_delete=models.CASCADE)
    # deposit = models.DecimalField(max_digits=20, decimal_places=2)
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    state = models.CharField(_("Type"), max_length=2, choices=DR_CR)
    # balance = models.DecimalField(max_digits=20, decimal_places=2)
    receipt = models.ForeignKey(
        "Attachments", on_delete=models.CASCADE, null=True
    )
    attachment = models.FileField(upload_to="receipts/", null=True, blank=True)
    description = models.TextField()
    tag_number = models.CharField(
        _("Tag Number"), max_length=50, null=True, blank=True
    )
    receipt_number = models.CharField(
        _("Receipt Number"), max_length=50, null=True, blank=True
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )
    created_on = models.DateField(_("Created On"), auto_now_add=True)

    def __str__(self):
        return self.description

    class Meta:
        ordering = ["-created_on"]


class SuggestionComplains(models.Model):
    """Suggestion and or Complains"""

    id = models.AutoField(primary_key=True)
    report_type = models.CharField(choices=REPORT_TYPE, max_length=20)
    subject = models.CharField(max_length=60)
    follow_up_notes = models.TextField()
    future_preventative_action = models.TextField()
    action_taken = models.TextField()
    incident_details = models.TextField()
    location = models.TextField()
    date_occured = models.DateTimeField()
    status = models.CharField(choices=SUGGESTION_STATUS, max_length=40)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )
    resident = models.ForeignKey(
        Resident, verbose_name="Family", on_delete=models.CASCADE
    )
    next_assement_date = models.DateTimeField(blank=True, null=True)
    discontinue = models.BooleanField(_("Discontinue"), default=False)


class Rota(models.Model):
    id = models.AutoField(primary_key=True)
    shift = models.CharField(choices=SHIFT_CHOICES, max_length=40)
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
        null=True,
        related_name="RotaStaff",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Created BY",
        on_delete=models.CASCADE,
        null=True,
        related_name="RotaCreated",
    )
    assigned_home = models.ForeignKey(
        "Home",
        verbose_name="Home",
        on_delete=models.CASCADE,
        null=True,
        related_name="RotaHome",
    )

    start_date = models.DateField()
    end_date = models.DateField()
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)

    def __str__(self):
        return str(self.id)


class SupportPlan(models.Model):
    title = models.CharField(max_length=100, null=True, blank=True)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    care_rating = models.CharField(_("Care Rating"), max_length=40, null=True, blank=True)
    approved_by = models.TextField(null=True, blank=True)
    cp_duration = models.CharField(choices=DURATION_CHOICES, max_length=40, null=True, blank=True)
    issue = models.TextField(null=True, blank=True)
    action_plan = models.TextField(null=True, blank=True)
    by_who = models.TextField(null=True, blank=True)
    by_when = models.TextField(null=True, blank=True)
    goal = models.TextField(null=True, blank=True)
    achievements = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey(
        "User", verbose_name=_(""), on_delete=models.CASCADE
    )
    resident = models.ForeignKey(
        "Resident", verbose_name=_(""), on_delete=models.CASCADE
    )
    next_assement_date = models.DateTimeField(
        _("Assessment date"), default=timezone.now
    )
    next_eval_date = models.DateTimeField(
        _("Evaluation Date"), default=timezone.now
    )
    evaluations = models.TextField(null=True, blank=True)
    discontinue = models.BooleanField(_("Discontinue"), default=False)
    category = models.CharField(choices=CATEGORY_TYPE, max_length=100)
    last_evaluated_date = models.DateTimeField(auto_now=True, blank=True, null=True)
    staff = models.CharField(max_length=100, blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    deletion_reason = models.TextField(null=True, blank=True, default="Not deleted")
    attachment = models.FileField(upload_to='support_plans', null=True, blank=True, default=None)

    def __str__(self):
        return self.title


class SupportPlanFile(models.Model):
    plan = models.ForeignKey(SupportPlan, related_name='files', on_delete=models.CASCADE)
    file = models.FileField(upload_to='support_plans/')
    uploaded_date = models.DateTimeField(auto_now_add=True)


class PlanEvaluation(models.Model):
    support_plan = models.ForeignKey(SupportPlan, on_delete=models.CASCADE)
    text = models.TextField(null=True, blank=True, default="")
    staff = models.ForeignKey("User", on_delete=models.CASCADE,
                              blank=True, null=True)
    resident = models.ForeignKey("RESIDENT",  on_delete=models.CASCADE,
                                 blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluation for {self.support_plan.resident} on {self.date}"


class RiskActionPlan(models.Model):
    title = models.TextField(null=True, blank=True)
    created_on = models.DateField(_("Created On"), auto_now_add=True)
    identified_risk = models.TextField(null=True, blank=True)
    risk_level = models.CharField(_("Risk Levels"), choices=RISK_LEVELS, max_length=40, null=True, blank=True)
    at_risk = models.ManyToManyField( "AtRiskOption", choices= RISK_PERSONNEL)
    likelihood = models.CharField(("Likelihood"), choices=LIKELIHOOD,max_length=1000, null=True, blank=True)
    severity = models.CharField(("Severity"), choices=SEVERITY, max_length=40, null=True, blank=True)
    approved_by = models.TextField(null=True, blank=True)
    details = models.TextField(null=True)
    triggers = models.TextField(null=True)
    support_needs = models.TextField(null=True, blank=True)
    information_sources_used = models.CharField(
        choices=INFO_SRC_CHOICES, default="REFERRER", max_length=50
    )
    is_further_information_needed = models.BooleanField(default=False)
    yes_no = models.CharField(choices=YES_NO, default="Unknown", max_length=40)
    created_by = models.ForeignKey(
        "User", verbose_name=_(""), on_delete=models.CASCADE
    )
    resident = models.ForeignKey(
        "Resident", verbose_name=_(""), on_delete=models.CASCADE
    )
    next_assement_date = models.DateTimeField(
        _("Asssment date"), default=timezone.now
    )
    discontinue = models.BooleanField(_("Discontinue"), default=False)
    is_deleted = models.BooleanField(_("Deleted"), default=False)



    def __str__(self):
        return self.title


class AtRiskOption(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name


class Appointment(models.Model):
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    start_time = models.DateTimeField(_("Start On"))
    due_time = models.DateTimeField(_("Due On"))
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(choices=APPOINTMENT_STATUS, max_length=30)
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
        null=True,
    )
    home = models.ForeignKey("Home", on_delete=models.CASCADE, null=True)
    resident = models.ForeignKey(
        "Resident",
        verbose_name="Resident",
        on_delete=models.CASCADE,
        null=True,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
        related_name="appointment_created_by",
    )
    recur = models.CharField(
        default="norecur",
        max_length=50,
        choices=REPEAT_CHOICES,
    )
    is_deleted = models.BooleanField(default=False)
    deletion_reason = models.TextField(null=True, blank=True, default="Not deleted")
    notify_email = models.EmailField(null=True, blank=True, default="")

    class Meta:
        ordering = ["-created_on"]

    def __str__(self):
        return self.description


class Task(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField()
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
        null=True,
    )

    status = models.CharField(
        choices=(("Done ", "Done "), ("Pending ", "Pending ")), max_length=30
    )

    start = models.TimeField()
    end_time = models.TimeField()
    home = models.ForeignKey("Home", on_delete=models.CASCADE, null=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.resident.first_name + "'s support plan"


class Weight(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    weight = models.FloatField(_("Weight"))
    resident = models.ForeignKey(
        "Resident",
        verbose_name="Resident",
        on_delete=models.CASCADE,
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )
    additional_info = models.TextField(_("Additional Infomation"))
    emotion = models.CharField(
        _("Emotion"), choices=EMOTION_CHOICES, max_length=10, default="unknown"
    )

    def __str__(self):
        return f" {self.id}"


class FluidIntake(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    amount = models.FloatField(_("Amount Taken "))
    amount_offered = models.FloatField(_("Amount Offered"))
    type_of_fluid = models.CharField(_("Type Of Fluid"), max_length=100)
    additional_info = models.TextField(_("Additional Infomation"))
    emotion = models.CharField(
        _("Emotion"), choices=EMOTION_CHOICES, max_length=10, default="unknown"
    )
    resident = models.ForeignKey(
        "Resident",
        verbose_name="Resident",
        on_delete=models.CASCADE,
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f" {self.id}"


class Sleep(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    amount = models.FloatField(_("Hours Slept"))
    resident = models.ForeignKey(
        "Resident",
        verbose_name="Resident",
        on_delete=models.CASCADE,
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )
    additional_info = models.TextField(_("Additional Infomation"))
    emotion = models.CharField(
        _("Emotion"), choices=EMOTION_CHOICES, max_length=10, default="unknown"
    )

    def __str__(self):
        return f" {self.id}"


class MentalState(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    state = models.CharField(
        _("Mental state"), choices=MENTAL_STATE, max_length=10
    )
    resident = models.ForeignKey(
        "Resident",
        verbose_name="Resident",
        on_delete=models.CASCADE,
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f" {self.id}"


class Mood(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    emotion = models.CharField(
        _("Emotion"), choices=EMOTION_CHOICES, max_length=20, default="unknown"
    )
    additional_info = models.TextField(_("Additional Infomation"))

    resident = models.ForeignKey(
        "Resident",
        verbose_name="Resident",
        on_delete=models.CASCADE,
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f" {self.id}"


class Bath(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    type_of_bath = models.CharField(
        _("Bath Type"), choices=BATH_TYPE, max_length=20
    )
    resident = models.ForeignKey(
        "Resident",
        verbose_name="Resident",
        on_delete=models.CASCADE,
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f" {self.id}"


class MorningRoutine(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    washing = models.TextField(max_length=100)
    shaving = models.TextField(max_length=100)
    prompting = models.TextField(max_length=100)
    oral_care = models.TextField(max_length=100)
    toilet_use = models.TextField(max_length=100)
    getting_up = models.TextField(max_length=100)
    getting_dressed = models.TextField(max_length=100)
    emotion = models.CharField(
        _("Emotion"), choices=EMOTION_CHOICES, max_length=10, default="unknown"
    )
    additional_info = models.TextField(_("Additional Infomation"))
    resident = models.ForeignKey(
        "Resident",
        verbose_name="Resident",
        on_delete=models.CASCADE,
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f" {self.id}"


class AfternoonRoutine(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    washing = models.TextField(max_length=100)
    shaving = models.TextField(max_length=100)
    prompting = models.TextField(max_length=100)
    oral_care = models.TextField(max_length=100)
    toilet_use = models.TextField(max_length=100)
    getting_up = models.TextField(max_length=100)
    getting_dressed = models.TextField(max_length=100)
    emotion = models.CharField(
        _("Emotion"), choices=EMOTION_CHOICES, max_length=30, default="unknown"
    )
    additional_info = models.TextField(_("Additional Infomation"))
    resident = models.ForeignKey(
        "Resident",
        verbose_name="Resident",
        on_delete=models.CASCADE,
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Staff",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f" {self.id}"

    def __str__(self):
        return f" {self.id}"

# I have added the models below in order to be able to update an inventory list


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name



class InventoryItem(models.Model):
    item_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, null=False, blank=True)
    quantity = models.IntegerField( null=True, blank=True)
    resident = models.ForeignKey('Resident', on_delete=models.CASCADE)
    created_at = models.DateTimeField( null=True, blank=True, auto_now_add=True)
    created_by = models.ForeignKey('User', on_delete=models.CASCADE,null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    def __str__(self):
        return self.created_by.id


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=20)
    assement = models.ForeignKey("Assessment", on_delete=models.CASCADE)

    def __str__(self):
        return self.question


class Assessment(models.Model):
    id = models.AutoField(primary_key=True)
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    title = models.CharField(max_length=20)

    def __str__(self) -> str:
        return f" {self.id}"


class Evaluation(models.Model):
    id = models.AutoField(primary_key=True)
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    resident = models.ForeignKey("Resident", on_delete=models.CASCADE)
    assessment = models.ForeignKey(
        "Assessment",
        related_name="EvaluationAssessment",
        on_delete=models.CASCADE,
    )

    date = models.DateField(auto_now=True)
    next_assement_date = models.DateTimeField(
        _("Asssment date"), default=timezone.now
    )
    discontinue = models.BooleanField(_("Discontibnue"), default=False)

    def __str__(self):
        return f" {self.id}"

    class Meta:
        unique_together = ("date", "assessment", "resident")


class Choice(models.Model):
    id = models.AutoField(primary_key=True)
    evaluation = models.CharField("Evaluation", max_length=20)
    question = models.ForeignKey("Question", on_delete=models.CASCADE)
    answer = models.ForeignKey("PosibleAnswer", on_delete=models.CASCADE)
    comment = models.CharField(max_length=50)

    def __str__(self):
        return f" {self.id}"

    class Meta:
        unique_together = ("question", "evaluation")


class PosibleAnswer(models.Model):
    id = models.AutoField(primary_key=True)
    answear = models.CharField(max_length=20)
    question = models.ForeignKey("Question", on_delete=models.CASCADE)
    score = models.IntegerField()

    def __str__(self):
        return self.answear


class AssignHomeUser(models.Model):
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("Staff"),
        on_delete=models.CASCADE,
    )
    home = models.ForeignKey("Home", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.staff + " " + self.home

class AssignHomeStaff(models.Model):
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("Staff"),
        on_delete=models.CASCADE,
    )    
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("assigned_by"),
        related_name="assigned_by",
        on_delete=models.CASCADE,
    )
    home = models.ForeignKey("Home", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.staff + " " + self.home


class ReminderEvaluation(models.Model):
    id = models.AutoField(primary_key=True)
    reminder = models.ForeignKey(
        "Reminder",
        verbose_name=_("Reminder"),
        on_delete=models.CASCADE,
        related_name="ReminderEvaluation",
    )
    valuation = models.ForeignKey(
        "Evaluation",
        verbose_name=_("Evaluation"),
        on_delete=models.CASCADE,
    )
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)

    def __str__(self):
        return f"{self.id}"


class ReminderAppointment(models.Model):
    id = models.AutoField(primary_key=True)
    reminder = models.ForeignKey(
        "Reminder",
        verbose_name=_("Appointment"),
        on_delete=models.CASCADE,
        related_name="ReminderAppointment",
    )
    appointment = models.ForeignKey(
        "Appointment",
        verbose_name=_("Appointment"),
        on_delete=models.CASCADE,
    )
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)

    class Meta:
        unique_together = ("reminder", "appointment")

    def __str__(self):
        return f"{self.id}"


class ReminderRota(models.Model):
    id = models.AutoField(primary_key=True)
    reminder = models.OneToOneField(
        "Reminder",
        verbose_name=_("Reminder"),
        on_delete=models.CASCADE,
        related_name="ReminderRota",
    )
    rota = models.ForeignKey(
        "Rota",
        verbose_name=_("Rota"),
        on_delete=models.CASCADE,
    )
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)

    def __str__(self):
        return f"{self.id}"


class ReminderEvaluationScheduler(models.Model):
    id = models.AutoField(primary_key=True)
    reminder = models.OneToOneField(
        "Reminder",
        verbose_name=_("Reminder"),
        on_delete=models.CASCADE,
        related_name="Reminder",
    )
    evaluation = models.ForeignKey(
        "Evaluation",
        verbose_name=_("Evaluation"),
        on_delete=models.CASCADE,
    )
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)

    def __str__(self):
        return f"{self.id}"


class SuggestionComplainsScheduler(models.Model):
    id = models.AutoField(primary_key=True)
    reminder = models.OneToOneField(
        "Reminder",
        verbose_name=_("Reminder"),
        on_delete=models.CASCADE,
        related_name="SuggestionComplainsReminder",
    )
    accident = models.ForeignKey(
        "SuggestionComplains",
        verbose_name=_("SuggestionComplains"),
        on_delete=models.CASCADE,
    )
    created_on = models.DateTimeField(_("Created On"), auto_now_add=True)
    evalution_date = models.DateTimeField()

    def __str__(self):
        return f"{self.id}"


# class EvaluationScheduler(models.Model):
#     id = models.AutoField(primary_key=True)
#     evalution_date = models.DateTimeField()
#     evaluation = models.ForeignKey(
#         "Evaluation",
#         verbose_name=_("Reminder"),
#         on_delete=models.CASCADE,
#         related_name="EvaluationScheduler",
#     )

#     def __str__(self):
#         return f" {self.id}"


class SupportScheduler(models.Model):
    id = models.AutoField(primary_key=True)
    evalution_date = models.DateTimeField()
    support_plan = models.ForeignKey(
        "SupportPlan",
        verbose_name=_("SupportPlan"),
        on_delete=models.CASCADE,
        related_name="SupportScheduler",
    )
    reminder = models.ForeignKey(
        "Reminder",
        verbose_name=_("Reminder"),
        on_delete=models.CASCADE,
        related_name="SupportPlanScheduler",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f" {self.id}"


class RiskScheduler(models.Model):
    id = models.AutoField(primary_key=True)
    evalution_date = models.DateTimeField()
    risk = models.ForeignKey(
        "RiskActionPlan",
        verbose_name=_("RiskActionPlan"),
        on_delete=models.CASCADE,
        related_name="RiskScheduler",
    )
    reminder = models.ForeignKey(
        "Reminder",
        verbose_name=_("Reminder"),
        on_delete=models.CASCADE,
        related_name="ReminderRiskScheduler",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f" {self.id}"


class UserHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)
    # Add any additional fields you need to store

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.timestamp}"


class HouseAssets(models.Model):
    name = models.CharField(max_length=255)
    serial_number = models.CharField(max_length=50, unique=True)
    date_of_acquisition = models.DateField()
    condition = models.CharField(max_length=100)
    location = models.ForeignKey("Home", on_delete=models.SET_NULL, null=True)
    recorded_by = models.ForeignKey("User", on_delete=models.SET_NULL, null=True)  # Link to User model
    recorded_on = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50, null=False, blank=True)
    value = models.CharField(max_length=50, null=True, blank=False)
    is_deleted = models.BooleanField(default=False)
    deletion_reason = models.TextField(null=True, blank=True, default="Not deleted")

    def __str__(self):
        return self.recorded_by.id

    class Meta:
        ordering = ['-recorded_on']


class HouseStock(models.Model):
    name = models.CharField(max_length=255, null=False, blank=True)
    quantity = models.CharField(max_length=30, null=False, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    date_of_acquisition = models.DateField(null=True)
    recorded_by = models.ForeignKey("User", on_delete=models.SET_NULL, blank=False, null=True)
    created_on = models.DateTimeField(auto_now_add=True, null=True)
    expiry_date = models.DateField(null=True)
    house = models.ForeignKey("Home", on_delete=models.SET_NULL, blank=False, null=True)
    if_perishable = models.CharField(max_length=50, null=True, blank=False)
    is_deleted = models.BooleanField(default=False)
    deletion_reason = models.TextField(null=True, blank=True, default="Not deleted")

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-name']


class RepairRecord(models.Model):
    asset_type = models.CharField(max_length=50, blank=False, null=False)
    asset_name = models.CharField(max_length=200)
    date_reported = models.DateField()
    reminder_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=[("Pending", "Pending"), ("In Progress", "In Progress"), ("Completed", "Completed")])
    priority_level = models.CharField(max_length=50, blank=True, null=False)
    house = models.ForeignKey(Home, on_delete=models.SET_NULL, blank=False, null=True)
    photos = models.ImageField(upload_to='repair_photos/', null=True, blank=True)
    attachments = models.FileField(upload_to='repair_attachments/', null=True, blank=True)
    description = models.TextField()
    recorded_by = models.ForeignKey("User", on_delete=models.SET_NULL, blank=False, null=True)
    is_deleted = models.BooleanField(default=False)
    deletion_reason = models.TextField(null=True, blank=True, default="Not deleted")

    def __str__(self):
        return f"{self.asset_name} - {self.status}"


class DeletionRecords(models.Model):
    stock_item = models.ForeignKey("HouseStock", on_delete=models.CASCADE, null=True)
    reason = models.TextField(null=True)
    date_deleted = models.DateTimeField(auto_now_add=True)
    deleted_by = models.ForeignKey("User", on_delete=models.SET_NULL, blank=False, null=True )

    def __str__(self):
        return f"{self.deleted_by.username}"


class GP(models.Model):
    resident = models.OneToOneField(Resident, on_delete=models.CASCADE, related_name="gp")
    gp_name = models.CharField(max_length=100)
    gp_phone = models.CharField(max_length=15, blank=True, null=True)
    gp_email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"GP: {self.name} for {self.resident.first_name}"


class SocialWorker(models.Model):
    resident = models.OneToOneField(Resident, on_delete=models.CASCADE, related_name="social_worker")
    sw_name = models.CharField(max_length=100)
    sw_phone = models.CharField(max_length=15, blank=True, null=True)
    sw_email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"Social Worker: {self.name} for {self.resident.first_name}"


class Pharmacist(models.Model):
    resident = models.OneToOneField(Resident, on_delete=models.CASCADE, related_name="pharmacist")
    pharma_name = models.CharField(max_length=100)
    pharma_phone = models.CharField(max_length=15, blank=True, null=True)
    pharma_email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"Pharmacist: {self.name} for {self.resident.first_name}"


class Dentist(models.Model):
    resident = models.OneToOneField(Resident, on_delete=models.CASCADE, related_name="dentist")
    dentist_name = models.CharField(max_length=100)
    dentist_phone = models.CharField(max_length=15, blank=True, null=True)
    dentist_email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"Dentist: {self.name} for {self.resident.first_name}"


class ConfidentialRecord(models.Model):
    information = models.TextField()
    resident = models.ForeignKey("Resident", on_delete=models.CASCADE)
    added_on = models.DateField(auto_now_add=True)
    created_by = models.ForeignKey("User", on_delete=models.SET_NULL, null=True)
    is_deleted = models.BooleanField(default=False)
    deletion_reason = models.TextField(default="Not deleted")


class AllowedLocations(models.Model):
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    radius = models.FloatField()
    allowed_groups = models.ManyToManyField("AllowedUserGroup")


class AllowedUserGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link the AllowedUserGroup to a User
    group = models.ForeignKey(Group, on_delete=models.CASCADE)  # Link the AllowedUserGroup to a Group

    def __str__(self):
        return f"{self.user.first_name} - {self.group.name}"

@receiver(post_save, sender=Appointment)
def create_reminder_for_appointment(sender, instance, created, **kwargs):
    if created:
        start_date_time = instance.start_time
        end_date_time = instance.due_time

        def create_reminder(reminder_date):
            try:
                reminder = Reminder.objects.create(
                    start_date=reminder_date,
                    end_date=reminder_date,
                    staff=instance.staff,
                    subject=instance.title,
                    notes=instance.description,
                    created_by=instance.created_by,
                )
                ReminderAppointment.objects.create(
                    appointment=instance, reminder=reminder
                )
            except Exception as e:
                print(e)

        match instance.recur:
            case "norecur":
                create_reminder(start_date_time)

            case "daily":
                create_reminder(start_date_time)
                next_reminder_date = start_date_time + timezone.timedelta(days=1)
                while next_reminder_date <= end_date_time:
                    create_reminder(next_reminder_date)
                    next_reminder_date += timezone.timedelta(days=1)

            case "weekly":
                create_reminder(start_date_time)
                next_reminder_date = start_date_time + timezone.timedelta(weeks=1)
                while next_reminder_date <= end_date_time:
                    create_reminder(next_reminder_date)
                    next_reminder_date += timezone.timedelta(weeks=1)

            case "monthly":
                create_reminder(start_date_time)
                next_reminder_date = start_date_time.replace(day=1)
                while next_reminder_date <= end_date_time:
                    month = next_reminder_date.month + 1
                    year = next_reminder_date.year
                    if month > 12:
                        month = 1
                        year += 1
                    next_reminder_date = next_reminder_date.replace(year=year, month=month)
                    create_reminder(next_reminder_date)

            case "yearly":
                create_reminder(start_date_time)
                next_reminder_date = start_date_time
                while next_reminder_date <= end_date_time:
                    year = next_reminder_date.year + 1
                    next_reminder_date = next_reminder_date.replace(year=year)
                    create_reminder(next_reminder_date)

        # Adjust the logic to ensure weekly reminders are created 7 days apart
        if instance.recur == "weekly":
            reminder_date = start_date_time
            while reminder_date <= end_date_time:
                create_reminder(reminder_date)
                reminder_date += timezone.timedelta(weeks=1)

        # Adjust the logic to ensure monthly reminders are created 1 month apart
        if instance.recur == "monthly":
            reminder_date = start_date_time
            while reminder_date <= end_date_time:
                create_reminder(reminder_date)
                month = reminder_date.month + 1
                year = reminder_date.year
                if month > 12:
                    month = 1
                    year += 1
                reminder_date = reminder_date.replace(year=year, month=month)

        if instance.recur == "yearly":
            reminder_date = start_date_time
            while reminder_date <= end_date_time:
                create_reminder(reminder_date)
                year = reminder_date.year + 1
                reminder_date = reminder_date.replace(year=year)
@receiver(pre_delete, sender=Appointment)
def delete_reminder_for_appointment(sender, instance, **kwargs):
    try:
        rts = ReminderAppointment.objects.filter(appointment=instance)
        for rt in rts:
            r = rt.reminder
            r.delete()
        rts.delete()
    except Exception as e:
        print(e)






@receiver(pre_delete, sender=Evaluation)
def delete_reminder_for_evaluation(sender, instance, **kwargs):
    try:
        rts = ReminderEvaluationScheduler.objects.filter(
            evaluation_scheduler=instance
        )
        for rt in rts:
            r = rt.reminder
            r.delete()
        rts.delete()
    except Exception as e:
        print(e)


@receiver(post_save, sender=Evaluation)
def create_reminder_for_evaluation(sender, instance, created, **kwargs):
    if created:
        if not instance.discontinue and instance.next_assement_date:
            try:
                reminder = Reminder.objects.create(
                    start_date=instance.next_assement_date,
                    end_date=instance.next_assement_date
                    + timezone.timedelta(hours=0.5),
                    staff=instance.staff,
                    subject=instance.assessment.title,
                    notes=f"{instance.assessment.title }  for {instance.resident}",
                    created_by=instance.staff,
                )
                ReminderEvaluationScheduler.objects.create(
                    evaluation_scheduler=instance,
                    reminder=reminder,
                    next_assement_date=instance.next_assement_date,
                )
            except Exception as e:
                print(e)
        else:
            try:
                rs = ReminderEvaluationScheduler.objects.get(
                    evaluation_scheduler=instance
                )
                rs.evalution_date = instance.next_assement_date
                r = rs.reminder
                r.start_date = instance.next_assement_date
                r.end_date = instance.next_assement_date + timezone.timedelta(
                    hours=0.5
                )
                r.save()
                rs.save()
            except Exception as e:
                print(e)


@receiver(pre_delete, sender=Rota)
def delete_reminder_for_rota(sender, instance, **kwargs):
    try:
        rts = ReminderRota.objects.filter(rota=instance)
        for rt in rts:
            r = rt.reminder
            r.delete()
        rts.delete()
    except Exception as e:
        print(e)


@receiver(post_save, sender=Rota)
def create_reminder_for_rota(sender, instance, created, **kwargs):
    if created:
        start_date = instance.start_date
        end_date = instance.end_date
        date_list = [start_date]
        date_modified = start_date
        while date_modified < end_date:
            date_modified += dt.timedelta(days=1)
            date_list.append(date_modified)

        if instance.shift == "Night":
            for ffdate in date_list:
                reminder = Reminder.objects.create(
                    start_date=ffdate,
                    end_date=ffdate + dt.timedelta(hours=12),
                    staff=instance.staff,
                    subject=f"Night Shift for  {instance.staff.first_name}  at {instance.assigned_home}",
                    notes=f"Night Shift for  {instance.staff.first_name}  {instance.staff.first_name} at {instance.assigned_home}",
                    created_by=instance.staff,
                )
                ReminderRota.objects.create(rota=instance, reminder=reminder)

        if instance.shift == "Day":
            for ffdate in date_list:
                reminder = Reminder.objects.create(
                    start_date=ffdate + dt.timedelta(hours=12),
                    end_date=ffdate + dt.timedelta(hours=23),
                    staff=instance.staff,
                    subject=f"Night Shift for  {instance.staff.first_name}  at {instance.assigned_home}",
                    notes=f"Night Shift for  {instance.staff.first_name}  {instance.staff.first_name} at {instance.assigned_home}",
                    created_by=instance.staff,
                )
                ReminderRota.objects.create(rota=instance, reminder=reminder)

    else:
        start_date = instance.start_date
        end_date = instance.end_date
        date_list = [start_date]
        date_modified = start_date

        while date_modified < end_date:
            date_modified += dt.timedelta(days=1)
            date_list.append(date_modified)

        if instance.shift == "Night":
            for ffdate in date_list:
                rt = ReminderRota.objects.get(rota=instance)
                r = rt.reminder
                r.start_date = ffdate
                r.end_date = ffdate + dt.timedelta(hours=12)

        elif instance.shift == "Day":
            for ffdate in date_list:
                rt = ReminderRota.objects.get(rota=instance)
                r = rt.reminder
                r.start_date = ffdate + dt.timedelta(hours=12)
                r.end_date = ffdate + dt.timedelta(hours=23)


@receiver(pre_delete, sender=SuggestionComplains)
def delete_reminder_for_accident(sender, instance, **kwargs):
    try:
        rts = ReminderRota.objects.filter(accident=instance)
        for rt in rts:
            r = rt.reminder
            r.delete()
        rts.delete()
    except Exception as e:
        print(e)


@receiver(post_save, sender=SuggestionComplains)
def create_reminder_for_accident(sender, instance, created, **kwargs):
    if created:
        if not instance.discontinue and instance.next_assement_date:
            try:
                reminder = Reminder.objects.create(
                    start_date=instance.next_assement_date,
                    end_date=instance.next_assement_date
                    + timezone.timedelta(hours=0.25),
                    staff=instance.staff,
                    subject=instance.subject,
                    notes=instance.follow_up_notes,
                    created_by=instance.staff,
                )
                SuggestionComplainsScheduler.objects.create(
                    accident=instance,
                    reminder=reminder,
                    evalution_date=instance.next_assement_date,
                )
            except Exception as e:
                print(e)
    else:
        try:
            rs = SupportScheduler.objects.get(accident=instance)
            rs.evalution_date = instance.next_assement_date
            r = rs.reminder
            r.start_date = instance.next_assement_date
            r.end_date = instance.next_assement_date + timezone.timedelta(
                hours=0.25
            )
            r.save()
            rs.save()
            print(instance.next_assement_date)
        except Exception as e:
            print(e)


@receiver(pre_delete, sender=SuggestionComplains)
def delete_reminder_for_risk(sender, instance, **kwargs):
    try:
        rts = RiskScheduler.objects.filter(risk=instance)
        for rt in rts:
            r = rt.reminder
            r.delete()
        rts.delete()
    except Exception as e:
        print(e)


@receiver(post_save, sender=RiskActionPlan)
def create_reminder_for_risk(sender, instance, created, **kwargs):
    if created:
        if not instance.discontinue and instance.next_assement_date:
            try:
                reminder = Reminder.objects.create(
                    start_date=instance.next_assement_date,
                    end_date=instance.next_assement_date
                    + timezone.timedelta(hours=0.25),
                    staff=instance.created_by,
                    subject=instance.title,
                    notes=instance.details,
                    created_by=instance.created_by,
                )
                RiskScheduler.objects.create(
                    risk=instance,
                    reminder=reminder,
                    evalution_date=instance.next_assement_date,
                )
            except Exception as e:
                print(e)
    else:
        try:
            rs = RiskScheduler.objects.get(risk=instance)
            rs.evalution_date = instance.next_assement_date
            r = rs.reminder
            r.start_date = instance.next_assement_date
            r.end_date = instance.next_assement_date + timezone.timedelta(
                hours=0.25
            )
            r.save()
            rs.save()
            print(instance.next_assement_date)
        except Exception as e:
            print(e)


@receiver(pre_delete, sender=SupportPlan)
def delete_reminder_for_support(sender, instance, **kwargs):
    print("tttttttttttttttttttttttttttttttttttttttttttttttt")
    try:
        rts = SupportScheduler.objects.filter(support_plan=instance)
        for rt in rts:
            r = rt.reminder
            r.delete()
        rts.delete()
    except Exception as e:
        print(e)


@receiver(post_save, sender=SupportPlan)
def create_reminder_for_support(sender, instance, created, **kwargs):
    if created:
        if not instance.discontinue and instance.next_assement_date:
            try:
                reminder = Reminder.objects.create(
                    start_date=instance.next_assement_date,
                    end_date=instance.next_assement_date
                    + timezone.timedelta(hours=0.25),
                    staff=instance.created_by,
                    subject=instance.title,
                    notes=instance.title,
                    created_by=instance.created_by,
                )
                SupportScheduler.objects.create(
                    support_plan=instance,
                    reminder=reminder,
                    evalution_date=instance.next_assement_date,
                )
            except Exception as e:
                print(e)
    else:
        try:
            rs = SupportScheduler.objects.get(support_plan=instance)
            rs.evalution_date = instance.next_assement_date
            r = rs.reminder
            r.start_date = instance.next_assement_date
            r.end_date = instance.next_assement_date + timezone.timedelta(
                hours=0.25
            )
            r.save()
            rs.save()
            print(instance.next_assement_date)
        except Exception as e:
            print(e)


@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    email_plaintext_message = "{}{}?token={}".format(
        settings.FRONTEND_HOST,
        reverse("password_reset:reset-password-request"),
        reset_password_token.key,
    )
    send_mail(
        "Password Reset for {title}".format(title="Clinix Health Systems"),
        email_plaintext_message,
        settings.EMAIL_HOST_USER,
        [reset_password_token.user.email],
        fail_silently=False,
    )


from django_rest_passwordreset.models import (
    ResetPasswordToken,
)


@receiver(post_save, sender=User)
def send_password_reset_token_2(sender, instance, created, *args, **kwargs):
    if created:
        instance.is_active = True
        instance.save()
        token = ResetPasswordToken.objects.create(user=instance)

        context = {
            "current_user": token.user,
            "email": token.user.email,
            "reset_password_url": "{}{}?token={}".format(
                settings.FRONTEND_HOST,
                reverse("password_reset:reset-password-request"),
                token.key,
            ),
        }

        send_mail(
            # title:
            "Password Reset for {title}".format(title="Clinix Health Systems"),
            # message:
            f'Your password_reset link is {context["reset_password_url"]}',
            # from:
            settings.EMAIL_HOST_USER,
            # to:
            [token.user.email],
            fail_silently=False,
        )


