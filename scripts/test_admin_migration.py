import urllib.request
import urllib.parse
import json
import ssl
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None  # Do not automatically follow redirects

def run_tests(base_url, host_header=None):
    print("==================================================")
    print("      RETROTIMECO ADMIN MIGRATION TESTS           ")
    print(f"Target: {base_url}")
    print("==================================================")

    opener = urllib.request.build_opener(NoRedirectHandler)

    # 1. Test /admin 302 redirect
    print("\n--- Test 1: GET /admin -> 302 External Redirect ---")
    headers = {"User-Agent": "TestAgent/1.0"}
    if host_header:
        headers["Host"] = host_header

    req = urllib.request.Request(f"{base_url}/admin", headers=headers)
    try:
        resp = opener.open(req)
        status = resp.status
        loc = resp.headers.get("Location")
    except urllib.error.HTTPError as e:
        status = e.code
        loc = e.headers.get("Location")

    print(f"Status: {status}, Location: {loc}")
    assert status == 302, f"Expected 302 redirect, got {status}"
    assert loc and "shopify.com" in loc, f"Expected Shopify redirect, got {loc}"
    print("PASS: /admin returns 302 redirect to Shopify!")

    # 2. Test /admin/ 302 redirect
    print("\n--- Test 2: GET /admin/ -> 302 External Redirect ---")
    req = urllib.request.Request(f"{base_url}/admin/", headers=headers)
    try:
        resp = opener.open(req)
        status = resp.status
        loc = resp.headers.get("Location")
    except urllib.error.HTTPError as e:
        status = e.code
        loc = e.headers.get("Location")

    print(f"Status: {status}, Location: {loc}")
    assert status == 302, f"Expected 302 redirect, got {status}"
    assert loc and "shopify.com" in loc, f"Expected Shopify redirect, got {loc}"
    print("PASS: /admin/ returns 302 redirect to Shopify!")

    # 3. Test /jewlandniggesh unauthenticated -> redirects to /jewlandniggesh/login
    print("\n--- Test 3: GET /jewlandniggesh unauthenticated ---")
    req = urllib.request.Request(f"{base_url}/jewlandniggesh", headers=headers)
    try:
        resp = opener.open(req)
        status = resp.status
        loc = resp.headers.get("Location")
    except urllib.error.HTTPError as e:
        status = e.code
        loc = e.headers.get("Location")

    print(f"Status: {status}, Location: {loc}")
    assert status in (302, 307), f"Expected 302 or 307 redirect, got {status}"
    assert loc and "/jewlandniggesh/login" in loc, f"Expected redirect to /jewlandniggesh/login, got {loc}"
    print("PASS: /jewlandniggesh correctly redirects unauthenticated visitors to /jewlandniggesh/login")

    # 4. Test /jewlandniggesh/login loads the login interface
    print("\n--- Test 4: GET /jewlandniggesh/login ---")
    req = urllib.request.Request(f"{base_url}/jewlandniggesh/login", headers=headers)
    normal_opener = urllib.request.build_opener()
    with normal_opener.open(req) as resp:
        html = resp.read().decode("utf-8")
        assert resp.status == 200
        assert "Admin Login" in html or "password" in html.lower()
        print("PASS: /jewlandniggesh/login returns 200 with admin login panel")

    # 5. Test invalid password
    print("\n--- Test 5: POST /jewlandniggesh/auth-api with wrong password ---")
    req = urllib.request.Request(
        f"{base_url}/jewlandniggesh/auth-api",
        data=json.dumps({"password": "wrong_password_123"}).encode("utf-8"),
        headers={**headers, "Content-Type": "application/json"}
    )
    try:
        resp = normal_opener.open(req)
        status = resp.status
    except urllib.error.HTTPError as e:
        status = e.code
        body = json.loads(e.read().decode("utf-8"))
        print(f"Status: {status}, Response: {body}")
    assert status == 401, f"Expected 401, got {status}"
    print("PASS: Invalid password rejected with 401")

    # 6. Test successful login
    print("\n--- Test 6: POST /jewlandniggesh/auth-api with valid password ---")
    valid_pass = "RetroTimeAdmin2026!"
    req = urllib.request.Request(
        f"{base_url}/jewlandniggesh/auth-api",
        data=json.dumps({"password": valid_pass}).encode("utf-8"),
        headers={**headers, "Content-Type": "application/json"}
    )
    resp = normal_opener.open(req)
    assert resp.status == 200
    cookie_header = resp.headers.get("Set-Cookie")
    print(f"Status: {resp.status}, Set-Cookie: {cookie_header}")
    assert cookie_header and "rtc_admin_auth=" in cookie_header
    assert "HttpOnly" in cookie_header
    print("PASS: Valid password authenticates and sets secure HttpOnly session cookie")

    # 7. Test accessing /jewlandniggesh with valid cookie
    print("\n--- Test 7: GET /jewlandniggesh with authenticated session cookie ---")
    auth_req = urllib.request.Request(
        f"{base_url}/jewlandniggesh",
        headers={**headers, "Cookie": cookie_header.split(";")[0]}
    )
    with normal_opener.open(auth_req) as resp:
        admin_html = resp.read().decode("utf-8")
        assert resp.status == 200
        assert "Products" in admin_html or "Store Admin" in admin_html
        print("PASS: Authenticated access to /jewlandniggesh dashboard works seamlessly!")

    print("\n==================================================")
    print("      ALL 7 ADMIN MIGRATION TESTS PASSED!         ")
    print("==================================================")

if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
    host = sys.argv[2] if len(sys.argv) > 2 else None
    run_tests(url, host)
