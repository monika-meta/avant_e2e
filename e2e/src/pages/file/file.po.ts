import { browser, by, element, protractor } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';

export class FilePage {
    EC = protractor.ExpectedConditions;

    navigateTo() {
        return browser.get('/');
    }
    getAllTags() {
        return element.all(by.css('mat-chip[role="option"]'));
    }
    getDefaultProjectTags() {
        return element.all(by.css('mat-chip[role="option"]')).first();
    }
    getDefaultChannelTags() {
        return element.all(by.css('mat-chip[role="option"]')).get(1);
    }
    getDefaultChannelTextTags() {
        return element.all(by.css(`mat-chip[role="option"]`)).get(1).element(by.xpath('span'));
    }
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
    getFromDateInput() {
        return element(by.css('input[placeholder="From date"]'));
    }
    getToDateInput() {
        return element(by.css('input[placeholder="To date"]'));
    }
    getToggleGroutIcon() {
        return element(by.css('mat-icon[class="secondary-text mat-icon material-icons mat-icon-no-color sidebar-toggle notranslate"]'));
    }
    getMiddlePaneAllChannel() {
        return element(by.css('a[href="/dashboard/channel/bd1197a4-4f44-482e-bacd-bae08451bf2f"]'));
    }
    getSetlectTagOption2019() {
        return element.all(by.css('span[class="tag-selection-tag-category ng-star-inserted"]')).first();
    }
    getAllTableDataTags() {
        return element(by.css(`dx-data-grid#gridContainer
         > div > div:nth-of-type(6) > div > div > div > div > table > tbody > tr:nth-of-type(4) > td:nth-of-type(7) > div > div`));
    }
    getAllAutoCompleteCategotyDiv() {
        return element(by.xpath('//*[@id="mat-autocomplete-0"]/div[1]'));
    }
    getFYCategory() {
        return element(by.xpath('//*[@id="mat-autocomplete-0"]/div[1]/ul[1]/li[3]'));
    }
    getTableHeader(value) {
        return element.all(by.css(`div[role="presentation"][value="${value}"]`));
    }
    // dx-data-grid#gridContainer > div > div:nth-of-type(6) > div > div > div
    //  > div > table > tbody > tr:nth-of-type(4) > td:nth-of-type(8) > div
    getYSFileActions() {
        return this.getFileRow().all(by.css('button[mat-stroked-button]'));
    }
    getYSNameFile() {
        return this.getFileRow().element(by.css('div[class="file-list-username"]'));
    }
    getCategorySimpleInputBoxForTag() {
        return element(by.css('input[placeholder="Type tag category name here..."]'));
    }
    getCategorySimpleDropdownTag() {
        return element(by.css('div[class="mat-autocomplete-panel mat-autocomplete-visible ng-star-inserted"]'));
    }
    getLevel1InputBoxForTag() {
        return element(by.css('input[placeholder="Level 1"]'));
    }
    getLevel2InputBoxForTag() {
        return element(by.css('input[placeholder="Level 2"]'));
    }
    getLevel3InputBoxForTag() {
        return element(by.css('input[placeholder="Level 3"]'));
    }
    getLevel4InputBoxForTag() {
        return element(by.css('input[placeholder="Level 4"]'));
    }
    getLevel5InputBoxForTag() {
        return element(by.css('input[placeholder="Level 5"]'));
    }
    getLevelHierarchyNode() {
        return element(by.css('p[class="node-name"]'));
    }
    getLevelHierarchyPlusIocn() {
        return element(by.css('mat-icon[class="mat-icon-rtl-mirror folder-icon mat-icon notranslate material-icons mat-icon-no-color"]'));
    }
    getFileRow() {
        return element(by.css(`dx-data-grid#gridContainer
        > div > div:nth-of-type(6) > div > div > div > div > table > tbody > tr:nth-of-type(4)`));
    }
}
