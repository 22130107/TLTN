import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

req = urllib.request.Request('https://www.foody.vn', headers=headers)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8')
        # Search for all city options in select or json
        matches = re.findall(r'<option[^>]*value="(\d+)"[^>]*>([^<]+)</option>', html)
        print(f"Option matches: {len(matches)}")
        for val, name in matches:
            if any(k in name.lower() for k in ['thơ', 'vũng tàu', 'bình dương', 'đồng nai', 'hồ chí minh', 'kiên giang', 'phú quốc']):
                print(f"{name.strip()}: {val}")
        
        # Also check for js variable like allProvinces or allCities or CityList
        js_matches = re.findall(r'(\w*city\w*|\w*province\w*)\s*=\s*(\[[^\]]+\]|\{[^\}]+\})', html, re.IGNORECASE)
        print(f"JS vars: {len(js_matches)}")
        for varname, val in js_matches:
            print(f"Var {varname}: {val[:100]}")
except Exception as e:
    print(f"Error: {e}")
