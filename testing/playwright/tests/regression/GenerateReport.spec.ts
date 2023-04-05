import { test } from 'playwright/fixtures';
import { ReportPage } from 'playwright/pages/ReportPage';
import { faker } from '@faker-js/faker';

/**
 * Generates new report name
 *
 * @returns report name
 */
const createReportName = (): string => `${faker.random.alphaNumeric(24)} Report`;

// needed for clone case, it should be run after we already have at least one report
test.describe.configure({ mode: 'serial' });
test.describe('Generate report', () => {
	test('Generate Report window can be closed', async ({ authorizedPage }) => {
		const reportPage = new ReportPage(authorizedPage.page);
		await reportPage.goto();

		await reportPage.openCreateReportWizard();
		await reportPage.closeCreateReportWizard();
	});

	test('Create blank report', async ({ authorizedPage }) => {
		const reportName = createReportName();
		const reportPage = new ReportPage(authorizedPage.page);
		await reportPage.goto();

		await reportPage.openCreateReportWizard();
		await reportPage.selectCampaignForReport();
		await reportPage.selectBlankReport();
		await reportPage.nameReport(reportName);
		await reportPage.createReport();

		await reportPage.assertReportWasCreate(reportName);
	});

	test('Create report from template and share', async ({ authorizedPage }, testInfo) => {
		const reportName = createReportName();
		const reportPage = new ReportPage(authorizedPage.page);
		await reportPage.goto();

		// create report
		await reportPage.openCreateReportWizard();
		await reportPage.selectCampaignForReport();
		await reportPage.selectReportTemplate();
		await reportPage.nameReport(reportName);
		await reportPage.createReport();
		await reportPage.assertReportWasCreate(reportName);

		// share
		await reportPage.createShareLink();
		const sharePage = await reportPage.openSharableLink();
		await sharePage.locator('#section-cover_page').getByRole('img', { name: 'logo' }).waitFor();
	});

	test('Clone report', async ({ authorizedPage }, testInfo) => {
		testInfo.slow();
		const reportName = createReportName();
		const cloneName = `${reportName} clone`;
		const reportPage = new ReportPage(authorizedPage.page);
		await reportPage.goto();

		// create first report
		await reportPage.openCreateReportWizard();
		await reportPage.selectCampaignForReport();
		await reportPage.selectReportTemplate();
		await reportPage.nameReport(reportName);
		await reportPage.createReport();
		await reportPage.assertReportWasCreate(reportName);

		// clone report
		await reportPage.goto();
		await reportPage.openCreateReportWizard();
		await reportPage.selectCampaignForReport();
		await reportPage.cloneReport(reportName);
		await reportPage.nameReport(cloneName);
		await reportPage.createReport();
		await reportPage.assertReportWasCreate(cloneName);
	});
});
