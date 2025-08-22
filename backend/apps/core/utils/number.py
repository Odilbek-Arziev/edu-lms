import re


def readable_number(amount):
    orig = str(amount)
    new = re.sub(r"^(-?\d+)(\d{3})", r'\g<1> \g<2>', str(amount))
    if orig == new:
        return new
    else:
        return readable_number(new)
