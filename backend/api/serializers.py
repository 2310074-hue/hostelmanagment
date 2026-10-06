from rest_framework import serializers
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

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'student_id', 'full_name', 'email', 'mobile', 'hostel_name', 'room_number', 'created_at']
        extra_kwargs = {'password_hash': {'write_only': True}}

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'full_name', 'email', 'status', 'created_at']
        extra_kwargs = {'password_hash': {'write_only': True}}

class TechnicianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technician
        fields = '__all__'

class ComplaintMessageSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)
    sender = serializers.CharField(source='sender_role')
    senderName = serializers.CharField(source='sender_name')
    text = serializers.CharField(source='message_text')
    isVoiceNote = serializers.BooleanField(source='is_voice_note', default=False)
    audioDuration = serializers.CharField(source='audio_duration', default='0:10')

    class Meta:
        model = ComplaintMessage
        fields = ['id', 'complaint', 'sender', 'senderName', 'text', 'isVoiceNote', 'audioDuration', 'timestamp']

class ComplaintSerializer(serializers.ModelSerializer):
    studentName = serializers.CharField(source='student.full_name', read_only=True)
    studentId = serializers.IntegerField(source='student.id', read_only=True)
    technician = TechnicianSerializer(read_only=True)
    chatMessages = ComplaintMessageSerializer(source='messages', many=True, read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    roomInstructions = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = [
            'id', 'studentId', 'studentName', 'title', 'category', 'description',
            'hostel_name', 'room_number', 'priority', 'status', 'tracker_stage',
            'technician', 'resolution_otp', 'otp_verified', 'admin_response',
            'image_url', 'roomInstructions', 'chatMessages', 'createdAt'
        ]

    def get_roomInstructions(self, obj):
        return {
            'preferredTime': obj.preferred_visit_time,
            'keyStatus': obj.key_status,
            'callBeforeEntry': obj.call_before_entry,
            'notes': obj.entry_notes or '',
        }

class MessMenuSerializer(serializers.ModelSerializer):
    items = serializers.CharField(source='menu_items')
    calories = serializers.CharField(source='estimated_calories')

    class Meta:
        model = MessMenu
        fields = ['id', 'day_of_week', 'meal_type', 'items', 'calories']

class MessReviewSerializer(serializers.ModelSerializer):
    studentName = serializers.CharField(source='student.full_name', read_only=True)
    ratings = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    issues = serializers.JSONField(source='issue_tags', required=False)

    class Meta:
        model = MessReview
        fields = [
            'id', 'student', 'studentName', 'hostel_name', 'meal_type', 'meal_name',
            'review_date', 'ratings', 'overall_score', 'issues', 'comment',
            'image_url', 'contractor_flagged', 'createdAt'
        ]

    def get_ratings(self, obj):
        return {
            'taste': obj.taste_rating,
            'hygiene': obj.hygiene_rating,
            'freshness': obj.freshness_rating,
            'portions': obj.portions_rating,
        }

class MessContractorActionSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = MessContractorAction
        fields = '__all__'
