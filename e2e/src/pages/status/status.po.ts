import { browser, by, element, protractor } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';

export class StatusPage {
    EC = protractor.ExpectedConditions;

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
        return element(by.xpath('body/div[2]/div[1]/div[2]/div[2]/div[1]/div[2]/div[1]/div[2]'));
    }
    getColumnfields() {
        return element(by.xpath('body/div[2]/div[1]/div[2]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]'));
    }
    getDatafields() {
        return element(by.xpath('body/div[2]/div[1]/div[2]/div[2]/div[1]/div[2]/div[2]/div[2]'));
    }
    getFilterfields() {
        return element(by.xpath('body/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[1]/div[2]'));
    }
    dragAndDropData(dragable, to) {
        const JS_HTML5_DND = `function e(e,t,n,i){var r=a.createEvent("DragEvent");r.initMouseEvent(t,!0,!0,o,0,0,0,c,g,!1,!1,!1,!1,0,null),Object.defineProperty(r,"dataTransfer",{get:function(){return d}}),e.dispatchEvent(r),o.setTimeout(i,n)}var t=arguments[0],n=arguments[1],i=arguments[2]||0,r=arguments[3]||0;if(!t.draggable)throw new Error("Source element is not draggable.");var a=t.ownerDocument,o=a.defaultView,l=t.getBoundingClientRect(),u=n?n.getBoundingClientRect():l,c=l.left+(l.width>>1),g=l.top+(l.height>>1),s=u.left+(u.width>>1)+i,f=u.top+(u.height>>1)+r,d=Object.create(Object.prototype,{_items:{value:{}},effectAllowed:{value:"all",writable:!0},dropEffect:{value:"move",writable:!0},files:{get:function(){return this._items.Files}},types:{get:function(){return Object.keys(this._items)}},setData:{value:function(e,t){this._items[e]=t}},getData:{value:function(e){return this._items[e]}},clearData:{value:function(e){delete this._items[e]}},setDragImage:{value:function(e){}}});if(n=a.elementFromPoint(s,f),!n)throw new Error("The target element is not interactable and need to be scrolled into the view.");u=n.getBoundingClientRect(),e(t,"dragstart",101,function(){var i=n.getBoundingClientRect();c=i.left+s-u.left,g=i.top+f-u.top,e(n,"dragenter",1,function(){e(n,"dragover",101,function(){n=a.elementFromPoint(c,g),e(n,"drop",1,function(){e(t,"dragend",1,callback)})})})})`;
        browser.executeScript(JS_HTML5_DND, dragable.getWebElement(), to.getWebElement());
    }
    getAllFieldCheckBox() {
        return element.all(by.css('div[role="checkbox"]'));
    }
    getSelectedAllFieldCheckBox() {
        return element.all(by.css('div[role="checkbox"][aria-checked="true"]'));
    }
    uncheckField(div) {
        div.element(by.css('input[type="hidden"][value="true"]')).sendKeys(false);
    }
    closeFileChooserScreen() {
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
