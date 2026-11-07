import json
import urllib.request
import urllib.parse
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = "http://localhost:9000/api"

def api_get(endpoint, params=None):
    url = f"{BASE_URL}/{endpoint}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "RetroTimeCo-Test/1.0"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def run_tests():
    print("==================================================")
    print("       RETROTIMECO PAGINATION VERIFICATION        ")
    print("==================================================")

    # 1. Total count check
    data_200 = api_get("watches", {"limit": "50", "page": "1"})
    total = data_200.get("total", 0)
    print(f"Test: Total watches in database: {total}")
    assert total >= 200, f"Expected at least 200 watches, got {total}"
    print(f"PASS: Catalog has at least 200 watches (actual: {total})")

    # 2. Limit 12
    res_12 = api_get("watches", {"limit": "12", "page": "1"})
    print(f"\nTest 1: limit=12 -> count: {res_12['count']}, total_pages: {res_12['total_pages']}")
    assert res_12["count"] == 12, f"Expected 12 items, got {res_12['count']}"
    assert res_12["total_pages"] == (total + 11) // 12
    print("PASS: Selecting 12 displays 12 products per page")

    # 3. Limit 24
    res_24 = api_get("watches", {"limit": "24", "page": "1"})
    print(f"\nTest 2: limit=24 -> count: {res_24['count']}, total_pages: {res_24['total_pages']}")
    assert res_24["count"] == 24, f"Expected 24 items, got {res_24['count']}"
    assert res_24["total_pages"] == (total + 23) // 24
    print("PASS: Selecting 24 displays 24 products per page")

    # 4. Limit 50
    res_50 = api_get("watches", {"limit": "50", "page": "1"})
    print(f"\nTest 3: limit=50 -> count: {res_50['count']}, total_pages: {res_50['total_pages']}")
    assert res_50["count"] == 50, f"Expected 50 items, got {res_50['count']}"
    assert res_50["total_pages"] == 4, f"Expected exactly 4 pages for 200 products at 50/page, got {res_50['total_pages']}"
    print("PASS: Selecting 50 displays 50 products per page and exactly 4 pages")

    # 5. Limit 100
    res_100 = api_get("watches", {"limit": "100", "page": "1"})
    print(f"\nTest 4: limit=100 -> count: {res_100['count']}, total_pages: {res_100['total_pages']}")
    assert res_100["count"] == 100, f"Expected 100 items, got {res_100['count']}"
    assert res_100["total_pages"] == 2, f"Expected 2 pages for 200 products at 100/page, got {res_100['total_pages']}"
    print("PASS: Selecting 100 displays 100 products per page")

    # 6. Page 1 vs Page 2 uniqueness (no duplicate items across pages)
    res_p1 = api_get("watches", {"limit": "50", "page": "1"})
    res_p2 = api_get("watches", {"limit": "50", "page": "2"})
    p1_ids = {w["id"] for w in res_p1["data"]}
    p2_ids = {w["id"] for w in res_p2["data"]}
    intersection = p1_ids.intersection(p2_ids)
    print(f"\nTest 5: Overlap between Page 1 and Page 2: {len(intersection)} items")
    assert len(intersection) == 0, f"Duplicate items between Page 1 and 2: {intersection}"
    print("PASS: Page 1 and Page 2 contain mutually exclusive subsets of products")

    # 7. Brand filter + pagination
    seiko_res = api_get("watches", {"brand": "Seiko", "limit": "12", "page": "1"})
    seiko_total = seiko_res["total"]
    seiko_pages = seiko_res["total_pages"]
    print(f"\nTest 6: Filter brand=Seiko -> total: {seiko_total}, total_pages: {seiko_pages}")
    assert seiko_total > 0
    assert all(w["brand"].lower() == "seiko" for w in seiko_res["data"])
    assert seiko_pages == (seiko_total + 11) // 12
    print("PASS: Filters work properly with pagination and dynamic total count")

    # 8. Search query + pagination
    search_res = api_get("watches", {"search": "automatic", "limit": "12", "page": "1"})
    print(f"\nTest 7: Search search=automatic -> total: {search_res['total']}, count: {search_res['count']}")
    assert search_res["total"] > 0
    print("PASS: Search works properly with pagination")

    # 9. Empty search results
    empty_res = api_get("watches", {"search": "xyznonexistentreference123456789"})
    print(f"\nTest 8: Empty search -> total: {empty_res['total']}, count: {empty_res['count']}")
    assert empty_res["total"] == 0 and empty_res["count"] == 0
    print("PASS: Empty search results handled gracefully")

    # 10. Available watches prioritized before sold watches
    p1_watches = res_50["data"]
    stock_statuses = [w["in_stock"] for w in p1_watches]
    # Check that in_stock: True comes before in_stock: False
    first_sold_idx = next((i for i, s in enumerate(stock_statuses) if not s), len(stock_statuses))
    has_instock_after_sold = any(s for s in stock_statuses[first_sold_idx:])
    print(f"\nTest 9: Available items prioritized before sold items: {not has_instock_after_sold}")
    assert not has_instock_after_sold, "Available items should come before sold items"
    print("PASS: In-stock watches appear first, followed by sold watches")

    print("\n==================================================")
    print("         ALL 10 AUTOMATED TESTS PASSED!           ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
