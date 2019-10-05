import { browser, by, element, protractor } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';

export class MemberPage {
    EC = protractor.ExpectedConditions;

    getCheckedYSEmailDiv() {
        const userEmail = ' yashpal.sharma@metacube.com ';
        return element(by
            .xpath(`//mat-row[contains(@class,mat-row)]/mat-cell/mat-checkbox[contains(@class,"mat-checkbox-checked")]/../../mat-cell[contains(@class,"cdk-column-userName")][text()="${userEmail}"]`));
    }
    getSortingButton() {
        return element(by.xpath(`//button[@class="mat-sort-header-button"]`));

    }
    getAllEmailIDsArray() {
        return element(`//mat-row[contains(@class,mat-row)]/mat-cell[contains(@class,"mat-column-userName")]`);
    }
}
