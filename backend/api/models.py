from django.db import models
from django.utils import timezone
import random

def generate_default_otp():
    return str(random.randint(1000, 9999))

class Student(models.Model):
    student_id = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=150, unique=True)
    password_hash = models.CharField(max_length=255)
    mobile = models.CharField(max_length=20)
    hostel_name = models.CharField(max_length=100)
    room_number = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'students'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.student_id}) - Room {self.room_number}"

class AdminUser(models.Model):
    full_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=150, unique=True)
    password_hash = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[('Active', 'Active'), ('Inactive', 'Inactive')],
        default='Active'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admins'

    def __str__(self):
        return f"{self.full_name} ({self.email})"

class Technician(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=5.0)
    jobs_completed = models.IntegerField(default=0)
    avatar_url = models.CharField(max_length=500, blank=True, null=True)
    specialty = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'technicians'

    def __str__(self):
        return f"{self.name} - {self.role}"

class Complaint(models.Model):
    CATEGORY_CHOICES = [
        ('Electricity', 'Electricity'),
        ('Water', 'Water'),
        ('Cleaning', 'Cleaning'),
        ('Food', 'Food'),
        ('Maintenance', 'Maintenance'),
        ('Wi-Fi', 'Wi-Fi'),
        ('Security', 'Security'),
        ('Other', 'Other'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
        ('Rejected', 'Rejected'),
    ]

    STAGE_CHOICES = [
        ('SUBMITTED', 'Complaint Filed'),
        ('ASSIGNED', 'Technician Assigned'),
        ('IN_TRANSIT', 'En Route / In Transit'),
        ('IN_PROGRESS', 'Fixing in Progress'),
        ('RESOLVED', 'OTP Verified & Closed'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='complaints')
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    hostel_name = models.CharField(max_length=100)
    room_number = models.CharField(max_length=50)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    tracker_stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default='SUBMITTED')
    technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name='complaints')
    resolution_otp = models.CharField(max_length=10, default=generate_default_otp)
    otp_verified = models.BooleanField(default=False)
    admin_response = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='complaints/', blank=True, null=True)
    image_url = models.CharField(max_length=500, blank=True, null=True)
    preferred_visit_time = models.CharField(max_length=100, default='Anytime')
    key_status = models.CharField(max_length=100, default='I will be present')
    call_before_entry = models.BooleanField(default=False)
    entry_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'complaints'
        ordering = ['-created_at']

    def __str__(self):
        return f"#{self.id} {self.title} - {self.status}"

class ComplaintMessage(models.Model):
    SENDER_CHOICES = [
        ('student', 'Student'),
        ('admin', 'Admin / Staff'),
        ('system', 'System Bot'),
    ]

    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='messages')
    sender_role = models.CharField(max_length=20, choices=SENDER_CHOICES)
    sender_name = models.CharField(max_length=150)
    message_text = models.TextField()
    is_voice_note = models.BooleanField(default=False)
    audio_duration = models.CharField(max_length=20, default='0:10')
    audio_url = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'complaint_messages'
        ordering = ['created_at']

    def __str__(self):
        return f"Msg by {self.sender_name} on #{self.complaint_id}"

class MessMenu(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]

    MEAL_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('snacks', 'Snacks'),
        ('dinner', 'Dinner'),
    ]

    day_of_week = models.CharField(max_length=20, choices=DAY_CHOICES)
    meal_type = models.CharField(max_length=20, choices=MEAL_CHOICES)
    menu_items = models.TextField()
    estimated_calories = models.CharField(max_length=50, default='650 kcal')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'mess_menus'
        unique_together = ('day_of_week', 'meal_type')

    def __str__(self):
        return f"{self.day_of_week} - {self.meal_type}"

class MessReview(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='mess_reviews')
    hostel_name = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=20)
    meal_name = models.CharField(max_length=200)
    review_date = models.DateField(default=timezone.now)
    taste_rating = models.IntegerField(default=4)
    hygiene_rating = models.IntegerField(default=4)
    freshness_rating = models.IntegerField(default=4)
    portions_rating = models.IntegerField(default=4)
    overall_score = models.DecimalField(max_digits=3, decimal_places=2)
    issue_tags = models.JSONField(default=list, blank=True)
    comment = models.TextField(blank=True, null=True)
    image_url = models.CharField(max_length=500, blank=True, null=True)
    contractor_flagged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mess_reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.meal_name} - {self.overall_score}★ by {self.student.full_name}"

class MessContractorAction(models.Model):
    admin_name = models.CharField(max_length=150)
    title = models.CharField(max_length=255)
    description = models.TextField()
    action_type = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mess_contractor_actions'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.action_type})"
