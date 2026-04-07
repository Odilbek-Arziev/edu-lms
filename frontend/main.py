import re
from pathlib import Path

paths = ['src/Components', 'src/pages/Authentication', 'src/pages/Custom']

pat = re.compile(r't\(\s*([\'"`])(.+?)\1', re.DOTALL)

keys = set()

for base in paths:
    for p in Path(base).rglob('*'):
        if p.suffix not in {'.ts', '.tsx'}:
            continue

        try:
            txt = p.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue

        for m in pat.finditer(txt):
            keys.add(m.group(2))

print('\n'.join(sorted(keys)))