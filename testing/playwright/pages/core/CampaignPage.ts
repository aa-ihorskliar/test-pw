import { BasicPage } from 'playwright/pages/core/BasicPage';
import { AuthorizedPage } from 'playwright/fixtures/AuthorizedPage';
import { Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CreateCampaignPage } from '../CreateCampaignPage';
import { URL_CONSTANTS } from 'playwright/constants';

/**
 * Basic page class, which contains common methods for all POM classes in this folder.
 * Playwright POM docs: https://playwright.dev/docs/pom
 */
export abstract class CampaignPage extends BasicPage {
	abstract readonly sidebarItemName: string;
	abstract readonly sidebarItemUrl: string;
	readonly url: string = URL_CONSTANTS.campaigns;
	readonly testCampaign: Locator;
	readonly searchInput: Locator;
	readonly campaignName: string;

	/**
	 * Constructor.
	 *
	 * @param authorizedPage AuthorizedPage page object.
	 * @param campaignName campaign name
	 * @example
	 * ```typescript
	 * 	test('My test', async ({ authorizedPage }) => {
	 * 		const somePage = new SomePage(authorizedPage);
	 * 	});
	 * ```
	 */
	protected constructor(authorizedPage: AuthorizedPage, campaignName: string) {
		super(authorizedPage.page);

		this.campaignName = campaignName;
		this.testCampaign = this.page.getByText(campaignName).first();
		this.searchInput = this.page.getByPlaceholder('Search');
	}

	/**
	 * Creates a new campaign using the class' campaign name value
	 */
	async createCampaign(): Promise<void> {
		const campaignPage = new CreateCampaignPage(this.page);
		const website = faker.internet.domainName();
		await campaignPage.goto();
		await campaignPage.create({ title: this.campaignName, website });
		await campaignPage.assertCampaignWasCreated();
	}

	/**
	 * Initializes a Campaign
	 */
	async initialize(): Promise<void> {
		await this.createCampaign();
	}

	/**
	 * Navigate to the page for the campaign
	 */
	async goto(): Promise<void> {
		await super.goto();

		await this.page.waitForURL(this.url);
		await this.searchInput.fill(this.campaignName);
		await this.testCampaign.waitFor({ state: 'visible' });
		await this.testCampaign.click();
		await this.page.waitForURL(/\/campaign\/\d+\//);
		await this.submenuItem.waitFor({ state: 'visible' });
		await this.submenuItem.click();
		await this.page.waitForURL(new RegExp(`/campaign/\\d+${this.sidebarItemUrl}`));
		await this.testCampaign.hover();
	}

	/**
	 * @returns Submenu item locator
	 */
	get submenuItem(): Locator {
		return this.page.locator('a', { hasText: this.sidebarItemName }).first();
	}
}
