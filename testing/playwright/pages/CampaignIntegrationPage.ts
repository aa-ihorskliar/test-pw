import { CampaignPage } from 'playwright/pages/core/CampaignPage';
import { Locator } from '@playwright/test';
import { AuthorizedPage } from 'playwright/fixtures/AuthorizedPage';

/**
 *	Campaign integration page class.
 */
export class CampaignIntegrationPage extends CampaignPage {
	readonly sidebarItemName: string = 'Integrations';
	readonly sidebarItemUrl: string = '/integrations';
	readonly search: Locator;
	readonly enableButton: Locator;
	readonly integrations: Locator;
	readonly closeButton: Locator;
	readonly disconnectButton: Locator;
	readonly yesButton: Locator;
	readonly createDashboardSectionButton: Locator;

	/**
	 * @param authorizedPage AuthorizedPage page object
	 * @param campaignName campaign name
	 */
	constructor(authorizedPage: AuthorizedPage, campaignName: string) {
		super(authorizedPage, campaignName);

		this.search = this.page.getByPlaceholder('Search');
		this.enableButton = this.page.getByRole('button', { name: 'Enable', exact: true });
		this.integrations = this.page.getByTestId('campaign-integrations');
		this.closeButton = this.page.getByTestId('close-wizard');
		this.disconnectButton = this.page.getByText('Disconnect Integration');
		this.yesButton = this.page.getByRole('button', { name: 'Yes', exact: true });
		this.createDashboardSectionButton = this.page.getByRole('button', {
			name: 'Create Dashboard Section',
			exact: true,
		});
	}

	/**
	 * Goes to the inegration page and waits for the integrations to load
	 */
	async goto(): Promise<void> {
		super.goto();
		await this.integrations.waitFor();
	}

	/**
	 * Searches for an intergration
	 *
	 * @param keyword the integration to search for
	 */
	private async searchFor(keyword: string): Promise<void> {
		await this.search.fill(keyword);
	}

	/**
	 * Selects an integration from the search results
	 *
	 * @param integrationSelector The select for the integration
	 */
	private async selectIntegration(integrationSelector: string): Promise<void> {
		const selector = this.page.locator(`[data-value=${integrationSelector}]`);
		await selector.waitFor();
		await selector.waitFor({ state: 'visible' });
		await selector.click();
	}

	/**
	 * Enables an integration
	 *
	 * @param integration the integration to enable
	 */
	async enableIntegration(integration: string): Promise<void> {
		await this.searchFor(integration);
		await this.selectIntegration(integration);
		await this.enableButton.waitFor({ state: 'visible' });
		await this.enableButton.click();
	}

	/**
	 * This should be called after `enableIntegration` to ensure that the integration was disconnected
	 *
	 * @param integrationName the name of the integration
	 */
	async assertIntegrationIsEnabled(integrationName: string): Promise<void> {
		await this.page
			.getByText(`Your ${integrationName} account was successfully connected!`)
			.waitFor();
	}

	/**
	 * Selects to explore the integration
	 *
	 * Used after enabling an integration
	 *
	 * @param integrationName the name of the inegration
	 */
	async exploreIntegration(integrationName: string): Promise<void> {
		await this.page.getByText(`Explore ${integrationName}`).waitFor({ state: 'visible' });
		await this.page.getByText(`Explore ${integrationName}`).click();
	}

	/**
	 * Asserts that the integration page is loaded
	 *
	 * Can be used after choosing to explore an integration
	 *
	 * @param integrationName the name of the integration
	 */
	async assertIntegrationPageIsLoaded(integrationName: string): Promise<void> {
		await this.page
			.locator(`.common-report-interface-header`, { hasText: integrationName })
			.waitFor({ state: 'visible' });

		await this.page.waitForURL(/\/campaign\/\d+\/majestic\/summary/);
	}

	/**
	 * Disables an integration
	 *
	 * @param integration the integration to disables
	 */
	async disableIntegration(integration: string): Promise<void> {
		await this.goto();
		await this.searchFor(integration);
		await this.selectIntegration(integration);
		await this.page.waitForSelector('text="Date Connected"');
		await this.disconnectButton.waitFor({ state: 'visible' });
		await this.disconnectButton.click();
		await this.yesButton.waitFor({ state: 'visible' });
		await this.yesButton.click();
	}

	/**
	 * This should be called after `disableIntegration` to ensure that the integration was disconnected
	 */
	async assertIntegrationIsDisabled(): Promise<void> {
		await this.enableButton.waitFor({ state: 'visible' });
	}
}
