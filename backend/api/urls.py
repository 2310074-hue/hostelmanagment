from django.urls import path
from .views import (
    StudentRegisterView,
    StudentLoginView,
    AdminLoginView,
    ComplaintListCreateView,
    ComplaintDetailView,
    ComplaintStatusUpdateView,
    ComplaintTrackerUpdateView,
    ComplaintVerifyOtpView,
    ComplaintMessageCreateView,
    ComplaintInstructionsUpdateView,
    MessMenuListView,
    MessReviewViewSet,
    MessStatsView,
    MessActionCreateView,
    DashboardStatsView,
    StudentListView,
)

urlpatterns = [
    # Auth
    path('auth/register/', StudentRegisterView.as_view(), name='student-register'),
    path('auth/login/', StudentLoginView.as_view(), name='student-login'),
    path('auth/admin/login/', AdminLoginView.as_view(), name='admin-login'),

    # Complaints
    path('complaints/', ComplaintListCreateView.as_view(), name='complaint-list-create'),
    path('complaints/<int:pk>/', ComplaintDetailView.as_view(), name='complaint-detail'),
    path('complaints/<int:pk>/status/', ComplaintStatusUpdateView.as_view(), name='complaint-status-update'),
    path('complaints/<int:pk>/tracker/', ComplaintTrackerUpdateView.as_view(), name='complaint-tracker-update'),
    path('complaints/<int:pk>/verify-otp/', ComplaintVerifyOtpView.as_view(), name='complaint-verify-otp'),
    path('complaints/<int:pk>/messages/', ComplaintMessageCreateView.as_view(), name='complaint-message-create'),
    path('complaints/<int:pk>/instructions/', ComplaintInstructionsUpdateView.as_view(), name='complaint-instructions-update'),

    # Mess Food & Hygiene Matrix
    path('mess/menu/', MessMenuListView.as_view(), name='mess-menu-list'),
    path('mess/reviews/', MessReviewViewSet.as_view({'get': 'list', 'post': 'create'}), name='mess-reviews'),
    path('mess/stats/', MessStatsView.as_view(), name='mess-stats'),
    path('mess/actions/', MessActionCreateView.as_view(), name='mess-actions'),

    # Dashboard & Students
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('students/', StudentListView.as_view(), name='student-list'),
]
