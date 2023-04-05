import { test } from 'playwright/fixtures';
import { HomePage } from 'playwright/pages/HomePage';
import { URL_CONSTANTS } from 'playwright/constants';

test.describe('Home Page', () => {
	test(`Guest user should be redirected to ${URL_CONSTANTS.login} page`, async ({ page }) => {
		const homePage = new HomePage(page);
		await homePage.goto();
		await homePage.page.waitForURL(URL_CONSTANTS.login);
	});

	test(`Authorized user should be redirected to ${URL_CONSTANTS.campaigns} page`, async ({
		authorizedPage,
	}) => {
		const homePage = new HomePage(authorizedPage.page);
		await homePage.goto();
		await homePage.page.waitForURL(URL_CONSTANTS.campaigns);
	});
});
