from rest_framework import status, views, viewsets
from rest_framework.response import Response
from django.db.models import Avg, Count, Q
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
from .serializers import (
    StudentSerializer,
    AdminUserSerializer,
    TechnicianSerializer,
    ComplaintSerializer,
    ComplaintMessageSerializer,
    MessMenuSerializer,
    MessReviewSerializer,
    MessContractorActionSerializer,
)

# ----------------- AUTHENTICATION VIEWS -----------------
class StudentRegisterView(views.APIView):
    def post(self, request):
        data = request.data
        if Student.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
        if Student.objects.filter(student_id=data.get('studentId')).exists():
            return Response({'error': 'Student ID already registered'}, status=status.HTTP_400_BAD_REQUEST)

        student = Student.objects.create(
            student_id=data.get('studentId'),
            full_name=data.get('fullName'),
            email=data.get('email'),
            password_hash=data.get('password'),
            mobile=data.get('mobile'),
            hostel_name=data.get('hostelName'),
            room_number=data.get('roomNumber')
        )
        return Response({
            'token': f'mock-token-stu-{student.id}',
            'user': StudentSerializer(student).data,
            'role': 'student'
        }, status=status.HTTP_201_CREATED)

class StudentLoginView(views.APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            student = Student.objects.get(email=email, password_hash=password)
            return Response({
                'token': f'mock-token-stu-{student.id}',
                'user': StudentSerializer(student).data,
                'role': 'student'
            })
        except Student.DoesNotExist:
            return Response({'error': 'Invalid student email or password'}, status=status.HTTP_401_UNAUTHORIZED)

class AdminLoginView(views.APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            admin = AdminUser.objects.get(email=email, password_hash=password, status='Active')
            return Response({
                'token': f'mock-token-adm-{admin.id}',
                'user': AdminUserSerializer(admin).data,
                'role': 'admin'
            })
        except AdminUser.DoesNotExist:
            return Response({'error': 'Invalid admin credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# ----------------- COMPLAINT VIEWS -----------------
class ComplaintListCreateView(views.APIView):
    def get(self, request):
        student_id = request.query_params.get('studentId')
        complaints = Complaint.objects.all()
        if student_id:
            complaints = complaints.filter(student_id=student_id)
        serializer = ComplaintSerializer(complaints, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        student_id = data.get('studentId') or request.user.id
        student = Student.objects.get(id=student_id)

        complaint = Complaint.objects.create(
            student=student,
            title=data.get('title'),
            category=data.get('category'),
            description=data.get('description'),
            hostel_name=data.get('hostelName') or student.hostel_name,
            room_number=data.get('roomNumber') or student.room_number,
            priority=data.get('priority', 'Medium'),
            preferred_visit_time=data.get('preferredTime', 'Anytime'),
            key_status=data.get('keyStatus', 'I will be present'),
            call_before_entry=bool(data.get('callBeforeEntry')),
            entry_notes=data.get('entryNotes', '')
        )

        ComplaintMessage.objects.create(
            complaint=complaint,
            sender_role='system',
            sender_name='HCMS Bot',
            message_text=f'Ticket #{complaint.id} registered. A technician will be assigned shortly.'
        )

        return Response(ComplaintSerializer(complaint).data, status=status.HTTP_201_CREATED)

class ComplaintDetailView(views.APIView):
    def get(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
            return Response(ComplaintSerializer(complaint).data)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

class ComplaintStatusUpdateView(views.APIView):
    def put(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
            status_val = request.data.get('status')
            admin_response = request.data.get('adminResponse')

            complaint.status = status_val
            complaint.admin_response = admin_response
            if status_val == 'Resolved':
                complaint.tracker_stage = 'RESOLVED'
                complaint.otp_verified = True
            elif status_val == 'In Progress' and complaint.tracker_stage == 'SUBMITTED':
                complaint.tracker_stage = 'ASSIGNED'

            complaint.save()
            return Response(ComplaintSerializer(complaint).data)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

class ComplaintTrackerUpdateView(views.APIView):
    def put(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
            stage = request.data.get('stage')
            tech_data = request.data.get('technician')

            complaint.tracker_stage = stage
            if tech_data and 'id' in tech_data:
                tech = Technician.objects.filter(id=tech_data['id']).first()
                if tech:
                    complaint.technician = tech

            if stage == 'RESOLVED':
                complaint.status = 'Resolved'
                complaint.otp_verified = True
            elif stage in ['IN_PROGRESS', 'IN_TRANSIT', 'ASSIGNED']:
                complaint.status = 'In Progress'

            complaint.save()

            # Log system event in chat
            ComplaintMessage.objects.create(
                complaint=complaint,
                sender_role='system',
                sender_name='HCMS Tracker',
                message_text=f'Tracker stage updated to {stage}'
            )

            return Response(ComplaintSerializer(complaint).data)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

class ComplaintVerifyOtpView(views.APIView):
    def post(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
            entered_otp = str(request.data.get('otp', '')).strip()

            if str(complaint.resolution_otp).strip() != entered_otp:
                return Response({'error': 'Invalid OTP entered'}, status=status.HTTP_400_BAD_REQUEST)

            complaint.tracker_stage = 'RESOLVED'
            complaint.status = 'Resolved'
            complaint.otp_verified = True
            complaint.admin_response = 'Work verified by student via secure OTP and successfully completed.'
            complaint.save()

            ComplaintMessage.objects.create(
                complaint=complaint,
                sender_role='system',
                sender_name='Security OTP Engine',
                message_text=f'OTP {entered_otp} verified. Complaint marked as Resolved.'
            )

            return Response(ComplaintSerializer(complaint).data)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

class ComplaintMessageCreateView(views.APIView):
    def post(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
            data = request.data
            msg = ComplaintMessage.objects.create(
                complaint=complaint,
                sender_role=data.get('sender', 'student'),
                sender_name=data.get('senderName', 'User'),
                message_text=data.get('text', ''),
                is_voice_note=bool(data.get('isVoiceNote')),
                audio_duration=data.get('audioDuration', '0:10')
            )
            return Response(ComplaintSerializer(complaint).data)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

class ComplaintInstructionsUpdateView(views.APIView):
    def put(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
            data = request.data
            complaint.preferred_visit_time = data.get('preferredTime', 'Anytime')
            complaint.key_status = data.get('keyStatus', 'I will be present')
            complaint.call_before_entry = bool(data.get('callBeforeEntry'))
            complaint.entry_notes = data.get('notes', '')
            complaint.save()
            return Response(ComplaintSerializer(complaint).data)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

# ----------------- MESS MATRIX VIEWS -----------------
class MessMenuListView(views.APIView):
    def get(self, request):
        menus = MessMenu.objects.all()
        result = {}
        for m in menus:
            if m.day_of_week not in result:
                result[m.day_of_week] = {}
            result[m.day_of_week][m.meal_type] = {
                'items': m.menu_items,
                'calories': m.estimated_calories
            }
        return Response(result)

class MessReviewViewSet(viewsets.ModelViewSet):
    queryset = MessReview.objects.all()
    serializer_class = MessReviewSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        hostel = self.request.query_params.get('hostel')
        meal = self.request.query_params.get('meal')
        if hostel and hostel != 'All':
            qs = qs.filter(hostel_name=hostel)
        if meal and meal != 'all':
            qs = qs.filter(meal_type=meal)
        return qs

    def create(self, request, *args, **kwargs):
        data = request.data
        student_id = data.get('studentId') or 1
        student = Student.objects.filter(id=student_id).first()

        taste = int(data.get('taste', 4))
        hygiene = int(data.get('hygiene', 4))
        freshness = int(data.get('freshness', 4))
        portions = int(data.get('portions', 4))
        overall = round((taste + hygiene + freshness + portions) / 4.0, 2)

        issues = data.get('issues', [])
        is_flagged = hygiene <= 2 or taste <= 2 or len(issues) > 0

        review = MessReview.objects.create(
            student=student,
            hostel_name=data.get('hostelName', student.hostel_name if student else 'Ganga Hostel'),
            meal_type=data.get('mealType', 'lunch'),
            meal_name=data.get('mealName', 'Lunch'),
            taste_rating=taste,
            hygiene_rating=hygiene,
            freshness_rating=freshness,
            portions_rating=portions,
            overall_score=overall,
            issue_tags=issues,
            comment=data.get('comment', ''),
            contractor_flagged=is_flagged
        )
        return Response(MessReviewSerializer(review).data, status=status.HTTP_201_CREATED)

class MessStatsView(views.APIView):
    def get(self, request):
        reviews = MessReview.objects.all()
        if not reviews.exists():
            return Response({
                'avgHygiene': 4.5,
                'avgTaste': 4.2,
                'avgOverall': 4.3,
                'totalReviews': 0,
                'flaggedCount': 0,
                'mealBreakdown': {'breakfast': 4.5, 'lunch': 4.0, 'snacks': 4.2, 'dinner': 4.1},
                'actions': []
            })

        avg_hygiene = round(reviews.aggregate(Avg('hygiene_rating'))['hygiene_rating__avg'] or 4.5, 1)
        avg_taste = round(reviews.aggregate(Avg('taste_rating'))['taste_rating__avg'] or 4.2, 1)
        avg_overall = round(reviews.aggregate(Avg('overall_score'))['overall_score__avg'] or 4.3, 1)
        flagged_count = reviews.filter(contractor_flagged=True).count()

        def calc_meal(meal_name):
            m_reviews = reviews.filter(meal_type=meal_name)
            if not m_reviews.exists():
                return 4.0
            return round(m_reviews.aggregate(Avg('overall_score'))['overall_score__avg'] or 4.0, 1)

        actions = MessContractorActionSerializer(MessContractorAction.objects.all()[:10], many=True).data

        return Response({
            'avgHygiene': avg_hygiene,
            'avgTaste': avg_taste,
            'avgOverall': avg_overall,
            'totalReviews': reviews.count(),
            'flaggedCount': flagged_count,
            'mealBreakdown': {
                'breakfast': calc_meal('breakfast'),
                'lunch': calc_meal('lunch'),
                'snacks': calc_meal('snacks'),
                'dinner': calc_meal('dinner'),
            },
            'actions': actions
        })

class MessActionCreateView(views.APIView):
    def post(self, request):
        data = request.data
        action = MessContractorAction.objects.create(
            admin_name=data.get('adminName', 'Chief Warden Office'),
            title=data.get('title'),
            description=data.get('description'),
            action_type=data.get('status', 'Notice Issued to Contractor')
        )
        return Response(MessContractorActionSerializer(action).data, status=status.HTTP_201_CREATED)

# ----------------- DASHBOARD & STUDENTS -----------------
class DashboardStatsView(views.APIView):
    def get(self, request):
        student_id = request.query_params.get('studentId')
        role = request.query_params.get('role', 'admin')

        qs = Complaint.objects.all()
        if student_id:
            qs = qs.filter(student_id=student_id)

        stats_data = {
            'totalComplaints': qs.count(),
            'pending': qs.filter(status='Pending').count(),
            'inProgress': qs.filter(status='In Progress').count(),
            'resolved': qs.filter(status='Resolved').count(),
            'rejected': qs.filter(status='Rejected').count(),
        }

        if role == 'admin':
            stats_data['totalStudents'] = Student.objects.count()

        return Response(stats_data)

class StudentListView(views.APIView):
    def get(self, request):
        students = Student.objects.all()
        return Response(StudentSerializer(students, many=True).data)
