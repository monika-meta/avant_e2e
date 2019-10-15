import { browser, by, element, protractor } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';

export class TagsPage {
    EC = protractor.ExpectedConditions;

    getSpaceName() {
        return element(by.css('p[_ngcontent-gbg-c34][class="space-name"]'));
    }
    getAddNewTagCategoryButton() {
        return element(by.xpath('//button[contains(@class,"new-tagcategory-form-button")]'));
    }
    getSearchCategoryInputBox() {
        return element(by.xpath('//*[@id="mat-tab-content-0-2"]/div[1]/channel-status[1]/div[1]/div[1]/button[2]'));
    }
    getTableHearder(col) {
        return element(by.xpath(`//tr[contains(@class,dx-header-row)]//td//p[@_ngcontent-uxw-c58][text()="${col}"]`));
    }
    getAddCategoryInput() {
        return element(by.xpath(`//input[@placeholder="Write a tagcategory Name"]`))
    }
    getAddCategoryCheckIcon() {
        return element(by.xpath(`//mat-icon[contains(@class,material-icons)][text()="check"]`));
    }
    getCategoryAddedRow(categoryName) {
        return element(by.xpath(`//tr[1][contains(@class,"dx-column-lines")]//td[@aria-describedby="dx-col-41"][text()="${categoryName}"]`))
    }
    getCategoryAddedRowDescriptionColInput() {
        return element.all(by.xpath(`//tr[1][contains(@class,"dx-edit-row")][1]//div[@class="dx-texteditor-container"]//input`)).get(1);
    }
    getCategoryAddedRowEdit() {
        return element.all(by.xpath(`//tr[1][contains(@class,"dx-column-lines")]//td[contains(@class,"dx-command-edit")]//a[@title="Edit"]`));
    }
    getCategoryAddedRowDelete() {
        return element.all(by.xpath(`//tr[1][contains(@class,"dx-column-lines")]//td[contains(@class,"dx-command-edit")]//a[@title="Delete"]`));
    }
    getCategoryAddedRowSave() {
        return element.all(by.xpath(`//tr[1][contains(@class,"dx-column-lines")]//td[contains(@class,"dx-command-edit")]//a[@title="Save"]`)).last();
    }
    getCategoryAddedRowArrow() {
        return element(by.xpath(`//tr[1][contains(@class,"dx-column-lines")]//td[contains(@class,"dx-command-expand")][@role="gridcell"]//div[@class="dx-datagrid-group-closed"]`));
    }
    getCollapsedCategoryTr() {
        return element(by.xpath(`//tr[contains(@class,"dx-master-detail-row")]`));
    }
    getCollapsedCategoryTrAddBtn() {
        return element(by.xpath(`//div[@class="dx-button-content"]//i[@class="dx-icon dx-icon-edit-button-addrow"]`));
    }
    getCollapsedCategoryTrInput() {
        return element.all(by.xpath(`//tr[@aria-rowindex="1"][contains(@class,"dx-edit-row")]//div[@class="dx-texteditor-input-container"]//input`)).last();
    }
    getCollapsedCategoryTrDescriptionTd() {
        return element.all(by.xpath(`//tr[@aria-rowindex="1"][contains(@class,"dx-edit-row")]//div[@class="dx-texteditor-input-container"]//input`)).get(1);
    }
    getCollapsedCategoryTrDiscriptionInput() {
        return element.all(by.xpath(`//tr[@aria-rowindex="1"][contains(@class,"dx-edit-row")]//div[@class="dx-texteditor-input-container"]//input`)).get(1);
    }
    getCollapsedCategoryTrEnabledCheckbox() {
        return element.all(by.xpath(`//tr[@aria-rowindex="1"][contains(@class,"dx-edit-row")]//div[@class="dx-checkbox-container"]`)).first();
    }
    getCollapsedCategoryTrVisibleCheckbox() {
        return element.all(by.xpath(`//tr[@aria-rowindex="1"][contains(@class,"dx-edit-row")]//div[@class="dx-checkbox-container"]`)).last();
    }
}
