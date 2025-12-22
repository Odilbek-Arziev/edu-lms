from django.contrib import admin
from .models import *


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "level", "language", "is_active", "start_date", "end_date")
    search_fields = ("title", "description")
    list_filter = ("level", "language", "is_active", "is_public")


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course_title", "is_active", "order")
    search_fields = ("title",)

    def course_title(self, obj):
        return obj.course.title

    course_title.admin_order_field = "course__title"
    course_title.short_description = "Course"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "slug", "is_active", "parent")
    prepopulated_fields = {"slug": ("title",)}
    list_filter = ("is_active",)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("id", "student", "course_title", "status", "progress", "final_grade", "enrolled_at")
    list_filter = ("status", "course")
    search_fields = ("student__username", "course__title")

    def course_title(self, obj):
        return obj.course.title

    course_title.admin_order_field = "course__title"
    course_title.short_description = "Course"


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "module", "is_preview", "order", "slug")
    list_filter = ("is_preview", "module")


@admin.register(LiveSession)
class LiveSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course_title", "scheduled_at", "duration_minutes")
    list_filter = ("course", "scheduled_at")
    search_fields = ("title",)

    def course_title(self, obj):
        return obj.course.title

    course_title.admin_order_field = "course__title"
    course_title.short_description = "Course"


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "lesson", "url")
    search_fields = ("title", "description")


@admin.register(Homework)
class HomeworkAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "lesson", "deadline", "created_at")
    list_filter = ("lesson", "deadline")
    search_fields = ("title",)


@admin.register(HomeworkCriterion)
class HomeworkCriterionAdmin(admin.ModelAdmin):
    list_display = ("id", "text", "homework")
    search_fields = ("text",)


@admin.register(HomeworkSubmission)
class HomeworkSubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "homework_pk", "student", "submitted_at", "is_active", "previous_submission_pk")
    search_fields = ("student__username",)
    list_filter = ("homework",)

    def previous_submission_pk(self, obj):
        return obj.previous_submission_id

    def homework_pk(self, obj):
        return obj.homework_id


@admin.register(SubmissionReview)
class SubmissionReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "received_at", "created_at", "is_accepted", "general_feedback", "submission", "reviewer")
    search_fields = ("reviewer__username",)
    list_filter = ("received_at",)


@admin.register(SubmissionCriterionResult)
class SubmissionCriterionResultAdmin(admin.ModelAdmin):
    list_display = ("id", "criterion_text", "is_met")
    list_filter = ("is_met",)

    def criterion_text(self, obj):
        return obj.criterion.text

    criterion_text.admin_order_field = "criterion__text"
    criterion_text.short_description = "Criterion"


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "url_path", "status", "icon", "parent", "show_groups")
    search_fields = ('title',)

    def show_groups(self, obj):
        return ", ".join(g.name for g in obj.groups.all())

    show_groups.short_description = "Groups"


@admin.register(Icon)
class IconAdmin(admin.ModelAdmin):
    list_display = ("id", "name", 'status')
    search_fields = ('name',)


@admin.register(LanguageLine)
class LanguageLineAdmin(admin.ModelAdmin):
    list_display = ("id", "key", 'value')
    search_fields = ('key',)
