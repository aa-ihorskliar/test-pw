import { Browser, Page } from '@playwright/test';
import { AA_API_HOST } from 'playwright/constants';
import { authorize, setUserToken } from 'playwright/utils/auth';

/**
 * This class used for creating a new page with an authorized test user context.
 */
export class AuthorizedPage {
	// Page signed in as 'user'.
	readonly page: Page;

	/**
	 * @param page Playwright page object
	 */
	protected constructor(page: Page) {
		this.page = page;
	}

	/**
	 * Create and Authorized page object
	 *
	 * @param browser Playwright browser object
	 */
	static async create(browser: Browser): Promise<AuthorizedPage> {
		const userToken = await authorize(AA_API_HOST);

		const context = await browser.newContext();
		await context.addInitScript(setUserToken, userToken);

		const page = await context.newPage();
		return new AuthorizedPage(page);
	}
}
