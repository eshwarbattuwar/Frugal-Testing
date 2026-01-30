# Assignment Compliance Checklist

## Part 1: Web Page Development

| Requirement | Status |
|-------------|--------|
| First Name (Required) | Done |
| Last Name (Required) | Done |
| Email (Required) | Done |
| Phone Number (Required) | Done |
| Age | Done |
| Gender (Checkbox: Male, Female, Other - Required) | Done |
| Address | Done |
| Country (Dropdown) | Done |
| State (Dropdown) | Done |
| City (Dropdown) | Done |
| Password | Done |
| Confirm Password | Done |
| Terms & Conditions (Checkbox Required) | Done |

## Validation Rules (Client-Side)

| Requirement | Status |
|-------------|--------|
| Highlight invalid fields in red with inline error text | Done |
| Disable submit button until required fields are valid | Done |
| Email must not contain disposable domains (e.g. tempmail.com) | Done |
| Phone number must start with valid country code if country selected | Done |
| Password strength meter (Weak / Medium / Strong) | Done |

## User Feedback

| Requirement | Status |
|-------------|--------|
| Success alert on successful submission | Done |
| Error messages inline + on top of form | Done |
| "Registration Successful!" message | Done |
| "Your profile has been submitted successfully." message | Done |

## Part 2: Automation Testing

| Requirement | Status |
|-------------|--------|
| Automation framework (Selenium/Cypress/Playwright) | Done (Playwright) |

### Flow A — Negative Scenario

| Step | Status |
|------|--------|
| 1. Launch web page | Done |
| 2. Print Page URL + Page Title | Done |
| 3. Fill form (First Name filled, Last Name skipped, rest valid) | Done |
| 4. Trigger validation / Submit | Done (validation via blur; submit button disabled when invalid) |
| 5. Validate: Error message for missing Last Name, error fields highlighted | Done |
| 6. Capture Screenshot: error-state.png | Done |

### Flow B — Positive Scenario

| Step | Status |
|------|--------|
| 1. Refill form with all valid fields | Done |
| 2. Password & Confirm Password match | Done |
| 3. Terms & Conditions checked | Done |
| 4. Submit form | Done |
| 5. Validate: Success message appears, form fields reset | Done |
| 6. Capture Screenshot: success-state.png | Done |

### Flow C — Form Logic Validation

| Step | Status |
|------|--------|
| 1. Change Country → States dropdown updates | Done |
| 2. Change State → Cities dropdown updates | Done |
| 3. Password strength validated | Done |
| 4. Wrong Confirm Password → error appears | Done |
| 5. Submit button disabled until all fields valid | Done |

## Submission Guidelines

| Requirement | Status |
|-------------|--------|
| Source code: .html, .css, .js files | Done (index.html, styles.css, app.js, data.js) |
| Automation script | Done (tests/registration.spec.js) |
| Step-by-step explanation of automation | Done (README.md) |
| Screenshots of automation (error-state.png, success-state.png) | Done (generated when tests run) |
| Video of automation execution | Enable in playwright.config.js (`video: 'on'`), then run tests; video in test-results |

## Optional / Bonus

| Requirement | Status |
|-------------|--------|
| Optional backend simulation | Done (simulated delay + success in app.js) |
| Bonus: Enhanced UI | Done (dark theme, responsive, focus states, strength bar) |
