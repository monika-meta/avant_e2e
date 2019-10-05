import { browser, by, element, protractor } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';

export class TagsPage {
    EC = protractor.ExpectedConditions;

    getSpaceName() {
        return element(by.css('p[_ngcontent-gbg-c34][class="space-name"]'));
    }
    getAddNewTagCategoryButton() {
        return element(by.xpath('(//tr[contains(@class,"dx-header-row")]/td//div/p[contains(text(),"Category Name")])[1]]'));
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
        return element(by.xpath(`//tr[1][contains(@class,"dx-column-lines")]//td[@aria-describedby="dx-col-42"]//input`))
    }
    getCategoryAddedRowEdit() {
        return element(by.xpath(`//tr[1][contains(@class,"dx-column-lines")]//td[contains(@class,"dx-command-edit")]//a[@title="Edit"]`));
    }
    getCategoryAddedRowDelete() {
        return element(by.xpath(`//tr[1][contains(@class,"dx-column-lines")]//td[contains(@class,"dx-command-edit")]//a[@title="Delete"]`));
    }
    getCategoryAddedRowSave() {
        return element(by.xpath(`//tr[1][contains(@class,"dx-column-lines")]//td[contains(@class,"dx-command-edit")]//a[@title="Save"]`));
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
        return element(by.xpath(`//td[@aria-describedby="dx-col-443"]//div[@class="dx-texteditor-input-container"]//input[@class="dx-texteditor-input"]`));
    }
    getCollapsedCategoryTrDescriptionTd() {
        return element(by.xpath(`//td[@aria-describedby="dx-col-443"]//div[@class="dx-texteditor-input-container"]//input[@class="dx-texteditor-input"]`));
    }
    getCollapsedCategoryTrDiscriptionInput() {
        return element(by.xpath(`//td[@aria-describedby="dx-col-443"]//div[@class="dx-texteditor-input-container"]//input[@class="dx-texteditor-input"]`));
    }
    getCollapsedCategoryTrEnabledCheckbox() {
        return element(by.xpath(`//td[@aria-describedby="dx-col-445"]//div[@class="dx-texteditor-input-container"]//input[@class="dx-texteditor-input"]`));
    }
    getCollapsedCategoryTrVisibleCheckbox() {
        return element(by.xpath(`//td[@aria-describedby="dx-col-446"]//div[@class="dx-texteditor-input-container"]//input[@class="dx-texteditor-input"]`));
    }

//td[@aria-describedby="dx-col-445"]//div[contains(@class,dx-datagrid-checkbox-size)]
}
