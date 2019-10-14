import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';
import { USERNAME, PASSWORD } from '../../e2e-config';
import { StatusPage } from '../status/status.po';
import { HomePage } from '../home/home.po';

describe('status', () => {

    let statusPage: StatusPage;
    let util: UtilPage;
    let home: HomePage;

    beforeAll(() => {

        statusPage = new StatusPage();
        util = new UtilPage();
        home = new HomePage();


        browser.ignoreSynchronization = true;

        browser.waitForAngular();
        util.waitForElementToBeVisible(home.getHomeTabStatusEle());
        expect(home.getHomeTabStatusEle()).toBeTruthy();
        home.getHomeTabStatusEle().click();
        browser.sleep(4000);

    });

    it('Verify when user click on Status tab ', () => {
        util.waitForElementToBeVisible(statusPage.getEditButton());

        expect(statusPage.getEditButton()).toBeTruthy();
    });

    it('Verify functionality of edit icon when user clicks on it  ', () => {
        util.waitForElementToBeVisible(statusPage.getEditButton());

        statusPage.getEditButton().click();
        util.waitForElementToBeVisible(statusPage.getEditSaveButton());
        expect(statusPage.getEditCancelButton()).toBeTruthy();
        expect(statusPage.getEditSaveButton()).toBeTruthy();
        expect(statusPage.getShowFieldChooserBtn()).toBeTruthy();
    });
    it('Verify functionality of  Show Field Chooser icon when user clicks on it', () => {
        statusPage.getShowFieldChooserBtn().click();
        expect(statusPage.getShowFieldChooserBtn()).toBeTruthy();
    });
    it('UI validation of "Field Chooser" ', () => {
        expect(statusPage.getAllfields()).toBeTruthy();
        expect(statusPage.getRowfields()).toBeTruthy();
        expect(statusPage.getColumnfields()).toBeTruthy();
        expect(statusPage.getDatafields()).toBeTruthy();
        expect(statusPage.getFilterfields()).toBeTruthy();
        expect(statusPage.getSelectedAllFieldCheckBox()).toBeTruthy();
    });
    it('Validate screen of status when no records are present ', () => {
        browser.sleep(4000);
        // console.log("IIIIIIIIIIIIIIIIIIIIII", statusPage.getSelectedAllFieldCheckBox().length);
        // for (let i = 0 ; i < 3; i++) {
        //     console.log("IIIIIIIIIIIIIIIIIIIIII", i);
        //     statusPage.getSelectedAllFieldCheckBox().get(i).click();
        // }
        function wait(ms) {
            var start = Date.now(),
                now = start;
            while (now - start < ms) {
                now = Date.now();
            }
        }

        statusPage.getSelectedAllFieldCheckBox().count().then(function (size) {
            for (let i = 0; i < size; i++) {
                console.log("IIIIIIIIIIIIIIIIIIIIII", i);
                browser.actions().mouseMove(statusPage.getSelectedAllFieldCheckBox().get(0)).perform();
                wait(2000);
                statusPage.getSelectedAllFieldCheckBox().get(0).click();
            //     browser.executeScript(function (ele) {
            //         ele[0].style.visibility = 'visible';
            //         ele[0].style.display = 'block';
            //     }, statusPage.getSelectedAllFieldCheckBox().get(i).getWebElement());
            }
        });
        browser.sleep(3000);
        statusPage.closeFileChooserScreen();
        // browser.sleep(2000);
        // util.waitForElementToBeVisible(statusPage.getNodataSapn());
        // expect(statusPage.getNodataSapn()).toBeTruthy();
    });
    it('Verify When user selects category and drag and drop into "ROW FIELDS"', () => {
        util.waitForElementToBeVisible(statusPage.getShowFieldChooserBtn());
        // expect(statusPage.getShowFieldChooserBtn()).toBeTruthy();
        statusPage.getShowFieldChooserBtn().click();
        browser.sleep(3000);

        util.waitForElementToBeVisible(statusPage.getDragableCheckBoxes().get(1));
        statusPage.dragAndDropData(statusPage.getDragableCheckBoxes().get(1), statusPage.getRowfields());
    });
    it('Verify When user selects category and drag and drop into "COLUMN FIELDS" ', () => {
        statusPage.dragAndDropData(statusPage.getDragableCheckBoxes().get(2), statusPage.getColumnfields());
        statusPage.closeFileChooserScreen();
    });
    it('Verify when status UI after selecting categories rows and column.', () => {
        // expect(statusPage.getRowColoumnAllHeading().get(0).getText()).toEqual('Avant');  
        // expect(statusPage.getRowColoumnAllHeading().get(1).getText()).toEqual('Area');
        browser.sleep(3000);
        util.waitForElementToBeVisible(statusPage.getEditSaveButton());
        statusPage.getEditSaveButton().click();
        expect(statusPage.getSaveConfirmDialog()).toBeTruthy();
        expect(statusPage.getSaveDialogMessage()).toBeTruthy();
        expect(statusPage.getConfirmButtonDialog()).toBeTruthy();
        expect(statusPage.getCancelButtonDialog()).toBeTruthy();
        statusPage.getConfirmButtonDialog().click();
        browser.sleep(4000);
        // expect(statusPage.getConfirmButtonDialog()).toBeFalsy();
        // expect(statusPage.getCancelButtonDialog()).toBeFalsy();
    });
    it('Validate popup when user click on cell of intersection of Row and column on status detail screen', () => {
        statusPage.getNewStatus().click();
        expect(statusPage.getSelectStatusPopup()).toBeTruthy();
        expect(statusPage.getSelectStatusCancelButton()).toBeTruthy();
        statusPage.getSelectStatusCancelButton().click();
    });

});
