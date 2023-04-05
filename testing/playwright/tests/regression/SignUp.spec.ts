import { expect } from '@playwright/test';
import { TEST_USER } from 'playwright/constants';
import { test } from 'playwright/fixtures';
import { SignUpPage } from 'playwright/pages/SignUpPage';
import { createUser } from 'playwright/utils/auth';
import { URL_CONSTANTS } from 'playwright/constants';

test.describe('SignUp Page', () => {
	test('SignUp new user', async ({ page }) => {
		const user = createUser();

		const signUpPage = new SignUpPage(page);
		await signUpPage.goto();

		await signUpPage.signup(user);

		await signUpPage.page.waitForURL(URL_CONSTANTS.onboard);
	});

	test('SignUp existing user', async ({ page }) => {
		const user = { ...createUser(), ...TEST_USER };
		const signUpPage = new SignUpPage(page);
		await signUpPage.goto();

		await signUpPage.signup(user);

		await expect(signUpPage.page).toHaveURL(/\/signup/);
		await signUpPage.assertDuplicateEmailErrorIsShown();
		await signUpPage.page.waitForURL(URL_CONSTANTS.signup);
	});

	test('Submit empty form', async ({ page }) => {
		const signUpPage = new SignUpPage(page);
		await signUpPage.goto();

		await signUpPage.signup({});

		await signUpPage.assertRequiredErrorMessagesAreShown();
		await signUpPage.page.waitForURL(URL_CONSTANTS.signup);
	});
});
