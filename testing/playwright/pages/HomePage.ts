import { BasicPage } from 'playwright/pages/core/BasicPage';
import { URL_CONSTANTS } from 'playwright/constants';

/**
 *	Home page class.
 */
export class HomePage extends BasicPage {
	readonly url: string = URL_CONSTANTS.home;
}
