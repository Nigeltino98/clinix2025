from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import *
from django.contrib.auth.models import Permission

# Register your models here.

admin.site.register(Reminder)

admin.site.register(ResidentDischarge)

admin.site.register(DailyCare)

admin.site.register(Attachments)

admin.site.register(Resident)

admin.site.register(PettyCash)

admin.site.register(Finance)

admin.site.register(SuggestionComplains)

admin.site.register(Rota)

admin.site.register(SupportPlan)

admin.site.register(Appointment)

admin.site.register(Task)

admin.site.register(Home)

admin.site.register(Note)

admin.site.register(Weight)

admin.site.register(Bath)

admin.site.register(Mood)

admin.site.register(MentalState)

admin.site.register(FluidIntake)

admin.site.register(Sleep)

admin.site.register(MorningRoutine)

admin.site.register(AfternoonRoutine)

admin.site.register(Question)

admin.site.register(Assessment)

admin.site.register(Evaluation)

admin.site.register(Choice)


admin.site.register(ReminderEvaluationScheduler)

admin.site.register(PosibleAnswer)


admin.site.register(Permission)

admin.site.register(ReminderRota)

admin.site.register(InventoryItem)

admin.site.register(Category)

admin.site.register(UserHistory)

admin.site.register(HouseAssets)

admin.site.register(HouseStock)

admin.register(RepairRecord)

admin.site.register(ConfidentialRecord)

admin.site.register(DeletionRecords)

admin.site.register(AllowedLocations)

admin.site.register(AllowedUserGroup)
#


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = (
        "email",
        "is_staff",
        "is_active",
        "first_name",
        "last_name",
        "profile_pic",
        "gender",
        "training",
    )
    list_filter = (
        "email",
        "is_staff",
        "is_active",
    )
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "password",
                    "profile_pic",
                    "first_name",
                    "last_name",
                )
            },
        ),
        ("Permissions", {"fields": ("is_staff", "is_active")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                    "first_name",
                    "last_name",
                    "profile_pic",
                    "gender",
                    "training",
                ),
            },
        ),
    )

    search_fields = ("email",)
    ordering = ("email",)


admin.site.register(User)  # , #CustomUserAdmin)

admin.site.register(AssignHomeUser)
