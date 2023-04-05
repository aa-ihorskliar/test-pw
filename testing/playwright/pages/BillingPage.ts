import { Locator, Page, expect } from '@playwright/test';
import { BasicPage } from 'playwright/pages/core/BasicPage';
import { URL_CONSTANTS } from 'playwright/constants';

/**
 * 	Billing page class.
 * 	Contains url, all locators, and methods for Billing page.
 */
export class BillingPage extends BasicPage {
	readonly url: string = URL_CONSTANTS.billing;
	readonly updateSubscriptionButton: Locator;
	readonly continueButton: Locator;
	readonly completePurchaseButton: Locator;
	readonly incrementButton: Locator;
	readonly quantityValue: Locator;
	readonly selectPlanScreen: Locator;
	readonly optionalAddonsScreen: Locator;
	readonly paymentDetailsScreen: Locator;
	readonly subscriptionUpdatedScreen: Locator;
	readonly updatingSubscriptionScreen: Locator;
	readonly creditCardNumber: Locator;
	readonly creditCardExpiration: Locator;
	readonly creditCardCVV: Locator;
	readonly address: Locator;
	readonly city: Locator;
	readonly zip: Locator;
	readonly country: Locator;

	/**
	 * @param page Playwright Page instance
	 */
	constructor(page: Page) {
		super(page);

		this.updateSubscriptionButton = this.page.getByRole('button', {
			name: 'Purchase Subscription',
		});
		this.continueButton = this.page.getByRole('button', { name: 'Continue' });
		this.completePurchaseButton = this.page.getByRole('button', { name: 'Complete Purchase' });
		this.incrementButton = this.page.getByTestId('increment-value');
		this.quantityValue = this.page.getByTestId('quantity-value');
		this.selectPlanScreen = this.page.getByText('Select your Plan');
		this.optionalAddonsScreen = this.page.getByText('Choose Optional Addons');
		this.paymentDetailsScreen = this.page.getByText('Enter your Payment Details');
		this.updatingSubscriptionScreen = this.page.getByText('Updating Subscription');
		this.subscriptionUpdatedScreen = this.page.getByText(
			'You have successfully updated your subscription! You will receive an email shortly.',
		);

		const frame = this.page.mainFrame();
		this.creditCardNumber = frame
			.frameLocator('[name="braintree-hosted-field-number"]')
			.getByPlaceholder('•••• •••• •••• ••••');

		this.creditCardExpiration = frame
			.frameLocator('[name="braintree-hosted-field-expirationDate"]')
			.getByPlaceholder('MM / YYYY');

		this.creditCardCVV = frame
			.frameLocator('[name="braintree-hosted-field-cvv"]')
			.getByPlaceholder('•••');

		this.address = this.page.getByPlaceholder('Address');
		this.city = this.page.getByPlaceholder('City');
		this.zip = this.page.getByPlaceholder('Zip');
		this.country = this.page.getByRole('listbox');
	}

	/**
	 * Set plan options
	 *
	 * @param plan the plan params
	 * @param plan.campaignsQuantity amount of campaigns
	 */
	async setPlan({ campaignsQuantity }: { campaignsQuantity: number }): Promise<void> {
		await this.updateSubscriptionButton.click();
		await this.selectPlanScreen.waitFor();

		while (Number(await this.quantityValue.textContent()) < campaignsQuantity) {
			await this.incrementButton.click();
		}

		await expect(await this.quantityValue.textContent()).toEqual(String(campaignsQuantity));
		await this.continueButton.click();
	}

	/**
	 * Set plan addons
	 */
	async setAddons(): Promise<void> {
		await this.optionalAddonsScreen.waitFor();
		await this.continueButton.click();
	}

	/**
	 * Set payment details
	 *
	 * @param details plan details params
	 * @param details.cardNumber credit card number
	 * @param details.cardExpiration credit card expiration date
	 * @param details.cardCVV credit card cvv code
	 * @param details.country billing address country name
	 * @param details.city billing address city name
	 * @param details.address billing address street address
	 * @param details.zip billing address zip code
	 */
	async setPaymentDetails({
		cardNumber = '4242 4242 4242 4242',
		cardExpiration = '12/35',
		cardCVV = '123',
		country = 'Canada',
		city,
		address,
		zip,
	}: {
		cardNumber?: string;
		cardExpiration?: string;
		cardCVV?: string;
		country?: string;
		city: string;
		address: string;
		zip: string;
	}): Promise<void> {
		await this.paymentDetailsScreen.waitFor();

		await this.address.type(address);
		await this.city.type(city);
		await this.zip.type(zip);
		await this.country.click();
		await this.page.locator(`text="${country}"`).first().click();

		await this.creditCardNumber.type(cardNumber);
		await this.creditCardExpiration.type(cardExpiration);
		await this.creditCardCVV.type(cardCVV);

		await this.completePurchaseButton.click();
		await this.subscriptionUpdatedScreen.waitFor();
	}
}
