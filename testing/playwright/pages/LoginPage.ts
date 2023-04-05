import { Locator, Page } from '@playwright/test';
import { URL_CONSTANTS } from 'playwright/constants';
import { BasicPage } from './core/BasicPage';
import { waitForReCaptcha } from 'playwright/utils/auth';

/**
 *	Login page class.
 * 	Contains url, all locators, and methods for Login page.
 */
export class LoginPage extends BasicPage {
	readonly url: string = URL_CONSTANTS.login;
	readonly email: Locator;
	readonly password: Locator;
	readonly submitButton: Locator;
	readonly googleButton: Locator;
	readonly genericError: Locator;

	/**
	 * @param page Playwright page object
	 */
	constructor(page: Page) {
		super(page);

		//TODO: revert back to using getByPlaceholder for both email and password after LoginV1 is removed.
		this.email = page.getByTestId('emailTextBox');
		this.password = page.getByTestId('passwordTextBox');
		this.submitButton = page.getByRole('button', { name: 'Login', exact: true });
		this.googleButton = page.getByRole('button', { name: 'Login with Google' });

		this.genericError = page.getByTestId('form-generic-error-box');
	}

	/**
	 * Login the user
	 *
	 * @param user the user's login info
	 * @param user.email user email
	 * @param user.password user password
	 */
	async login({ email, password }: { email?: string; password?: string }): Promise<void> {
		await waitForReCaptcha(this.page);
		if (email) await this.email.fill(email);
		if (password) await this.password.fill(password);
		await this.submitButton.click();
	}

	/**
	 * Wait for form validation error
	 *
	 * @param errorMessage error message to wait for
	 */
	async waitForFormValidation(errorMessage: string): Promise<void> {
		await this.page.getByText(errorMessage).waitFor();
	}
}
