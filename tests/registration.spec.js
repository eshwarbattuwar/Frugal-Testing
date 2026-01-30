const { test, expect } = require('@playwright/test');

const BASE = '/';

async function fillForm(page, { skipLastName = false, wrongConfirmPassword = false } = {}) {
  await page.getByLabel(/first name/i).fill('Jane');
  if (!skipLastName) await page.getByLabel(/last name/i).fill('Doe');
  await page.getByLabel(/^email/i).fill('jane.doe@example.com');
  await page.getByLabel(/phone number/i).fill('+1 555 123 4567');
  await page.getByLabel(/^age/i).fill('28');
  await page.getByRole('checkbox', { name: /female/i }).check();
  await page.getByLabel(/address/i).fill('123 Main St');
  await page.getByLabel(/country/i).selectOption('United States');
  await page.waitForTimeout(200);
  await page.getByLabel(/state/i).selectOption('California');
  await page.waitForTimeout(200);
  await page.getByLabel(/city/i).selectOption('Los Angeles');
  const password = 'SecurePass123!';
  await page.getByLabel(/^password/i).fill(password);
  await page.getByLabel(/confirm password/i).fill(wrongConfirmPassword ? 'WrongPass456!' : password);
  await page.getByRole('checkbox', { name: /terms/i }).check();
}

test.describe('Registration Form', () => {

  test('Flow A — Negative: Skip Last Name, validate error and capture error-state.png', async ({ page }) => {
    await page.goto(BASE);

    const url = page.url();
    const title = await page.title();
    console.log('Page URL:', url);
    console.log('Page Title:', title);

    await fillForm(page, { skipLastName: true });
    await page.getByLabel(/last name/i).focus();
    await page.getByLabel(/first name/i).focus();
    const submitBtn = page.getByRole('button', { name: /submit registration/i });
    await expect(submitBtn).toBeDisabled();

    await expect(page.getByText(/last name is required/i)).toBeVisible();
    const lastNameInput = page.getByLabel(/last name/i);
    await expect(lastNameInput).toHaveClass(/invalid/);

    await page.screenshot({ path: 'error-state.png', fullPage: true });
  });

  test('Flow B — Positive: Full valid form, success message, form reset, success-state.png', async ({ page }) => {
    await page.goto(BASE);

    await fillForm(page);

    await page.getByRole('button', { name: /submit registration/i }).click();

    await expect(page.getByText(/registration successful/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/profile has been submitted successfully/i)).toBeVisible();

    await expect(page.getByLabel(/first name/i)).toHaveValue('');

    await page.screenshot({ path: 'success-state.png', fullPage: true });
  });

  test('Flow C — Form logic: Country→States, State→Cities, password strength, wrong confirm, submit disabled', async ({ page }) => {
    await page.goto(BASE);

    await page.getByLabel(/country/i).selectOption('United States');
    await page.waitForTimeout(300);
    const stateSelect = page.getByLabel(/state/i);
    await expect(stateSelect).toBeEnabled();
    await expect(stateSelect.locator('option')).toHaveCount(5);

    await stateSelect.selectOption('California');
    await page.waitForTimeout(300);
    const citySelect = page.getByLabel(/city/i);
    await expect(citySelect).toBeEnabled();
    await expect(citySelect.locator('option')).toHaveCount(5);

    const passwordInput = page.getByLabel(/^password/i);
    const strengthLabel = page.locator('#strength-label');
    await passwordInput.fill('weak');
    await expect(strengthLabel).toContainText(/weak/i);
    await passwordInput.fill('MediumPass1');
    await expect(strengthLabel).toContainText(/medium/i);
    await passwordInput.fill('StrongPass123!');
    await expect(strengthLabel).toContainText(/strong/i);

    await page.getByLabel(/confirm password/i).fill('DifferentPass123!');
    await page.getByLabel(/^password/i).fill('StrongPass123!');
    await page.getByLabel(/confirm password/i).focus();
    await page.getByLabel(/first name/i).focus();
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();

    await page.goto(BASE);
    const submitBtn = page.getByRole('button', { name: /submit registration/i });
    await expect(submitBtn).toBeDisabled();

    await fillForm(page);
    await expect(submitBtn).toBeEnabled();
  });
});
