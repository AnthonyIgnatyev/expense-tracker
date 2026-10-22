from pathlib import Path

OUT_DIR = Path(__file__).resolve().parents[1] / "site" / "images"
OUT_DIR.mkdir(parents=True, exist_ok=True)

categories = [
    ("food", "Продукты", "#dc2626"),
    ("transport", "Транспорт", "#2563eb"),
    ("housing", "Жильё", "#7c3aed"),
    ("utilities", "Коммунальные услуги", "#0891b2"),
    ("health", "Здоровье", "#16a34a"),
    ("sport", "Спорт", "#ea580c"),
    ("clothes", "Одежда", "#db2777"),
    ("entertainment", "Развлечения", "#9333ea"),
    ("cafe", "Кафе и рестораны", "#b45309"),
    ("education", "Образование", "#1d4ed8"),
    ("communication", "Связь и интернет", "#0f766e"),
    ("travel", "Путешествия", "#4338ca"),
]

for slug, title, color in categories:
    initial = title[0]

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="{title}">
  <rect width="400" height="300" rx="24" fill="{color}"/>
  <text x="200" y="145" font-size="96" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="700">{initial}</text>
  <text x="200" y="220" font-size="28" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif">{title}</text>
</svg>
'''

    file_path = OUT_DIR / f"cat-{slug}.svg"
    file_path.write_text(svg, encoding="utf-8")

print(f"Иконки созданы в папке: {OUT_DIR}")