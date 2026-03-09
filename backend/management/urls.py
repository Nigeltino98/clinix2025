from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt import views as jwt_views


# Registering Rest-API routes for Accounts
router = DefaultRouter()

router.register(r"reminder", views.ReminderViewSet, "Reminder")
router.register(
    r"resident-discharge", views.ResidentDischargeViewSet, "ResidentDischarge"
)
router.register(r"daily-care", views.DailyCareViewSet, "DailyCare")
router.register(r"attachment", views.AttachmentsViewSet, "Attachments")
router.register(r"resident", views.ResidentViewSet, "Resident")
router.register(r"staff", views.StaffViewSet, "Staff")
router.register(r"group", views.GroupViewSet, "group")
router.register(r"petty-cash", views.PettyCashViewSet, "PettyCash")
router.register(r"transaction", views.FinanceViewSet, "Finance")
router.register(
    r"suggestion", views.SuggestionComplainsViewSet, "SuggestionComplains"
)
router.register(r"rota", views.RotaViewSet, "Rota")
router.register(r"support-plan", views.SupportPlanViewSet, "SupportPlan")
router.register(r"appointment", views.AppointmentViewSet, "Appointment")
router.register(r"task", views.TaskViewSet, "Task")
router.register(r"home", views.HomeViewSet, "Home")
router.register(r"note", views.NoteViewSet, "Note")
router.register(r"weight", views.WeightViewSet, "Weight")
router.register(r"fluid-intake", views.FluidIntakeViewSet, "FluidIntake")
router.register(r"sleep", views.SleepViewSet, "Sleep")
router.register(r"mental-state", views.MentalStateViewSet, "MentalState")
router.register(r"mood", views.MoodViewSet, "Mood")
router.register(r"bath", views.BathViewSet, "Bath")
router.register(
    r"morning-routine", views.MorningRoutineViewSet, "MorningRoutine"
)
router.register(
    r"afternoon-routine", views.AfternoonRoutineViewSet, "AfternoonRoutine"
)
router.register(r"question", views.QuestionViewSet, "Question")
router.register(r"assessment", views.AssessmentViewSet, "Assessment")
router.register(r"review", views.EvaluationViewSet, "Review")
router.register(r"choice", views.ChoiceViewSet, "Choice")
router.register(
    r"posible-answear", views.PosibleAnswerViewSet, "PosibleAnswe  b    r"
)
router.register(
    r"assign-home-user", views.AssignHomeUserViewset, "PosibleAnswear"
)
router.register(r"plan", views.SupportPlanViewSet, "SupportPlans")
router.register(r"risk", views.RiskActionPlanViewSet, "RiskActionPlan")
router.register(r"body-map", views.BodyMapViewSet, "BodyMap")
router.register(r"risk-scheduler", views.RiskSchedulerViewSet, "RiskScheduler")
router.register(r"plan-scheduler", views.PlanSchedulerViewSet, "PlanScheduler")
router.register(r"evaluation-scheduler", views.EvaluationSchedulerViewSet, "EvaluationScheduler")
router.register(r"accident-scheduler", views.AccidentSchedulerViewSet, "AccidentScheduler")
router.register(r"category", views.CategoryViewSet, "Category")
router.register(r"inventory", views.InventoryItemViewSet, "InventoryItem")
router.register(r"UserHistory", views.UserHistoryViewSet, "UserHistory")
router.register(r"DeleteUser", views.DeleteNonSuperusersViewSet, "DeleteUser")
router.register(r"house-asset", views.HouseAssetsViewSet, "HouseAsset")
router.register(r"homes", views.HomeViewSet, "Homes")
router.register(r"house-stock", views.HouseStockViewSet, "HouseStock")
router.register(r"house-overview", views.HouseAssetsViewSet, "HouseOverview")
router.register(r"repair-record", views.RepairRecordViewSet, "RepairRecord")
router.register(r"record-delete", views.DeletionRecordViewSet, "DeleteRecord")
router.register(r"confidential-info", views.ConfidentialRecordViewSet, "ConfidentialRecord")

router.register(r'support-plan/(?P<support_plan_id>\d+)/evaluations', views.PlanEvaluationViewSet, basename='evaluations')
router.register(r'evaluations', views.PlanEvaluationViewSet, basename='PlanEvaluations')
router.register(r'risk-options', views.AtRiskOptionViewSet, basename='AtRiskOptions')


urlpatterns = [
    path("token/", views.CreateTokenView.as_view(), name="tochoicesken"),
    path(
        "change-password/",
        views.ChangePasswordView.as_view(),
        name="change-password",
    ),
    path(
        "password_reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("choices/", views.Choices.as_view({"post": "list"}), name="token"),
    path(
        "nextofkin/",
        views.NextofKeenViewSet.as_view({"post": "list"}),
        name="nxtkin",
    ),
    path(
        "handoverpayment/",
        views.HandoverPaymentViewSet.as_view(
            {"get": "list", "post": "update"}
        ),
        name="handoverpayment",
    ),
    path("me/", views.ManageUserView.as_view(), name="me"),
    path("", include(router.urls), name="management_api"),
    # login with refresh and tocken tokens
    path(
        "api-auth/", include("rest_framework.urls", namespace="rest_framework")
    ),

    path("category/", views.CategoryViewSet.as_view({"post": "list"}), name="category"),
    path("inventory/", views.InventoryItemViewSet.as_view({"get": "list", "post": "create"}), name="inventory"),

    path("userHistory", views.UserHistoryViewSet.as_view({"get": "list"}), name="userHistory"),
    path("delete-non-superusers/", views.DeleteNonSuperusersViewSet.as_view({"delete": "destroy"}), name="delete-non-superusers"),
    path("house-asset/", views.HouseAssetsViewSet.as_view({"get": "list", "post": "create"}), name="house-asset"),
    path("home-list/", views.HomeViewSet.as_view({"get": "list"}), name="home-list"),
    path("api/house-stock/",
         views.HouseStockViewSet.as_view({"get": "list", "post": "create", "delete": "archive"}), name="house-stock"),
    path("house-overview/", views.HouseAssetsViewSet.as_view({"get": "list", "post": "create"}), name="house-overview"),
    path("repair-record", views.RepairRecordViewSet.as_view({"get": "list", "post": "create"}), name="repair-record"),
    path("evaluations/", views.PlanEvaluationViewSet.as_view({"get": "list", "post": "create"}), name="evaluations"),
    path("risk-options/", views.AtRiskOptionViewSet.as_view({"get": "list", "post": ""}), name="risk-options"),




]

# Serve media files only in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)