import lambdaTest from './Lambdatest';
// import { test as pwTest } from '@playwright/test';
import { AuthorizedPage } from './AuthorizedPage';


// const baseTest = process.env.LT ? lambdaTest : pwTest;

type TFixtures = {
	authorizedPage: AuthorizedPage;
};

export const test = lambdaTest.extend<TFixtures>({
	/**
	 * Extend base test by providing "authorizedPage" fixture.
	 * This new "test" can be used in multiple test files, and each of them will get the fixtures.
	 *
	 * @param root0 Playwright objects
	 * @param root0.browser Playwright browser object
	 * @param use Playwright use function
	 */
	authorizedPage: async ({ browser }, use) => {
		const authorizedPage = await AuthorizedPage.create(browser);
		await use(authorizedPage);
		await authorizedPage.page.close();
	},
});
