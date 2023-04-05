import { Page } from '@playwright/test';

/**
 * Basic page class, which contains common methods for all POM classes in this folder.
 * Playwright POM docs: https://playwright.dev/docs/pom
 */
export abstract class BasicPage {
	readonly page: Page;

	/**
	 * The url of the page
	 */
	abstract get url(): string;

	/**
	 * Constructor.
	 *
	 * @param page Playwright page object.
	 * @example
	 * ```typescript
	 * 	test('My test', async ({ page }) => {
	 * 		const somePage = new SomePage(page);
	 * 	});
	 * ```
	 */
	constructor(page: Page) {
		this.page = page;
	}

	/**
	 * Navigates to the url of the page
	 */
	async goto(): Promise<void> {
		await this.page.goto(this.url);
	}
}
