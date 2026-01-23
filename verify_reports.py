from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        print("Navigating to Login page...")
        page.goto("http://localhost:5173/login")

        print("Filling login credentials...")
        page.fill("input[placeholder='Username']", "admin")
        page.fill("input[placeholder='Password']", "admin")

        print("Clicking Sign In...")
        with page.expect_response("**/login") as response_info:
            page.click("button[type='submit']")

        response = response_info.value
        if response.status != 200:
             print("Login failed.")
             return

        print("Waiting for Dashboard...")
        page.wait_for_url("**/dashboard")

        print("Navigating to Reports...")
        page.click("text=Reports")
        page.wait_for_url("**/reports")

        page.wait_for_timeout(2000)

        # Test Trial Balance
        print("Generating Trial Balance...")
        # Check if the button is enabled before clicking
        page.wait_for_selector("button:has-text('Generate')", state="visible")

        with page.expect_response("**/reports/trial-balance*") as response_info:
             page.click("button:has-text('Generate')")

        response = response_info.value
        print(f"Trial Balance API Status: {response.status}")

        if response.status == 200:
            page.wait_for_selector("text=Trial Balance as of")
            print("Trial Balance table visible.")
        else:
            print(f"Trial Balance failed: {response.text()}")

        # Switch to P&L
        print("Switching to Profit & Loss...")
        page.click("text=Profit & Loss")
        page.wait_for_timeout(1000)

        print("Generating P&L...")
        with page.expect_response("**/reports/profit-loss*") as response_info:
             page.click("button:has-text('Generate')")

        response = response_info.value
        print(f"P&L API Status: {response.status}")

        if response.status == 200:
            page.wait_for_selector("text=Net Income")
            print("P&L visible.")
        else:
            print(f"P&L failed: {response.text()}")

        browser.close()

if __name__ == "__main__":
    run()
