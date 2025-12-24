from rest_framework.pagination import PageNumberPagination


class LanguageLinePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10000

    def get_page_size(self, request):
        page_size = request.query_params.get(self.page_size_query_param)

        if page_size == '-1' or page_size == 'all':
            return None

        if page_size:
            try:
                return min(int(page_size), self.max_page_size)
            except (ValueError, TypeError):
                pass

        return self.page_size
