from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.category import CategoryViewSet
from .views.course import CourseViewSet
from .views.enrollment import EnrollmentViewSet
from .views.homework import HomeworkViewSet
from .views.homework_criterion import HomeworkCriterionViewSet
from .views.homework_submission import HomeworkSubmissionViewSet
from .views.lesson import LessonViewSet
from .views.live_session import LiveSessionViewSet
from .views.material import MaterialViewSet
from .views.menu import MenuViewSet
from .views.module import ModuleViewSet
from .views.roles import RoleViewSet
from .views.submission_criterion import SubmissionCriterionViewSet
from .views.submission_review import SubmissionReviewViewSet

router = DefaultRouter()

router.register(r"categories", CategoryViewSet, basename='category')
router.register(r"courses", CourseViewSet, basename='course')
router.register(r"enrollments", EnrollmentViewSet, basename='enrollment')
router.register(r"modules", ModuleViewSet, basename='module')
router.register(r"lessons", LessonViewSet, basename='lesson')
router.register(r"live_sessions", LiveSessionViewSet, basename='live_session')
router.register(r"materials", MaterialViewSet, basename='material')
router.register(r"homeworks", HomeworkViewSet, basename='homework')
router.register(r"homework_criterion", HomeworkCriterionViewSet, basename='homework_criterion')
router.register(r"homework_submissions", HomeworkSubmissionViewSet, basename='homework_submission')
router.register(r"submission_criterion_results", SubmissionCriterionViewSet, basename='submission_criterion')
router.register(r"submission_reviews", SubmissionReviewViewSet, basename='submission_review')
router.register(r"menu", MenuViewSet, basename='menu')
router.register(r"roles", RoleViewSet, basename='roles')

urlpatterns = [
    path("", include(router.urls)),
]
