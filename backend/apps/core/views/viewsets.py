from rest_framework.viewsets import ModelViewSet


class BaseModelViewSet(ModelViewSet):
    """
    Base ViewSet for models that inherit BaseModel.
    Automatically sets created_by and updated_by.
    """

    def perform_create(self, serializer):
        if hasattr(serializer.Meta.model, "created_by"):
            serializer.save(created_by=self.request.user)
        else:
            serializer.save()

    def perform_update(self, serializer):
        if hasattr(serializer.Meta.model, "updated_by"):
            serializer.save(updated_by=self.request.user)
        else:
            serializer.save()
