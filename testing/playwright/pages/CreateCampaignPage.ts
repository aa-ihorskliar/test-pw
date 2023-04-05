import { BasicPage } from 'playwright/pages/core/BasicPage';
import { Locator, Page } from '@playwright/test';
import { URL_CONSTANTS } from 'playwright/constants';

/**
 *	Create campaign page class.
 * 	Contains url, all locators, and methods for create campaign page.
 */
export class CreateCampaignPage extends BasicPage {
	readonly url = URL_CONSTANTS.campaigns;
	readonly createCampaignButton: Locator;
	readonly createButton: Locator;
	readonly titleName: Locator;
	readonly website: Locator;
	readonly timezone: Locator;
	readonly template: Locator;
	readonly group: Locator;
	readonly advancedButton: Locator;
	readonly closeWizard: Locator;
	readonly searchInput: Locator;

	/**
	 * @param page Playwright page object
	 */
	constructor(page: Page) {
		super(page);

		this.createCampaignButton = this.page.getByRole('button', {
			name: 'Create Campaign',
			exact: true,
		});
		this.titleName = this.page.getByPlaceholder('Enter a company name');
		this.website = this.page.getByPlaceholder('your-client.com');
		this.advancedButton = this.page.getByText('Advanced Settings');
		this.timezone = this.page.getByRole('button', { name: 'America/Toronto' });
		this.template = this.page.getByRole('button', { name: 'None' });
		this.group = this.page.getByPlaceholder('Group');
		this.createButton = this.page.getByRole('button', { name: 'Create', exact: true });
		this.closeWizard = this.page.getByTestId('close-wizard');
		this.searchInput = this.page.getByPlaceholder('Search');
	}

	/**
	 * Creates a new basic campaign
	 *
	 * @param campaign the campaign info
	 * @param campaign.title the title of the campaign
	 * @param campaign.website the url of the website that the campaign is being created for
	 */
	async create({ title, website }: { title?: string; website?: string }): Promise<void> {
		await this.openSetupWizard();
		if (title) await this.titleName.fill(title);
		if (website) await this.website.fill(website);
		await this.createButton.waitFor({ state: 'visible' });
		await this.createButton.click();
	}

	/**
	 * Asserts that a campaign has been created
	 */
	async assertCampaignWasCreated(): Promise<void> {
		await this.page.getByText('Campaign Created').waitFor();
		await this.page.waitForURL(this.url);
	}

	/**
	 * Asserts the form validation errors are show
	 */
	async assertInvalidWebsiteErrorMessage(): Promise<void> {
		await this.waitFormValidation('invalid');
	}

	/**
	 * Assert that a campaign exists
	 *
	 * @param title the title of the campaign
	 */
	async assertExists(title: string): Promise<void> {
		await this.search(title);
		await this.page.getByText(title).waitFor();
	}

	/**
	 * Selects and opens a campaign
	 *
	 * @param name the name of the campaign
	 */
	async select(name: string): Promise<void> {
		await this.search(name);
		await this.page.getByText(name).waitFor({ state: 'visible' });
		await this.page.getByText(name).click();
	}

	/**
	 * Opens the setup wizard
	 */
	private async openSetupWizard(): Promise<void> {
		await this.createCampaignButton.waitFor({ state: 'visible' });
		await this.createCampaignButton.click();
	}

	/**
	 * Creates an advanced campaign
	 *
	 * @param campaign the campaign info
	 * @param campaign.title the title of the campaign
	 * @param campaign.website the url of the website that the campaign is being created for
	 * @param campaign.timezone the timezone for the campaign
	 * @param campaign.template the template to use for the campaign
	 * @param campaign.group the group to place the campaign under
	 */
	async createAdvancedCampaign({
		title,
		website,
		timezone,
		template,
		group,
	}: {
		title?: string;
		website?: string;
		timezone: string;
		template?: string;
		group?: string;
	}): Promise<void> {
		await this.openSetupWizard();

		if (title) await this.titleName.fill(title);
		if (website) await this.website.fill(website);

		await this.advancedButton.waitFor({ state: 'visible' });
		await this.advancedButton.click();
		await this.timezone.waitFor({ state: 'visible' });

		if (timezone) {
			await this.timezone.click();
			await this.page.locator(`[data-value="${timezone}"]`).click();
		}

		if (template) {
			await this.template.click();
			await this.page.locator(`[data-value="${template}"]`).click();
		}

		if (group) {
			await this.group.fill(group);
		}
		await this.createButton.click();
	}

	/**
	 * Wait for form validation
	 *
	 * @param errorMessage error message to wait for
	 */
	async waitFormValidation(errorMessage: string): Promise<void> {
		await this.page.waitForSelector(`text=${errorMessage}`);
	}

	/**
	 * Search for a campaign
	 *
	 * @param campaignName campaign name
	 */
	async search(campaignName: string): Promise<void> {
		await this.searchInput.fill(campaignName);
	}
}
