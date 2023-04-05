import { test } from 'playwright/fixtures';
import { DashboardPage } from 'playwright/pages/DashboardPage';
import { faker } from '@faker-js/faker';

// needed for clone case, it should be run after we already have at least one dashboard
test.describe.configure({ mode: 'serial' });
test.describe('Create Dashboard', () => {
	test('Dashboard wizard can be closed', async ({ authorizedPage }) => {
		const campaignName = faker.random.alphaNumeric(24);
		const dashboardPage = new DashboardPage(authorizedPage, campaignName);
		await dashboardPage.createCampaign();
		await dashboardPage.goto();

		test.expect(await dashboardPage.wizardIsOpen()).toBe(false);
		await dashboardPage.openSetupWizard();

		test.expect(await dashboardPage.wizardIsOpen()).toBe(true);

		await dashboardPage.closeSetupWizard();
		test.expect(await dashboardPage.wizardIsOpen()).toBe(false);
	});

	test('Create an empty dashboard and delete it', async ({ authorizedPage }) => {
		const campaignName = faker.random.alphaNumeric(24);
		const dashboardName = faker.random.alphaNumeric(24);
		const dashboardPage = new DashboardPage(authorizedPage, campaignName);
		await dashboardPage.createCampaign();
		await dashboardPage.goto();

		await dashboardPage.openSetupWizard();
		await dashboardPage.createBlankDashboard();
		await dashboardPage.nameDashboard(dashboardName);
		await dashboardPage.createDashboard();

		await dashboardPage.assertDashboardIsBeingEditted();
		await dashboardPage.cancelEditting();
		await dashboardPage.getDashboardTab(dashboardName).waitFor();

		await dashboardPage.editDashboard();
		await dashboardPage.deleteDashboard();
		test.expect(await dashboardPage.getDashboardTab(dashboardName).count()).toBe(0);
	});

	test('Create dashboard from template', async ({ authorizedPage }, testInfo) => {
		testInfo.slow();
		const campaignName = faker.random.alphaNumeric(24);
		const dashboardTemplate = 'Call-Tracking Dashboard';
		const dashboardPage = new DashboardPage(authorizedPage, campaignName);
		await dashboardPage.createCampaign();
		await dashboardPage.goto();

		await dashboardPage.openSetupWizard();
		await dashboardPage.selectTemplate(dashboardTemplate);
		await dashboardPage.nameDashboard();
		await dashboardPage.createDashboard();

		await dashboardPage.cancelEditting();
		await dashboardPage.getDashboardTab(dashboardTemplate).waitFor();
	});

	test('Create clone dashboard', async ({ authorizedPage }, testInfo) => {
		testInfo.slow();
		const campaignName = faker.random.alphaNumeric(24);
		const dashboardTemplate = 'Call-Tracking Dashboard';
		const dashboardName = faker.random.alphaNumeric(24);
		const cloneName = faker.random.alphaNumeric(24);
		const dashboardPage = new DashboardPage(authorizedPage, campaignName);
		await dashboardPage.createCampaign();
		await dashboardPage.goto();

		// create first dashboard
		await dashboardPage.openSetupWizard();
		await dashboardPage.selectTemplate(dashboardTemplate);
		await dashboardPage.nameDashboard(dashboardName);
		await dashboardPage.createDashboard();
		await dashboardPage.cancelEditting();

		// clone first dashboard
		await dashboardPage.openSetupWizard();
		await dashboardPage.cloneDashboard(dashboardName);
		await dashboardPage.nameDashboard(cloneName);
		await dashboardPage.createDashboard();

		await dashboardPage.cancelEditting();
		await dashboardPage.getDashboardTab(cloneName).waitFor();
	});
});
