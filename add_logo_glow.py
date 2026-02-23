import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# Pattern 1: .logo-overlay img { ... } — update img block
logo_overlay_img_pattern = re.compile(
    r'([ \t]*)\.logo-overlay\s+img\s*\{([^}]*?)\}',
    re.DOTALL
)

# Pattern 2: .logo img { ... } — update img block (minified single-line)
logo_img_pattern = re.compile(
    r'(\.logo\s+img\s*\{)([^}]*?)(\})'
)

GLOW = 'filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.22)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.12));'

updated_files = []
skipped_files = []

for filename in sorted(html_files):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # Handle .logo-overlay img
    def replace_overlay_img(match):
        indent = match.group(1)
        body = match.group(2)
        if 'drop-shadow' in body:
            return match.group(0)  # already has glow
        body = body.rstrip()
        if not body.endswith(';'):
            body += ';'
        body += f'\n{indent}    {GLOW}'
        return f'{indent}.logo-overlay img {{{body}\n{indent}}}'

    new_content, count1 = logo_overlay_img_pattern.subn(replace_overlay_img, content)
    if count1 > 0:
        changed = True
        content = new_content

    # Handle .logo img (minified, single-line)
    def replace_logo_img(match):
        open_brace = match.group(1)
        body = match.group(2)
        close_brace = match.group(3)
        if 'drop-shadow' in body:
            return match.group(0)  # already has glow
        body = body.rstrip()
        if not body.endswith(';'):
            body += ';'
        glow_mini = 'filter:drop-shadow(0 0 10px rgba(255,255,255,0.22)) drop-shadow(0 0 4px rgba(255,255,255,0.12))'
        body += glow_mini
        return f'{open_brace}{body}{close_brace}'

    new_content, count2 = logo_img_pattern.subn(replace_logo_img, content)
    if count2 > 0:
        changed = True
        content = new_content

    if changed:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        updated_files.append(filename)
        print(f"  [UPDATED] {filename}")
    else:
        skipped_files.append(filename)
        print(f"  [SKIPPED] {filename}")

print(f"\n✅ Total files updated : {len(updated_files)}")
print(f"⚠️  Total files skipped : {len(skipped_files)}")
