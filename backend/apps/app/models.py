from django.db import models
from core.models import BaseModel
from django.utils.text import slugify

from app.querysets.category import CategoryQuerySet
from app.querysets.module import ModuleQuerySet
from app.querysets.course import CourseQuerySet
from app.querysets.enrollment import EnrollmentQuerySet
from app.querysets.lesson import LessonQuerySet
from app.querysets.live_session import LiveSessionQuerySet
from app.querysets.material import MaterialQuerySet
from app.querysets.homework import HomeworkQuerySet
from app.querysets.homework_submission import HomeworkSubmissionQuerySet
from app.querysets.homework_criterion import HomeworkCriterionQuerySet
from app.querysets.submission_criterion import SubmissionCriterionResultQuerySet
from app.querysets.submission_review import SubmissionReviewQueryset
from app.querysets.menu import MenuQuerySet

LEVEL_CHOICES = [
    ('beginner', 'Beginner'),
    ('intermediate', 'Intermediate'),
    ('advanced', 'Advanced')
]

LANGUAGE_CHOICES = [
    ('ru', 'Русский'),
    ('eng', 'English'),
    ('uz', 'O`zbekcha')
]

ENROLLMENT_STATUS_CHOICES = [
    ('active', 'Active'),
    ('completed', 'Завершен'),
    ('suspended', 'Приостановлено'),
    ('dropped', 'Отчислен')
]


class Course(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    author = models.ForeignKey('users.CustomUser', on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)
    duration = models.PositiveSmallIntegerField()
    slug = models.SlugField(unique=True, null=True, blank=True)
    level = models.CharField(max_length=255, choices=LEVEL_CHOICES, default="beginner")
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_public = models.BooleanField(default=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    objects = CourseQuerySet.as_manager()

    category = models.ForeignKey('app.Category', on_delete=models.SET_NULL, null=True, blank=True)
    students = models.ManyToManyField(
        'users.CustomUser',
        through="Enrollment",
        through_fields=("course", "student"),
        related_name="courses"
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Module(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True, null=True, blank=True)
    objects = ModuleQuerySet.as_manager()

    course = models.ForeignKey('app.Course', on_delete=models.CASCADE)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.title} ({self.course.title})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Category(BaseModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    objects = CategoryQuerySet.as_manager()

    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Enrollment(BaseModel):
    enrolled_at = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=255, choices=ENROLLMENT_STATUS_CHOICES, default='active')
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    final_grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    objects = EnrollmentQuerySet.as_manager()

    course = models.ForeignKey('app.Course', on_delete=models.CASCADE, related_name="course_enrollments")
    student = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name="user_enrollments")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['student', 'course'], name='unique_student_course'),
        ]

    def __str__(self):
        return f"{self.student.first_name} {self.student.last_name} - {self.course.title}"


class Lesson(BaseModel):
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_preview = models.BooleanField(default=False)
    slug = models.SlugField(unique=True, null=True, blank=True)
    objects = LessonQuerySet.as_manager()

    module = models.ForeignKey('app.Module', on_delete=models.CASCADE, related_name='lessons')

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.module.title} - {self.title}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class LiveSession(BaseModel):
    title = models.CharField(max_length=255)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=120)
    link = models.URLField()
    objects = LiveSessionQuerySet.as_manager()

    students = models.ManyToManyField('users.CustomUser', related_name='live_sessions')
    course = models.ForeignKey('app.Course', on_delete=models.CASCADE, related_name='live_sessions')


class Material(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField(blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)
    objects = MaterialQuerySet.as_manager()

    lesson = models.ForeignKey('app.Lesson', on_delete=models.CASCADE, related_name='materials')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Homework(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    deadline = models.DateField(null=True, blank=True)
    max_attempts = models.PositiveSmallIntegerField(default=5)
    objects = HomeworkQuerySet.as_manager()

    lesson = models.ForeignKey('app.Lesson', on_delete=models.CASCADE, related_name='homeworks')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['lesson', 'title'], name='unique_lesson_homework_title')
        ]

    def __str__(self):
        return self.title

    def can_submit(self, student):
        attempts = self.submissions.filter(student=student).count()
        return attempts < self.max_attempts


class HomeworkCriterion(BaseModel):
    text = models.TextField()
    objects = HomeworkCriterionQuerySet.as_manager()

    homework = models.ForeignKey('app.Homework', on_delete=models.CASCADE, related_name='criteria')

    def __str__(self):
        return self.text


class HomeworkSubmission(BaseModel):
    file = models.FileField(upload_to='homeworks/', null=True, blank=True)
    comment_from_student = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    objects = HomeworkSubmissionQuerySet.as_manager()

    homework = models.ForeignKey('app.Homework', on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='homework_submissions')
    previous_submission = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, related_name='resubmissions'
    )

    def __str__(self):
        return f"{self.student.first_name} {self.student.last_name} - {self.homework} - {self.is_active}"

    @property
    def is_checked(self):
        return self.review.exists()

    @property
    def is_approved(self):
        return self.review.filter(is_accepted=True).exists()


class SubmissionReview(BaseModel):
    received_at = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)
    general_feedback = models.TextField()
    objects = SubmissionReviewQueryset.as_manager()

    submission = models.OneToOneField(
        'app.HomeworkSubmission',
        on_delete=models.CASCADE,
        related_name='review',
        limit_choices_to={'is_active': True}
    )
    reviewer = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='checked_homeworks')

    def __str__(self):
        return f"Review of {self.submission} by {self.reviewer}"


class SubmissionCriterionResult(BaseModel):
    is_met = models.BooleanField(default=False)
    feedback = models.TextField(null=True, blank=True)
    objects = SubmissionCriterionResultQuerySet.as_manager()

    criterion = models.ForeignKey('app.HomeworkCriterion', on_delete=models.CASCADE)
    review = models.ForeignKey('app.SubmissionReview', on_delete=models.CASCADE, related_name='criteria_results',
                               null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['review', 'criterion'], name='unique_review_criterion')
        ]


class Menu(BaseModel):
    title = models.CharField(max_length=255)
    url_path = models.CharField(max_length=255)
    status = models.BooleanField(default=True)
    objects = MenuQuerySet.as_manager()

    icon = models.ForeignKey('app.Icon', on_delete=models.CASCADE, null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    groups = models.ManyToManyField('auth.Group', blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['title', 'url_path'], name='unique_menu')
        ]

    def __str__(self):
        return self.title


class Icon(BaseModel):
    name = models.CharField(max_length=255)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class LanguageLine(BaseModel):
    key = models.CharField(max_length=255, unique=True, db_index=True)
    value = models.JSONField()

    def __str__(self):
        return self.key
