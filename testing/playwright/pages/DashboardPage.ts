import { CampaignPage } from 'playwright/pages/core/CampaignPage';
import { Locator } from '@playwright/test';
import { AuthorizedPage } from 'playwright/fixtures/AuthorizedPage';

/**
 *	Dashboard page class.
 */
export class DashboardPage extends CampaignPage {
	readonly sidebarItemName: string = 'Overview';
	readonly sidebarItemUrl: string = '/overview/dashboard';
	readonly createDashboardButton: Locator;
	readonly closeButton: Locator;
	readonly blankButton: Locator;
	readonly fromTemplateButton: Locator;
	readonly cloneButton: Locator;
	readonly continueButton: Locator;
	readonly dashboardName: Locator;
	readonly enterDashboardName: Locator;
	readonly saveButton: Locator;
	readonly cancelButton: Locator;
	readonly deleteButton: Locator;
	readonly dashboardPopupMenu: Locator;
	readonly dashboardNameSecondStep: Locator;
	readonly editDashboardSectionButton: Locator;
	readonly startFromTemplateButton: Locator;

	/**
	 * @param authorizedPage AuthorizedPage page object
	 * @param campaignName campaign name
	 */
	constructor(authorizedPage: AuthorizedPage, campaignName: string) {
		super(authorizedPage, campaignName);

		this.createDashboardButton = this.page.getByRole('button', {
			name: 'Add',
		});
		this.blankButton = this.page.getByRole('button', {
			name: 'Create a blank dashboard section',
		});
		this.fromTemplateButton = this.page.getByRole('button', { name: 'Start from a template' });
		this.cloneButton = this.page.getByRole('button', { name: 'Clone an existing section' });
		this.continueButton = this.page.getByRole('button', { name: 'Continue' });
		this.saveButton = this.page.getByRole('button', { name: 'Save' });
		this.cancelButton = this.page.getByRole('button', { name: 'Cancel' });
		this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
		this.closeButton = this.page.getByTestId('close-wizard');
		this.dashboardPopupMenu = this.page.getByTestId('dashboard-popup-menu');
		this.enterDashboardName = this.page.getByPlaceholder(
			'Enter a name for your dashboard section',
		);
		this.dashboardName = this.page.getByPlaceholder('Dashboard Section Name');
		this.dashboardNameSecondStep = this.page.getByPlaceholder(
			'Enter a name for your dashboard section',
		);
		this.editDashboardSectionButton = this.page.getByRole('button', {
			name: 'Edit Dashboard Section',
		});
		this.startFromTemplateButton = this.page.getByRole('button', {
			name: 'Start from a template Use a premade template or one of yours',
		});
	}

	/**
	 * Asserts that the setup wizard is open
	 *
	 * @returns true if the wizard is open
	 */
	async wizardIsOpen(): Promise<boolean> {
		return this.closeButton.isVisible();
	}

	/**
	 * Asserts that the dashboard is in it's edit state
	 */
	async assertDashboardIsBeingEditted(): Promise<void> {
		await this.page.getByPlaceholder('Dashboard Section Name').waitFor();
	}

	/**
	 * Opens setup wizard
	 */
	async openSetupWizard(): Promise<void> {
		await this.dashboardPopupMenu.waitFor({ state: 'visible' });
		await this.dashboardPopupMenu.click();
		await this.createDashboardButton.waitFor({ state: 'visible' });
		await this.createDashboardButton.click();
		await this.page.getByText('How do you want to create your dashboard section?').waitFor();
	}

	/**
	 * Provides a name for the dashboard
	 *
	 * @param name the name of the dash
	 */
	async nameDashboard(name?: string): Promise<void> {
		if (name) await this.enterDashboardName.fill(name);
		await this.clickContinueButton();
	}

	/**
	 * Creates the dashboard
	 */
	async createDashboard(): Promise<void> {
		await this.page.getByText('Creating Your Dashboard Section').waitFor();
		await this.page.getByText('Dashboard Section Created').waitFor();
	}

	/**
	 * Creates a blank dashboard
	 */
	async createBlankDashboard(): Promise<void> {
		await this.blankButton.waitFor({ state: 'visible' });
		await this.blankButton.click();
	}

	/**
	 * Creates a dashboard using the provided templated
	 *
	 * @param template the template to use
	 */
	async selectTemplate(template: string): Promise<void> {
		await this.startFromTemplateButton.waitFor({ state: 'visible' });
		await this.startFromTemplateButton.click();
		await this.page.getByText('Select A Section Template').waitFor();

		const templateLoc = this.page.locator(`[data-ta*="${template}"]`).first();
		await templateLoc.waitFor({ state: 'visible' });
		await templateLoc.click();

		// UI jumps and button is changing it position and because of that Playwright miss clicking on it.
		await this.page.waitForTimeout(500);
		await this.clickContinueButton();
	}

	/**
	 * Clones a dashboard
	 *
	 * @param cloneName the name of the dashboard to clone
	 */
	async cloneDashboard(cloneName: string): Promise<void> {
		await this.page.getByText('Clone an existing section').waitFor();
		await this.cloneButton.waitFor({ state: 'visible' });
		await this.cloneButton.click();
		await this.page.getByRole('heading', { name: 'Select a Section' }).waitFor();
		const dashboard = this.page
			.getByRole('listitem')
			.filter({ hasText: new RegExp(cloneName) })
			.locator('span');
		await dashboard.waitFor();
		await dashboard.waitFor({ state: 'visible' });
		await dashboard.click();
		await this.clickContinueButton();
	}

	/**
	 * Closes the setup wizard
	 */
	async closeSetupWizard(): Promise<void> {
		await this.closeButton.waitFor({ state: 'visible' });
		await this.closeButton.click();
	}

	/**
	 * Click on Continue button. Used in the setup wizard to advance to the next step
	 */
	async clickContinueButton(): Promise<void> {
		await this.continueButton.waitFor({ state: 'visible' });
		await this.continueButton.waitFor({ state: 'visible' });
		await this.continueButton.click();
	}

	/**
	 * When editting a dashboard this will exit the edit state
	 */
	async cancelEditting(): Promise<void> {
		await this.cancelButton.waitFor({ state: 'visible' });
		await this.cancelButton.click();
	}

	/**
	 * When edditing a dashboard this will save the changes and exit the edit state
	 */
	async saveEdits(): Promise<void> {
		await this.saveButton.waitFor({ state: 'visible' });
		await this.saveButton.click();
	}

	/**
	 * Edit the dashboard. Put it in the edit state
	 */
	async editDashboard(): Promise<void> {
		await this.editDashboardSectionButton.waitFor({ state: 'visible' });
		await this.editDashboardSectionButton.click();
	}

	/**
	 * Delet the dashboard
	 */
	async deleteDashboard(): Promise<void> {
		await this.deleteButton.first().waitFor({ state: 'visible' });
		await this.deleteButton.first().click();
		await this.deleteButton.nth(1).waitFor({ state: 'visible' });
		await this.deleteButton.nth(1).click();
	}

	/**
	 * Get tab with provided dashboard name
	 *
	 * @param dashboardName dashboard name
	 * @returns Playwright Locator object
	 */
	getDashboardTab(dashboardName: string): Locator {
		return this.page.locator(`a[data-ta="Tab"][title="${dashboardName}"]`);
	}
}
