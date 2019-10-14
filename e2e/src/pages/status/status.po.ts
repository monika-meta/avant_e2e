import { browser, by, element, protractor } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';
import { UtilPage } from '../../util/page-util';

export class StatusPage {
    EC = protractor.ExpectedConditions;
     util: UtilPage = new UtilPage();

    // get(){
    //     return element(by.css(''));
    // }
    getEditButton() {
        return element(by.xpath('//*[@id="mat-tab-content-0-2"]/div[1]/channel-status[1]/div[1]/div[1]/button[1]'));
    }
    getEditCancelButton() {
        return element(by.xpath('//*[@id="mat-tab-content-0-2"]/div[1]/channel-status[1]/div[1]/div[1]/button[1]'));
    }
    getEditSaveButton() {
        return element(by.xpath('//*[@id="mat-tab-content-0-2"]/div[1]/channel-status[1]/div[1]/div[1]/button[2]'));
    }
    getShowFieldChooserBtn() {
        return element(by.xpath(`//*[@id="mat-tab-content-0-2"]/div[1]/channel-status[1]
        /div[1]/div[2]/dx-pivot-grid[1]/div[1]/table[1]/tr[2]/td[2]/div[1]/div[1]/div[1]/i[1]`));
    }
    getFieldChooserScreen() {
        return element(by.css('div[class="dx-overlay-content dx-popup-normal dx-popup-draggable dx-resizable"]'));
    }
    getAllfields() {
        return element(by.css('div[class="dx-area dx-all-fields"]'));
    }
    getRowfields() {
        return element(by.xpath('//div[contains(@class,"dx-popup-content")]//div[contains(@class,"dx-pivotgridfieldchooser-container")]//div[@class="dx-row"][1]//div[@class="dx-col"][2]//div[@class="dx-area"][1]//div[contains(@class,"dx-pivotgrid-drag-action")]'));
    }
    getColumnfields() {
        return element(by.xpath('//div[contains(@class,"dx-popup-content")]//div[contains(@class,"dx-pivotgridfieldchooser-container")]//div[@class="dx-row"][1]//div[@class="dx-col"][2]//div[@class="dx-area"][2]//div[contains(@class,"dx-pivotgrid-drag-action")]'));
    }
    getDatafields() {
        return element(by.xpath('//div[contains(@class,"dx-popup-content")]//div[contains(@class,"dx-pivotgridfieldchooser-container")]//div[@class="dx-row"][2]//div[@class="dx-col"][2]//div[@class="dx-area"]//div[contains(@class,"dx-pivotgrid-drag-action")]'));
    }
    getFilterfields() {
        return element(by.xpath('//div[contains(@class,"dx-popup-content")]//div[contains(@class,"dx-pivotgridfieldchooser-container")]//div[@class="dx-row"][2]//div[@class="dx-col"][1]//div[@class="dx-area"]//div[contains(@class,"dx-pivotgrid-drag-action")]'));
    }
    dragAndDropData(dragable, to) {
        browser.actions().dragAndDrop(dragable, to).perform();
    }
    getAllFieldCheckBox() {
        return element.all(by.css('div[role="checkbox"]'));
    }
    getSelectedAllFieldCheckBox() {
        return element.all(by.xpath('//div[@role="checkbox"][@aria-checked="true"]//div[@class="dx-checkbox-container"]'));
    }
    
    uncheckField(div) {
        div.element(by.css('input[type="hidden"][value="true"]')).sendKeys(false);
    }
    closeFileChooserScreen() {
        this.util.waitForElementToBeVisible(element(by.css('i[class="dx-icon dx-icon-close"]')));
        return element(by.css('i[class="dx-icon dx-icon-close"]')).click();
    }
    getNodataSapn() {
        return element(by.css['span[class="dx-pivotgrid-nodata"]']);
    }
    getSelectStatusPopup() {
        return element(by.css('div[class="cdk-overlay-pane status-dialog"]'));
    }
    getSelectStatusCancelButton(){
        return element(by.xpath('//button[@class="mat-stroked-button"][@mat-stroked-button]'));
    }
    getDragableCheckBoxes() {
        return element.all(by.xpath('//span[contains(@class,"dx-area-field")]'));
    }
    getRowColoumnAllHeading() {
        return element.all(by.xpath('//td//div[contains(@class,"dx-area-field")]/div[contains(@class,"dx-area-field-content")]'));
    }
    getNewStatus() {
        return element.all(by.xpath('//span[text()="New"]'));
    }
    getSaveConfirmDialog() {
        return element(by.xpath('//div[contains(@class,"conflow-confirm-dialog")]'));
    }
    getSaveDialogMessage() {
        return element(by.xpath('//div[contains(@class,"mat-dialog-content")][text()="Status keys are changed. All statuses are reset. OK?"]'));
    }
    getConfirmButtonDialog() {
        return element(by.xpath('//button[@aria-label="Confirm"]'));
    }
    getCancelButtonDialog() {
        return element(by.xpath('//button[@aria-label="Cancel"]'));
    }
}
