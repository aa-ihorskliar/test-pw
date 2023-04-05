import { expect } from '@playwright/test';
import { BasicPage } from 'playwright/pages/core/BasicPage';
import { Locator, Page } from '@playwright/test';
import { URL_CONSTANTS } from 'playwright/constants';

/**
 *	Report page class.
 */
export class ReportPage extends BasicPage {
	readonly url: string = URL_CONSTANTS.unscheduledReports;
	readonly createReportButton: Locator;
	readonly closeButton: Locator;
	readonly blankReportButton: Locator;
	readonly templateReportButton: Locator;
	readonly cloneReportButton: Locator;
	readonly continueButton: Locator;
	readonly saveButton: Locator;
	readonly previewButton: Locator;
	readonly shareReportButton: Locator;
	readonly doneButton: Locator;
	readonly shareLinkButton: Locator;
	readonly createLinkButton: Locator;
	readonly closeReportEditorButton: Locator;
	readonly exitPreviewLink: Locator;
	readonly reportLink: Locator;
	readonly reportNameField: Locator;
	readonly createReportLoading: Locator;
	readonly copyLinkButton: Locator;

	/**
	 * Creates a Report Page
	 *
	 * @param page Playwright page object
	 */
	constructor(page: Page) {
		super(page);

		this.createReportButton = this.page.getByRole('button', {
			name: 'Create Report',
			exact: true,
		});
		this.blankReportButton = this.page.getByRole('button', { name: 'Create a blank report' });
		this.templateReportButton = this.page.getByRole('button', {
			name: 'Start from a template',
		});
		this.cloneReportButton = this.page.getByRole('button', {
			name: 'Clone an existing report',
		});
		this.continueButton = this.page.getByRole('button', { name: 'Continue' });
		this.saveButton = this.page.getByRole('button', { name: 'Save' });
		this.previewButton = this.page.getByRole('button', { name: 'Preview' });
		this.doneButton = this.page.getByRole('button', { name: 'Done' });
		this.exitPreviewLink = this.page.locator('a', { hasText: 'Exit Preview' });
		this.closeButton = page.getByTestId('close-wizard');
		this.closeReportEditorButton = page.getByTestId('close-report-editor');
		this.shareReportButton = page.getByTestId('share-report');
		this.reportLink = page.getByTestId('report-link');
		this.createReportLoading = page.getByTestId('wizardCreateReportFinisherMessage');
		this.shareLinkButton = page.getByRole('button', { name: 'Share Link' });
		this.createLinkButton = page.getByRole('button', { name: 'Create Link' });
		this.copyLinkButton = page.getByRole('button', { name: 'Copy Link' });
		this.reportNameField = page.getByPlaceholder('Enter a name for your report');
	}

	/**
	 * Open report setup wizard
	 */
	async openCreateReportWizard(): Promise<void> {
		await this.createReportButton.waitFor({ state: 'visible' });
		await this.createReportButton.click();
	}

	/**
	 * Closes the report setup wizard
	 */
	async closeCreateReportWizard(): Promise<void> {
		await this.closeButton.waitFor({ state: 'visible' });
		await this.closeButton.click();
	}

	/**
	 * Selects the campaign in the setup wizard
	 *
	 * @param campaignName the campaign that the report will be created for
	 */
	async selectCampaignForReport(campaignName?: string): Promise<void> {
		if (campaignName) {
			await this.page
				.getByTestId('report-wizard-campaign-selector')
				.waitFor({ state: 'visible' });
			await this.page.getByTestId('report-wizard-campaign-selector').click();
			await this.page
				.getByRole('option', { name: new RegExp(campaignName) })
				.waitFor({ state: 'visible' });
			await this.page.getByRole('option', { name: new RegExp(campaignName) }).click();
		}
		await this.continueButton.waitFor({ state: 'visible' });
		await this.continueButton.click();
	}

	/**
	 * Selects the blank report template in the setup wizard
	 */
	async selectBlankReport(): Promise<void> {
		await this.blankReportButton.waitFor({ state: 'visible' });
		await this.blankReportButton.click();
	}

	/**
	 * Names the report in the setup wizard
	 *
	 * @param reportName the name of the report
	 */
	async nameReport(reportName: string): Promise<void> {
		await this.reportNameField.fill(reportName);
	}

	/**
	 * Creates the report
	 */
	async createReport(): Promise<void> {
		await this.continueButton.waitFor({ state: 'visible' });
		await this.continueButton.click();
		await this.page.waitForSelector('text=Creating your report');
	}

	/**
	 * Asserts that the report was created
	 *
	 * @param reportName the name of the report
	 */
	async assertReportWasCreate(reportName: string): Promise<void> {
		expect(await this.page.getByRole('textbox', { name: 'Rename' }).inputValue()).toEqual(
			reportName,
		);
		await this.page.locator('#section-cover_page').getByRole('img', { name: 'logo' }).waitFor();
	}

	/**
	 * Selects the report template to use in the setup wizard
	 *
	 * @param template the template to use
	 */
	async selectReportTemplate(template = 'Digital Marketing Report Template'): Promise<void> {
		await this.templateReportButton.waitFor({ state: 'visible' });
		await this.templateReportButton.click();
		await this.page.getByText(template).waitFor({ state: 'visible' });
		await this.page.getByText(template).click();
		await this.continueButton.waitFor({ state: 'visible' });
		await this.continueButton.click();
	}

	/**
	 * Selects which report to clone
	 *
	 * @param reportName the name of report the report to clone
	 */
	async cloneReport(reportName?: string): Promise<void> {
		await this.cloneReportButton.waitFor({ state: 'visible' });
		await this.cloneReportButton.click();
		await this.page
			.locator('li', { hasText: reportName })
			.first()
			.waitFor({ state: 'visible' });
		await this.page.locator('li', { hasText: reportName }).first().click();
		await this.continueButton.waitFor({ state: 'visible' });
		await this.continueButton.click();
	}

	/**
	 * Create's a sharable link for a report
	 */
	async createShareLink(): Promise<void> {
		await this.shareReportButton.waitFor({ state: 'visible' });
		await this.shareReportButton.click();
		await this.shareLinkButton.waitFor({ state: 'visible' });
		await this.shareLinkButton.click();
		await this.page.getByText('What time frame would you like to report on?').waitFor();
		await this.createLinkButton.waitFor({ state: 'visible' });
		await this.createLinkButton.click();
		await this.copyLinkButton.waitFor();
	}

	/**
	 * Opens the sharable link for a report
	 *
	 * @returns the newly open page containing the report
	 */
	async openSharableLink(): Promise<Page> {
		const pagePromise = this.page.context().waitForEvent('page');
		this.reportLink.waitFor({ state: 'visible' });
		this.reportLink.click();
		const newPage = await pagePromise;
		await newPage.waitForLoadState();
		return newPage;
	}
}
