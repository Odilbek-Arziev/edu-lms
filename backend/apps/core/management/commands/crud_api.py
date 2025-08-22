from django.core.management.base import BaseCommand
import importlib


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        app = input('App: ')
        file = input('File Name:')
        model = input('Model:')
        fixtures_count = int(input('Fixtures Count:'))
        type = input('Type (crud: All, c: post, r: get, u: update, d: delete):')

        open(f'apps/{app}/views/{file.lower()}.py', "a")
        view = open(f'apps/{app}/views/{file.lower()}.py', "w")
        if type == 'crud':
            view_template = open('apps/core/management/crud_api/view.txt', "r")
            view.write(view_template.read().format(app=app, file=file, model=model, return_delete='{}'))
        if type == 'r':
            view_template = open('apps/core/management/crud_api/get.txt', "r")
            view.write(view_template.read().format(app=app, file=file, model=model, return_delete='{}'))
        if type == 'c':
            view_template = open('apps/core/management/crud_api/post.txt', "r")
            view.write(view_template.read().format(app=app, file=file, model=model, return_delete='{}'))
        if type == 'u':
            view_template = open('apps/core/management/crud_api/update.txt', "r")
            view.write(view_template.read().format(app=app, file=file, model=model, return_delete='{}'))
        if type == 'd':
            view_template = open('apps/core/management/crud_api/delete.txt', "r")
            view.write(view_template.read().format(app=app, file=file, model=model, return_delete='{}'))

        open(f'apps/{app}/serializers/{file.lower()}.py', "a")
        serializer = open(f'apps/{app}/serializers/{file.lower()}.py', "w")
        serializer_template = open('apps/core/management/crud_api/serializer.txt', "r")
        serializer.write(serializer_template.read().format(app=app, model=model))

        open(f'apps/{app}/querysets/{file.lower()}.py', "a")
        queryset = open(f'apps/{app}/querysets/{file.lower()}.py', "w")
        queryset_template = open('apps/core/management/crud_api/queryset.txt', "r")
        queryset.write(queryset_template.read().format(model=model))

        open(f'apps/{app}/tests/test_{file.lower()}.py', "a")
        test = open(f'apps/{app}/tests/test_{file.lower()}.py', "w")
        test_template = open('apps/core/management/crud_api/tests.txt', "r")
        test.write(test_template.read().format(app=app, model=model.lower(), return_object='{}', kwargs='{"pk": 1}'))

        fixtures = ""
        fixture = open(f'apps/{app}/fixtures/{file.lower()}.yaml', "w")
        for i in range(1, fixtures_count + 2):
            fixture_template = open('apps/core/management/crud_api/fixtures.txt', "r")
            fixtures += fixture_template.read().format(app=app, model=model, pk=i)

            for fields in eval(f'__import__("{app}").models.{model}._meta.fields'):
                tab = '        '
                if fields.name != 'id' \
                        and fields.name != 'created_at' \
                        and fields.name != 'updated_at' \
                        and fields.name != 'created_by' \
                        and fields.name != 'updated_by':
                    if fields.get_internal_type() == 'ForeignKey':
                        fixtures += f'{tab}{fields.name}: 1\n'
                    if fields.get_internal_type() != 'ForeignKey':
                        fixtures += f'{tab}{fields.name}: "Test {i}"\n'

        fixture.write(fixtures)

        url = open(f'apps/{app}/urls.py', "r")
        url_patterns = url.read()
        data = url_patterns.replace(
            'urlpatterns = [',
            f"from {app}.views.{file} import {model}ListView, {model}DetailView\n\n"
            f"urlpatterns = [\n"
            f"    path('{model.lower()}-list', {model}ListView.as_view(), name='{model.lower()}-list'),\n"
            f"    path('{model.lower()}-detail/<int:pk>', {model}DetailView.as_view(), name='{model.lower()}-detail'),"
        )
        new_url = open(f'apps/{app}/urls.py', "w")
        new_url.write(data)

        objects_model = open(f'apps/{app}/models.py', "r")
        objects = objects_model.read()
        object2 = objects.replace(
            f'{model}(BaseModel):',
            f"{model}(BaseModel):\n    "
            f"objects = {model}QuerySet.as_manager()"
        )
        data = object2.replace(
            'from django.db import models',
            f'from django.db import models\n'
            f'from {app}.querysets.{file.lower()} import {model}QuerySet'
        )
        new_model_objects = open(f'apps/{app}/models.py', "w")
        new_model_objects.write(data)
