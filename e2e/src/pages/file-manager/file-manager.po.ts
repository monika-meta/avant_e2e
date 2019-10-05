import { browser, by, element, protractor } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';

export class StatusPage {
    EC = protractor.ExpectedConditions;

    // get(){
    //     return element(by.css(''));
    // }
    getInputBoxForTag() {
        return element(by.css('input[placeholder="Type tag name here..."]'));
    }
    getFilterDropDown() {
        return element(by.id('mat-select-0'));
    }
    getFilterDropDownOtions() {
        return element.all(by.css('mat-option[role="option"]'));
    }
    getFilterDropDownOtionOne() {
        return element(by.cssContainingText('.mat-option-text', 'Tag Value Simple Filter'));
    }
    getFilterDropDownOtionTwo() {
        return element(by.cssContainingText('.mat-option-text', 'Tag Category Simple Filter'));
    }
    getFilterDropDownOtionThree() {
        return element(by.cssContainingText('.mat-option-text', 'Tag Category Hierarchy Filter'));
    }
}
