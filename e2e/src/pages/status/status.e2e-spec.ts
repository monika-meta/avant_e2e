import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';
import { USERNAME, PASSWORD } from '../../e2e-config';
import { StatusPage } from '../status/status.po';
import { HomePage } from '../home/home.po';

describe('Conversation', () => {

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
    });

    it('Verify when user click on Status tab ', () => {
        expect(statusPage.getEditButton()).toBeTruthy();
    });

    it('Verify functionality of edit icon when user clicks on it  ', () => {
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

    });
    it('Validate screen of status when no records are present ', () => {
        statusPage.getSelectedAllFieldCheckBox().each(checkbox => {
            checkbox.click();
        });
        statusPage.closeFileChooserScreen();
        expect(statusPage.getNodataSapn()).toBeTruthy();

    });
    it('Verify When user selects category and drag and drop into "ROW FIELDS"', () => {
        statusPage.getShowFieldChooserBtn().click();
        expect(statusPage.getShowFieldChooserBtn()).toBeTruthy();
        statusPage.dragAndDropData(statusPage.getDragableCheckBoxes().get(1), statusPage.getRowfields());

    });
    it('Verify When user selects category and drag and drop into "COLUMN FIELDS" ', () => {
        statusPage.dragAndDropData(statusPage.getDragableCheckBoxes().get(1), statusPage.getColumnfields());
        statusPage.closeFileChooserScreen();
    });
    it('Verify when status UI after selecting categories rows and column.', () => {
        expect(statusPage.getRowColoumnAllHeading().get(1).getText()).toEqual('Avant');
        expect(statusPage.getRowColoumnAllHeading().get(2).getText()).toEqual('Area');
        expect(statusPage.getSaveConfirmDialog()).toBeTruthy();
        expect(statusPage.getSaveDialogMessage()).toBeTruthy();
        expect(statusPage.getConfirmButtonDialog()).toBeTruthy();
        expect(statusPage.getCancelButtonDialog()).toBeTruthy();
        statusPage.getConfirmButtonDialog().click();
        browser.sleep(4000);
        expect(statusPage.getConfirmButtonDialog()).toBeFalsy();
        expect(statusPage.getCancelButtonDialog()).toBeFalsy();
    });
    it('Validate popup when user click on cell of intersection of Row and column on status detail screen', () => {
        statusPage.getNodataSapn().click();
        expect(statusPage.getSelectStatusPopup()).toBeTruthy();
        expect(statusPage.getSelectStatusCancelButton()).toBeTruthy();
        statusPage.getSelectStatusCancelButton().click();
    });

});
