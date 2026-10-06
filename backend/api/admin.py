from django.contrib import admin
from .models import (
    Student,
    AdminUser,
    Technician,
    Complaint,
    ComplaintMessage,
    MessMenu,
    MessReview,
    MessContractorAction,
)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'full_name', 'email', 'hostel_name', 'room_number', 'created_at')
    search_fields = ('student_id', 'full_name', 'email', 'room_number')
    list_filter = ('hostel_name',)

@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'status', 'created_at')
    list_filter = ('status',)

@admin.register(Technician)
class TechnicianAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'role', 'phone', 'rating', 'jobs_completed')
    list_filter = ('role',)

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'hostel_name', 'room_number', 'priority', 'status', 'tracker_stage', 'created_at')
    list_filter = ('category', 'priority', 'status', 'tracker_stage', 'hostel_name')
    search_fields = ('title', 'description', 'room_number')

@admin.register(ComplaintMessage)
class ComplaintMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'complaint', 'sender_role', 'sender_name', 'is_voice_note', 'created_at')

@admin.register(MessMenu)
class MessMenuAdmin(admin.ModelAdmin):
    list_display = ('day_of_week', 'meal_type', 'estimated_calories')
    list_filter = ('day_of_week', 'meal_type')

@admin.register(MessReview)
class MessReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'hostel_name', 'meal_type', 'overall_score', 'contractor_flagged', 'created_at')
    list_filter = ('hostel_name', 'meal_type', 'contractor_flagged')

@admin.register(MessContractorAction)
class MessContractorActionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'admin_name', 'action_type', 'created_at')
