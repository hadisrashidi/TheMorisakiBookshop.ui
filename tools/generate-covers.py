# Regenerates the book covers and author portraits under public/.
#
# These are designed placeholders, not the publishers' real cover art:
# each one typesets the book's actual Persian title and its author in the
# site's own fonts (Vazirmatn / Figtree) over palette-matched artwork. If
# you have real cover files, just drop them into public/covers with the
# same filenames — nothing else needs to change.
#
# Run:  python3 tools/generate-covers.py
# Needs: pip install Pillow fonttools brotli
#        (Pillow must be built with libraqm, or Persian will not shape)
#
# It rewrites the Image field of every record in the API repo's
# Data/Books.json and Data/Authors.json to point at what it produced.
import json, os, hashlib
from PIL import Image, ImageDraw, ImageFont

UI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = os.environ.get('API_REPO', os.path.join(os.path.dirname(UI), 'TheMorisakiBookshop.api'))
# Extracted from the @fontsource woff2 already in node_modules.
FONTS = os.path.join(UI, 'tools', '.fonts')
COVERS = os.path.join(UI, 'public', 'covers')
PORTRAITS = os.path.join(UI, 'public', 'authors')
os.makedirs(COVERS, exist_ok=True)
os.makedirs(PORTRAITS, exist_ok=True)
os.makedirs(FONTS, exist_ok=True)


def ensure_fonts():
    """woff2 ships in node_modules; PIL needs plain TTF."""
    from fontTools.ttLib import TTFont
    want = [('vazirmatn', 'arabic', '400'), ('vazirmatn', 'arabic', '700'),
            ('figtree', 'latin', '400'), ('figtree', 'latin', '600')]
    for fam, subset, wt in want:
        dest = os.path.join(FONTS, f'{fam}-{wt}.ttf')
        if os.path.exists(dest):
            continue
        src = os.path.join(UI, 'node_modules', '@fontsource', fam, 'files',
                           f'{fam}-{subset}-{wt}-normal.woff2')
        f = TTFont(src)
        f.flavor = None
        f.save(dest)


ensure_fonts()

W, H = 600, 800          # 2x the display size (300x400) for crisp retina
SCALE = 2

# Cover schemes drawn from the organic palette in src/styles.scss.
# art is the large shape behind the type panel and is deliberately well
# clear of bg, so every cover reads as designed rather than flat.
SCHEMES = [
    dict(bg='#2f3b2a', panel='#e7ddc6', ink='#2f3b2a', accent='#9db178', art='#7a8a5e'),
    dict(bg='#7c3f1d', panel='#f2e4d0', ink='#5e2f14', accent='#e2a173', art='#c67139'),
    dict(bg='#e7d7bd', panel='#c67139', ink='#f7efe2', accent='#8f4f26', art='#7a8a5e'),
    dict(bg='#3d3a34', panel='#ddd6c4', ink='#3d3a34', accent='#d59463', art='#a8663c'),
    dict(bg='#5c6b45', panel='#eee7d4', ink='#3f4a2e', accent='#c9d6a8', art='#3f4a2e'),
    dict(bg='#a8663c', panel='#f5ead8', ink='#6f3f22', accent='#f0c9a4', art='#5e2f14'),
]


def h2i(c):
    c = c.lstrip('#')
    return tuple(int(c[i:i+2], 16) for i in (0, 2, 4))


def rnd(seed, salt, lo, hi):
    d = hashlib.md5((seed + salt).encode()).hexdigest()
    return lo + int(d[:8], 16) % (hi - lo + 1)


def is_fa(text):
    return any('\u0600' <= ch <= '\u06ff' for ch in text)


def measure(draw, text, font):
    # Pillow is built with libraqm here, so it shapes and reorders
    # Persian itself — the text must be passed through untouched.
    return draw.textlength(text, font=font, direction='rtl' if is_fa(text) else 'ltr')


def centre(draw, text, font, y, fill):
    d = 'rtl' if is_fa(text) else 'ltr'
    x = (W - draw.textlength(text, font=font, direction=d)) / 2
    draw.text((x, y), text, font=font, fill=fill, direction=d)


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ''
    for w in words:
        trial = (cur + ' ' + w).strip()
        if measure(draw, trial, font) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def cover(seed, title, author):
    s = SCHEMES[rnd(seed, 'scheme', 0, len(SCHEMES) - 1)]
    bg, panel, ink, accent, art = map(h2i, (s['bg'], s['panel'], s['ink'], s['accent'], s['art']))
    img = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(img)

    style = rnd(seed, 'art', 0, 4)
    m = 56                                   # panel margin
    if style == 0:                           # rising sun
        d.ellipse([W//2 - 210, -170, W//2 + 210, 250], fill=art)
    elif style == 1:                         # horizon bands
        d.rectangle([0, 190, W, 300], fill=art)
        d.rectangle([0, H - 190, W, H], fill=art)
    elif style == 2:                         # corner wedge
        d.polygon([(0, 0), (W, 0), (0, 400)], fill=art)
    elif style == 3:                         # stacked rules
        for i in range(6):
            d.rectangle([m, 90 + i * 26, W - m, 96 + i * 26], fill=art)
        d.rectangle([m, H - 170, W - m, H - 164], fill=art)
    else:                                    # column
        d.rectangle([W - 210, 0, W - 90, H], fill=art)
        d.ellipse([W - 230, 120, W - 70, 280], fill=accent)

    # Type panel
    py0, py1 = 300, H - 250
    d.rectangle([m, py0, W - m, py1], fill=panel)

    f_title = ImageFont.truetype(f'{FONTS}/vazirmatn-700.ttf', 46)
    f_author = ImageFont.truetype(f'{FONTS}/vazirmatn-400.ttf', 28)
    f_author_lat = ImageFont.truetype(f'{FONTS}/figtree-400.ttf', 28)

    inner = W - 2 * m - 56
    lines = wrap(d, title, f_title, inner)[:4]
    total = len(lines) * 58
    y = py0 + ((py1 - py0) - total) // 2 - 22
    for ln in lines:
        centre(d, ln, f_title, y, ink)
        y += 58

    # Author, under a short rule
    d.rectangle([W//2 - 40, y + 16, W//2 + 40, y + 19], fill=accent)
    centre(d, author, f_author if is_fa(author) else f_author_lat, y + 36, accent)

    # Spine edge + border
    d.rectangle([0, 0, 16, H], fill=accent)
    d.rectangle([0, 0, W - 1, H - 1], outline=ink, width=3)
    return img


def portrait(seed, name):
    s = SCHEMES[rnd(seed, 'scheme', 0, len(SCHEMES) - 1)]
    bg, panel, ink, accent = map(h2i, (s['bg'], s['panel'], s['ink'], s['accent']))
    S = 400
    img = Image.new('RGB', (S, S), panel)
    d = ImageDraw.Draw(img)
    d.ellipse([S//2 - 78, 78, S//2 + 78, 234], fill=accent)          # head
    d.pieslice([S//2 - 150, 250, S//2 + 150, 560], 180, 360, fill=bg)  # shoulders

    initials = ' '.join(w[0] for w in name.split()[:2])
    persian = is_fa(name)
    f = ImageFont.truetype(f'{FONTS}/{"vazirmatn-700" if persian else "figtree-600"}.ttf', 64)
    dirn = 'rtl' if persian else 'ltr'
    x = (S - d.textlength(initials, font=f, direction=dirn)) / 2
    d.text((x, 118), initials, font=f, fill=panel, direction=dirn)
    return img


books = json.load(open(f'{API}/Data/Books.json', encoding='utf-8'))
authors = json.load(open(f'{API}/Data/Authors.json', encoding='utf-8'))
by_id = {a['Id']: a['Name'] for a in authors}

for b in books:
    seed = os.path.splitext(os.path.basename(b['Image']))[0]
    name = by_id.get(b.get('AuthorId'), '')
    cover(seed, b['Title'], name).save(f'{COVERS}/{seed}.png', optimize=True)
    b['Image'] = f'/covers/{seed}.png'

for a in authors:
    seed = os.path.splitext(os.path.basename(a['Image']))[0]
    portrait(seed, a['Name']).save(f'{PORTRAITS}/{seed}.png', optimize=True)
    a['Image'] = f'/authors/{seed}.png'

json.dump(books, open(f'{API}/Data/Books.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
json.dump(authors, open(f'{API}/Data/Authors.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

cover('fallback', 'کتابفروشی موریساکی', '').save(f'{UI}/public/cover-placeholder.png', optimize=True)

# Drop the abstract SVGs these replace.
for folder in (COVERS, PORTRAITS):
    for f in os.listdir(folder):
        if f.endswith('.svg'):
            os.remove(os.path.join(folder, f))
if os.path.exists(f'{UI}/public/cover-placeholder.svg'):
    os.remove(f'{UI}/public/cover-placeholder.svg')

print(f'{len(books)} covers, {len(authors)} portraits')
