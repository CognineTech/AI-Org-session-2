from pathlib import Path
import re

root = Path(__file__).resolve().parent
index_text = (root / 'index.html').read_text(encoding='utf-8')
match = re.search(r"const\s+darkSlides\s*=\s*\[(.*?)\];", index_text, re.S)
if not match:
    raise SystemExit('darkSlides not found')

files = re.findall(r"'([^']+\.html)'", match.group(1))

light_css = """
<style id=\"light-version-overrides\">
  body { background: #f4f8ff !important; color: #0f172a !important; }
  .slide-container {
    background:
      radial-gradient(120% 90% at 12% 8%, rgba(59,130,246,.14), transparent 55%),
      radial-gradient(110% 85% at 88% 88%, rgba(45,212,191,.12), transparent 58%),
      #f8fbff !important;
    color: #0f172a !important;
  }
  .gradient-bg {
    background: linear-gradient(-45deg, #eff6ff, #dbeafe, #e0f2fe, #eef2ff, #f8fafc) !important;
    opacity: 1 !important;
  }
  .bg-grid, .mesh-overlay, .bg-dots { opacity: .45 !important; }
  .shape, .glow { opacity: .18 !important; filter: blur(80px) !important; }

  header, h1, h2, h3, h4, .title, .world-title, .comparison-title, .layer-title {
    color: #1d4ed8 !important;
    text-shadow: none !important;
  }

  p, .subtitle, .hsub, .tagline, .cdesc, .task-desc, .comp-line, .layer-desc,
  .points li, .verdict, .conclusion, .node, .tag, .info-panel, .score, .legend {
    color: #334155 !important;
  }

  .panel, .card, .task-card, .baby-card, .learning-world, .comparison, .comp-card,
  .source, .growth-track, .feedback-note, .badge, .live-chip, .learning-state,
  .layer-title-box, .info-panel, .start-card, .conclusion, .example-tag {
    background: rgba(255,255,255,.82) !important;
    border-color: rgba(100,116,139,.28) !important;
    box-shadow: 0 10px 24px rgba(15,23,42,.08) !important;
  }

  .icon-box, .cicon {
    background: rgba(59,130,246,.12) !important;
  }

  .dot, .feature-icon, i {
    filter: saturate(1.05);
  }
</style>
"""

count = 0
for rel in files:
    src = root / rel
    if not src.exists():
        continue

    target = root / f"{src.stem}-light.html"
    text = src.read_text(encoding='utf-8')
    text = re.sub(r'\n<style id="light-version-overrides">[\s\S]*?</style>\n', '\n', text)
    if '</head>' in text:
        text = text.replace('</head>', f"{light_css}\n</head>")
    target.write_text(text, encoding='utf-8')
    count += 1

print(f'generated {count} light slide files')
