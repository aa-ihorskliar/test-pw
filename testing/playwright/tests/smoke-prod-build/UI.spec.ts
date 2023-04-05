import { expect } from '@playwright/test';
import { test } from 'playwright/fixtures';
import { LoginPage } from 'playwright/pages/LoginPage';
import { TEST_USER } from 'playwright/constants';
import { SignUpPage } from 'playwright/pages/SignUpPage';
import { createUser } from 'playwright/utils/auth';
import { URL_CONSTANTS } from 'playwright/constants';

test.describe('UI loaded', () => {
	test('Login page', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();

		await loginPage.page.waitForURL(URL_CONSTANTS.login);
		await loginPage.email.waitFor({ state: 'visible' });
		await loginPage.password.waitFor({ state: 'visible' });

		await loginPage.email.fill(TEST_USER.email);
		await loginPage.password.fill(TEST_USER.password);

		await expect(loginPage.email).toHaveValue(TEST_USER.email);
		await expect(loginPage.password).toHaveValue(TEST_USER.password);
	});

	test('SignUp page', async ({ page }) => {
		const signUpPage = new SignUpPage(page);
		await signUpPage.goto();

		await signUpPage.page.waitForURL(signUpPage.url);
		await signUpPage.firstName.waitFor({ state: 'visible' });
		await signUpPage.lastName.waitFor({ state: 'visible' });
		await signUpPage.email.waitFor({ state: 'visible' });
		await signUpPage.password.waitFor({ state: 'visible' });

		const user = createUser();
		await signUpPage.firstName.fill(user.firstName);
		await signUpPage.lastName.fill(user.lastName);
		await signUpPage.email.fill(user.email);
		await signUpPage.password.fill(user.password);

		await expect(signUpPage.firstName).toHaveValue(user.firstName);
		await expect(signUpPage.lastName).toHaveValue(user.lastName);
		await expect(signUpPage.email).toHaveValue(user.email);
		await expect(signUpPage.password).toHaveValue(user.password);
	});
});
