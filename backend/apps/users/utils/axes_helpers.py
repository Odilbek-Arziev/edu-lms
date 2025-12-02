from axes.helpers import get_client_ip_address, get_client_user_agent



def prepare_axes_request(request):
    if not hasattr(request, "axes_ip_address"):
        request.axes_ip_address = get_client_ip_address(request)
    if not hasattr(request, "axes_user_agent"):
        request.axes_user_agent = get_client_user_agent(request)
    if not hasattr(request, "axes_client_str"):
        request.axes_client_str = f"{request.axes_ip_address}-{request.axes_user_agent}"
    return request
