from django.contrib import admin
from .models import (
    Course, Module, Category, Enrollment,
    Lesson, LiveSession, Material,
    Homework, HomeworkCriterion, HomeworkSubmission,
    SubmissionCriterionResult
)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "level", "language", "is_active", "start_date", "end_date")
    search_fields = ("title", "description")
    list_filter = ("level", "language", "is_active", "is_public")


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course__title", "is_active", "order")
    search_fields = ("title",)
    list_filter = ("is_active",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "slug", "is_active", "parent")
    prepopulated_fields = {"slug": ("title",)}
    list_filter = ("is_active",)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("id", "student", "course__title", "status", "progress", "final_grade", "enrolled_at")
    list_filter = ("status", "course")
    search_fields = ("student__username", "course__title")


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "module", "is_preview", "order", "slug")
    list_filter = ("is_preview", "module")


@admin.register(LiveSession)
class LiveSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course__title", "student", "scheduled_at", "duration_minutes")
    list_filter = ("course", "scheduled_at")
    search_fields = ("title",)


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "lesson", "url")
    search_fields = ("title", "description")


@admin.register(Homework)
class HomeworkAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "lesson", "deadline")
    list_filter = ("lesson", "deadline")
    search_fields = ("title",)


@admin.register(HomeworkCriterion)
class HomeworkCriterionAdmin(admin.ModelAdmin):
    list_display = ("id", "text", "homework")
    search_fields = ("text",)


@admin.register(HomeworkSubmission)
class HomeworkSubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "homework", "student", "submitted_at")
    search_fields = ("student__username",)
    list_filter = ("homework",)


@admin.register(SubmissionCriterionResult)
class SubmissionCriterionResultAdmin(admin.ModelAdmin):
    list_display = ("id", "submission__homework__title", "criterion__text", "is_met")
    list_filter = ("is_met",)
