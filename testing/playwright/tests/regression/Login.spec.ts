import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { LoginPage } from 'playwright/pages/LoginPage';
import { TEST_USER } from 'playwright/constants';
import { URL_CONSTANTS } from 'playwright/constants';

test.describe('Login Page', () => {
	test('Login with test user', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();

		await loginPage.login(TEST_USER);

		await loginPage.page.waitForURL(URL_CONSTANTS.campaigns);
	});

	test('Login non-existing user', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();

		await loginPage.login({
			email: 'non-existing@user.com',
			password: 'non-existing-password',
		});

		const errorMessage = 'Invalid Credentials.';
		await loginPage.waitForFormValidation(errorMessage);
		await expect(loginPage.page).toHaveURL(URL_CONSTANTS.login);
	});

	test('Submit empty form', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();

		await loginPage.login({});

		await loginPage.waitForFormValidation(
			'Username field value is required password field value is required',
		);
		await expect(loginPage.page).toHaveURL(URL_CONSTANTS.login);
	});
});
