import json
from collections import Counter

with open('scripts/processed_saigon_places.json', encoding='utf-8') as f:
    places = json.load(f)

print('Total:', len(places))
print('Districts:', Counter(p['district'] for p in places))
print('Categories:', Counter(p['categoryType'] for p in places))
print('PriceRanges:', Counter(p['priceRange'] for p in places))
print('\nSample 8 places:')
for p in places[:8]:
    print(f"  * {p['name']} -- {p['district']} -- {p['categoryType']} -- {p['badge']} -- {p['priceText']}")
