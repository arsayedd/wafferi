#!/usr/bin/env python3
"""Download unique Wikimedia Commons product photos (not store PDP scrapes)."""
from __future__ import annotations

import json
import subprocess
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "product-photos"
POOL = OUT / "pool"
UA = {"User-Agent": "WaffariCatalog/1.0 (educational bridal planner; product reference thumbs)"}

# Exact Commons file titles → catalog product id. Each file used once.
FEATURED: list[tuple[str, str]] = [
    ("lg-washer-8", "LG washing machines.jpg"),
    ("lg-washer-10", "Front loader Washing machine.jpg"),
    ("samsung-fridge-18", "SAMSUNG REFRIGERATOR RF60J9030WZ.jpg"),
    ("toshiba-fridge-16", "Open refrigerator with food at night.jpg"),
    ("sharp-ac-15", "Air Conditioner 1.jpg"),
    ("carrier-ac-225", "CARRIER AIR CONDITIONER INDOOR UNIT.jpg"),
    ("gree-ac-15", "CARRIER AIR CONDITIONER INDOOR UNIT (2).jpg"),
    ("unionaire-stove", "Gas stove.jpg"),
    ("bosch-dishwasher", "Bosch Dishwasher 2026-08-23 1.jpg"),
    ("beko-washer-7", "Open top-loading washing machine.jpg"),
    ("hoover-vacuum", "Numatic Henry vacuum cleaner (3308986870) (cropped).jpg"),
    ("fresh-heater", "PALOMA GAS WATER HEATER.jpg"),
    ("lg-tv-55", "Sony Bravia 52 inch lcd.jpg"),
    ("kenwood-mixer", "KenwoodConcertSmoothieMaker.JPG"),
    ("toshiba-microwave", "Panasonic NN-SD69LS 20220410.jpg"),
    ("tefal-iron", "Teal and white electric steam iron - side view.jpg"),
    ("bedroom-oak", "Berlin Villa Borsig Tegel asv2019-08 img09.jpg"),
    ("velvet-sofa", "EFTA00001018 - Richly decorated library with a vibrant teal velvet sofa ornate bookshelves and a wooden coffee table in a cozy setting.jpg"),
    ("dining-6", "HK CWB Causeway Bay 柏寧酒店 Park Lane 地庫 basement shop 宜家傢具 IKEA furniture round table n chairs March 2019 SSG 09.jpg"),
    ("tefal-pots", "Pans (113563802).jpg"),
    ("cotton-duvet", "Comforter on bed.jpg"),
    ("towel-set", "Zusammengelegte Handtücher.jpg"),
    ("crystal-chandelier", "A crystal chandelier in B&W.jpg"),
    ("philips-airfryer", "Air Fryer 2020.jpg"),
    ("tornado-fan-18", "Hatari 18 inch fan.jpg"),
    ("samsung-soundbar", "Home Theater Speakers 1 2019-06-22.jpg"),
    ("water-dispenser-fresh", "Clickon Water Dispenser.jpg"),
    ("remington-dryer", "Braun hair dryer.jpg"),
    ("robot-vacuum-tuya", "Reinigungsroboter tcm 100.JPG"),
    ("kettle-kenwood", "2023 Czajnik elektryczny Bosch (1).jpg"),
    ("bridal-dress", "Weddingdress2024.jpg"),
    ("bridal-abaya", "Islamic Clothing Abaya.jpg"),
    ("bride-slippers", "Slippers.jpg"),
    ("zircon-set", "England, 19th century - Parure- Necklace, Pendant, Earrings - 2001.156 - Cleveland Museum of Art.jpg"),
    ("bath-towels-8", "Towel and small towel.jpg"),
    ("water-dispenser-fresh-alt", "Water-dispenser-aqua-clara-1.jpg"),
]

# Extra unique files if featured titles fail / for TV, blender, freezer, bag, perfume, stove, AC
FALLBACKS: dict[str, list[str]] = {
    "lg-tv-55": [
        "Flat-screen television.jpg",
        "LCD television.jpg",
        "Sony Bravia 52 inch lcd.jpg",
        "Television set.jpg",
    ],
    "braun-mixer": [
        "Immersion blender.jpg",
        "Hand blender.jpg",
        "Stabmixer.jpg",
    ],
    "fresh-freezer-5": [
        "Chest freezer.jpg",
        "Deep freezer.jpg",
        "Gefriertruhe.jpg",
    ],
    "evening-bag": [
        "Clutch purse.jpg",
        "Evening bag.jpg",
        "Handbag.jpg",
    ],
    "lattafa-perfume": [
        "Perfume bottle.jpg",
        "Chanel No 5.jpg",
        "Perfume.jpg",
    ],
    "cotton-pajamas": [
        "Pyjamas.jpg",
        "Pajamas.jpg",
        "Sleepwear.jpg",
    ],
    "kids-pajamas": [
        "Children clothing.jpg",
        "Kids clothes.jpg",
    ],
    "women-galabiya": [
        "Galabeya.jpg",
        "Djellaba.jpg",
        "Kaftan.jpg",
    ],
    "men-galabiya": [
        "Thawb.jpg",
        "Jellabiya.jpg",
        "Men in galabeya.jpg",
    ],
    "kitchen-linens": [
        "Kitchen towel.jpg",
        "Tea towel.jpg",
        "Dishcloth.jpg",
    ],
    "unionaire-stove": ["Gas stove.jpg", "Kitchen stove.jpg", "Gas range.jpg"],
    "sharp-ac-15": ["Split air conditioner.jpg", "Air conditioner indoor unit.jpg", "Air Conditioner 1.jpg"],
    "velvet-sofa": [
        "Green sofa.jpg",
        "Velvet sofa.jpg",
        "Couch.jpg",
    ],
    "dining-6": [
        "Dining table.jpg",
        "Wooden dining table.jpg",
    ],
    "bedroom-oak": [
        "Bedroom.jpg",
        "Wooden bed.jpg",
        "Wardrobe.jpg",
    ],
    "crystal-chandelier": [
        "Chandelier.jpg",
        "Crystal chandelier.jpg",
    ],
    "bridal-dress": [
        "Wedding dress.jpg",
        "White wedding dress.jpg",
        "Bridal gown.jpg",
    ],
    "lg-washer-10": ["Front loader Washing machine.jpg"],
}

POOL_FILES: list[tuple[str, str]] = [
    ("washers-0", "Front loader Washing machine.jpg"),
    ("washers-1", "LG washing machines.jpg"),
    ("washers-2", "Open top-loading washing machine.jpg"),
    ("fridges-0", "SAMSUNG REFRIGERATOR RF60J9030WZ.jpg"),
    ("fridges-1", "Open refrigerator with food at night.jpg"),
    ("acs-0", "CARRIER AIR CONDITIONER INDOOR UNIT.jpg"),
    ("acs-1", "Air Conditioner 1.jpg"),
    ("stoves-0", "Gas stove.jpg"),
    ("dishwashers-0", "Bosch Dishwasher 2026-08-23 1.jpg"),
    ("dishwashers-1", "Dishwasher with dishes.JPG"),
    ("vacuums-0", "Numatic Henry vacuum cleaner (3308986870) (cropped).jpg"),
    ("vacuums-1", "Reinigungsroboter tcm 100.JPG"),
    ("heaters-0", "PALOMA GAS WATER HEATER.jpg"),
    ("heaters-1", "NORITZ GAS WATER HEATERS.jpg"),
    ("tvs-0", "Panasonic NN-SD69LS 20220410.jpg"),
    ("audio-0", "LG LAS260B Soundbar.jpg"),
    ("audio-1", "Home Theater Speakers 1 2019-06-22.jpg"),
    ("small-appliances-0", "KenwoodConcertSmoothieMaker.JPG"),
    ("small-appliances-1", "Air Fryer 2020.jpg"),
    ("small-appliances-2", "Panasonic NN-SD69LS 20220410.jpg"),
    ("small-appliances-3", "Teal and white electric steam iron - side view.jpg"),
    ("small-appliances-4", "2023 Czajnik elektryczny Bosch (1).jpg"),
    ("personal-care-0", "Braun hair dryer.jpg"),
    ("bedroom-0", "Berlin Villa Borsig Tegel asv2019-08 img09.jpg"),
    ("living-0", "Comforter on bed.jpg"),
    ("kitchen-tools-0", "Pans (113563802).jpg"),
    ("textiles-0", "Zusammengelegte Handtücher.jpg"),
    ("textiles-1", "Comforter on bed.jpg"),
    ("decor-0", "Chandelier.jpg"),
    ("fans-0", "Hatari 18 inch fan.jpg"),
    ("water-0", "Clickon Water Dispenser.jpg"),
    ("freezers-0", "Open refrigerator with food at night.jpg"),
    ("bridal-wear-0", "Islamic Clothing Abaya.jpg"),
    ("shoes-0", "Slippers.jpg"),
    ("jewelry-0", "England, 19th century - Parure- Necklace, Pendant, Earrings - 2001.156 - Cleveland Museum of Art.jpg"),
    ("bathroom-0", "Towel and small towel.jpg"),
]


def api(params: dict) -> dict:
    u = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(u, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as res:
        return json.load(res)


def imageinfo(titles: list[str]) -> dict[str, str]:
    found: dict[str, str] = {}
    for i in range(0, len(titles), 40):
        chunk = titles[i : i + 40]
        time.sleep(0.4)
        data = api(
            {
                "action": "query",
                "titles": "|".join(f"File:{t}" for t in chunk),
                "prop": "imageinfo",
                "iiprop": "url|mime",
                "iiurlwidth": "1000",
                "format": "json",
            }
        )
        for page in (data.get("query") or {}).get("pages", {}).values():
            if page.get("missing"):
                continue
            title = page.get("title", "").replace("File:", "")
            info = (page.get("imageinfo") or [{}])[0]
            mime = str(info.get("mime") or "")
            if not mime.startswith("image/") or "svg" in mime or "gif" in mime:
                continue
            url = info.get("thumburl") or info.get("url")
            if url and url.startswith("http"):
                found[title] = url
                # also key without space variants
                found[title.replace("_", " ")] = url
    return found


def search_first(q: str) -> str:
    time.sleep(0.7)
    data = api(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": q,
            "gsrnamespace": "6",
            "gsrlimit": "8",
            "prop": "imageinfo",
            "iiprop": "url|mime",
            "iiurlwidth": "1000",
            "format": "json",
        }
    )
    skip = ("logo", "icon", "flag", "diagram", "svg", "map", "chart", "remote control", "headquarters")
    for page in (data.get("query") or {}).get("pages", {}).values():
        title = page.get("title", "").lower()
        if any(s in title for s in skip):
            continue
        info = (page.get("imageinfo") or [{}])[0]
        mime = str(info.get("mime") or "")
        if not mime.startswith("image/") or "svg" in mime or "gif" in mime:
            continue
        url = info.get("thumburl") or info.get("url") or ""
        if url.startswith("http"):
            return url
    return ""


def download(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(".bin")
    req = urllib.request.Request(url, headers={**UA, "Accept": "image/*"})
    try:
        with urllib.request.urlopen(req, timeout=45) as res, tmp.open("wb") as f:
            f.write(res.read())
    except Exception as e:
        print("  download fail", e)
        return False
    r = subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(tmp),
            "-vf",
            "scale=900:-2",
            "-q:v",
            "3",
            str(dest),
        ],
        capture_output=True,
        text=True,
    )
    tmp.unlink(missing_ok=True)
    if r.returncode != 0 or not dest.exists() or dest.stat().st_size < 4000:
        print("  ffmpeg fail", r.stderr[-200:] if r.stderr else "")
        dest.unlink(missing_ok=True)
        return False
    return True


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    POOL.mkdir(parents=True, exist_ok=True)

    titles = [t for _, t in FEATURED]
    for lst in FALLBACKS.values():
        titles.extend(lst)
    titles.extend(t for _, t in POOL_FILES)
    # unique preserve order
    seen: set[str] = set()
    uniq: list[str] = []
    for t in titles:
        if t not in seen:
            seen.add(t)
            uniq.append(t)

    print("resolving", len(uniq), "titles")
    info = imageinfo(uniq)

    used_urls: set[str] = set()

    def pick_url(title: str, extra: list[str]) -> str:
        for t in [title, *extra]:
            url = info.get(t) or info.get(t.replace("_", " "))
            if url and url not in used_urls:
                return url
        return ""

    featured_ids = [
        "lg-washer-8",
        "lg-washer-10",
        "toshiba-fridge-16",
        "samsung-fridge-18",
        "sharp-ac-15",
        "carrier-ac-225",
        "gree-ac-15",
        "unionaire-stove",
        "bosch-dishwasher",
        "beko-washer-7",
        "hoover-vacuum",
        "fresh-heater",
        "lg-tv-55",
        "kenwood-mixer",
        "braun-mixer",
        "toshiba-microwave",
        "tefal-iron",
        "bedroom-oak",
        "velvet-sofa",
        "dining-6",
        "tefal-pots",
        "cotton-duvet",
        "towel-set",
        "crystal-chandelier",
        "philips-airfryer",
        "fresh-freezer-5",
        "tornado-fan-18",
        "samsung-soundbar",
        "water-dispenser-fresh",
        "remington-dryer",
        "robot-vacuum-tuya",
        "kettle-kenwood",
        "bridal-dress",
        "bridal-abaya",
        "cotton-pajamas",
        "kids-pajamas",
        "women-galabiya",
        "men-galabiya",
        "bride-slippers",
        "evening-bag",
        "zircon-set",
        "lattafa-perfume",
        "bath-towels-8",
        "kitchen-linens",
    ]

    title_by_id = {i: t for i, t in FEATURED}

    search_q = {
        "lg-tv-55": "LED television flat screen living room",
        "braun-mixer": "immersion hand blender kitchen",
        "fresh-freezer-5": "chest freezer white",
        "evening-bag": "evening clutch bag",
        "lattafa-perfume": "perfume bottle",
        "cotton-pajamas": "cotton pajamas folded",
        "kids-pajamas": "children pajamas",
        "women-galabiya": "galabeya woman dress",
        "men-galabiya": "thawb galabeya man",
        "kitchen-linens": "kitchen tea towels",
        "crystal-chandelier": "crystal chandelier color",
        "unionaire-stove": "stainless gas range cooker",
        "sharp-ac-15": "split air conditioner indoor unit wall mounted",
        "velvet-sofa": "green velvet sofa",
        "dining-6": "wooden dining table six chairs",
        "gree-ac-15": "split air conditioner indoor",
        "samsung-soundbar": "soundbar under television",
        "hoover-vacuum": "canister vacuum cleaner",
        "lg-washer-10": "LG front load washing machine silver",
        "bridal-dress": "white wedding dress on mannequin",
    }

    for pid in featured_ids:
        dest = OUT / f"{pid}.jpg"
        url = pick_url(title_by_id.get(pid, ""), FALLBACKS.get(pid, []))
        if not url and pid in search_q:
            url = search_first(search_q[pid])
        if not url:
            print("MISS", pid)
            continue
        print("GET", pid, url[:90])
        if download(url, dest):
            used_urls.add(url)
            print("  ok", dest.stat().st_size)
        else:
            print("  FAIL", pid)

    for key, title in POOL_FILES:
        dest = POOL / f"{key}.jpg"
        url = info.get(title) or info.get(title.replace("_", " "))
        if not url:
            print("POOL MISS", key, title)
            continue
        print("POOL", key)
        download(url, dest)

    print("done featured", len(list(OUT.glob("*.jpg"))), "pool", len(list(POOL.glob("*.jpg"))))


if __name__ == "__main__":
    main()
