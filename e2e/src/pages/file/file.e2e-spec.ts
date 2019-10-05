import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';
import { USERNAME, PASSWORD } from '../../e2e-config';
import { FilePage } from '../file/file.po';
import { HomePage } from '../home/home.po';

describe('file', () => {

    let filePage: FilePage;
    let util: UtilPage;
    let home: HomePage;


    beforeAll(() => {

        filePage = new FilePage();
        util = new UtilPage();
        home = new HomePage();
        browser.ignoreSynchronization = true;
        util.waitForElementToBeVisible(home.getHomeTabFilesEle(), 350000);
        browser.waitForAngular();
    });
    it('Validate search header of Files tab', () => {
        browser.sleep(4000);
        util.waitForElementToBeVisible(home.getHomeTabFilesEle());
        expect(home.getHomeTabFilesEle()).toBeTruthy();

        home.getHomeTabFilesEle().click();
        util.waitForElementToBeVisible(filePage.getDefaultProjectTags());
        expect(filePage.getDefaultProjectTags()).toBeTruthy();
        expect(filePage.getDefaultProjectTags().getAttribute('class')).not.toContain('mat-chip-with-trailing-icon');
        expect(filePage.getDefaultChannelTags()).toBeTruthy();
        expect(filePage.getDefaultChannelTags().getAttribute('class')).not.toContain('mat-chip-with-trailing-icon');
        expect(filePage.getInputBoxForTag()).toBeTruthy();
        expect(filePage.getFilterDropDown()).toBeTruthy();
        browser.sleep(4000);
        util.waitForElementToBeVisible(filePage.getFilterDropDown());
        filePage.getFilterDropDown().click();
        util.waitForElementToBeVisible(filePage.getFilterDropDownOtions().first());
        expect(filePage.getFilterDropDownOtions().count()).toEqual(3);
        expect(filePage.getFilterDropDownOtionOne()).toBeTruthy();
        expect(filePage.getFilterDropDownOtionTwo()).toBeTruthy();
        expect(filePage.getFilterDropDownOtionThree()).toBeTruthy();
        filePage.getFilterDropDownOtionOne().click();
        expect(filePage.getFromDateInput()).toBeTruthy();
        expect(filePage.getToDateInput()).toBeTruthy();
    });
    it('Verify change of Project and channel when user selects project/Channel from middle page', () => {
        browser.sleep(3000);
        expect(filePage.getToggleGroutIcon()).toBeTruthy();
        filePage.getToggleGroutIcon().click();
        browser.sleep(2000);
        util.waitForElementToBeVisible(filePage.getMiddlePaneAllChannel());
        expect(filePage.getMiddlePaneAllChannel()).toBeTruthy();
        filePage.getMiddlePaneAllChannel().click();
        util.waitForElementToBeVisible(filePage.getDefaultChannelTags());
        browser.sleep(3000);
        expect(filePage.getDefaultChannelTags()).toBeTruthy();
        expect(filePage.getDefaultChannelTextTags().getText()).toMatch('@All');
    });
    it('Verify search result should be filter corresponding to typed tag name', () => {
        browser.sleep(2000);
        util.waitForElementToBeVisible(filePage.getInputBoxForTag());
        filePage.getInputBoxForTag().click();
        filePage.getInputBoxForTag().sendKeys('2019');
        browser.sleep(3000);
        // util.waitForElementToBeVisible(filePage.getSetlectTagOption2019());
        browser.actions().mouseMove(filePage.getSetlectTagOption2019()).perform();
        browser.sleep(2000);
        filePage.getSetlectTagOption2019().click();
        // util.waitForElementToBeVisible(filePage.getAllTableDataTags().first());
        browser.sleep(2000);
        // util.waitForElementToBeVisible(filePage.getAllTableDataTags().first());
        expect(filePage.getAllTableDataTags().getText()).toContain('@All');


    });
    it('Verify all categories should be displayed', () => {
        browser.sleep(2000);
        util.waitForElementToBeVisible(filePage.getInputBoxForTag());
        filePage.getInputBoxForTag().click();
        browser.sleep(2000);
        // util.waitForElementToBeVisible(filePage.getAllAutoCompleteCategotyDiv());
        expect(filePage.getAllAutoCompleteCategotyDiv()).toBeTruthy();
    });
    it('Verify when user selects category then all its tags should be displayed', () => {
        browser.sleep(2000);
        filePage.getFYCategory().click();
        expect(filePage.getFilterDropDownOtions().count()).toEqual(2);
    });
    it(`Verify all files of selected channel should be displayed when user selects File
     tab and default filter Tag Value Simple Filter`, () => {
        expect(filePage.getTableHeader('Name')).toBeTruthy();
        expect(filePage.getTableHeader('Type')).toBeTruthy();
        expect(filePage.getTableHeader('Uploaded On')).toBeTruthy();
        expect(filePage.getTableHeader('Size')).toBeTruthy();
        expect(filePage.getTableHeader('Uploaded By')).toBeTruthy();
        expect(filePage.getTableHeader('Tags')).toBeTruthy();
        expect(filePage.getTableHeader('Actions')).toBeTruthy();
    });

    it('Verify actions of search result of file tab when default filter Tag Value Simple Filter', () => {
        // console.log("*****************************", filePage.getYSFileActions());
        browser.sleep(4000);
        expect(filePage.getFileRow()).toBeTruthy();
        filePage.getYSNameFile().getText().then(name => {
            if (name === 'Yashpall Sharmaa') {
                expect(filePage.getYSFileActions().count()).toEqual(3);

            } else {
                expect(filePage.getYSFileActions().count()).toEqual(1);
            }
        })

    });

    it('Verify functionality of Tag Category Simple Filter" ', () => {
        browser.sleep(4000);
        util.waitForElementToBeVisible(filePage.getFilterDropDown());
        filePage.getFilterDropDown().click();
        // util.waitForElementToBeVisible(filePage.getFilterDropDownOtions().first());
        expect(filePage.getFilterDropDownOtionTwo()).toBeTruthy();
        filePage.getFilterDropDownOtionTwo().click();
        util.waitForElementToBeVisible(filePage.getCategorySimpleInputBoxForTag());
        filePage.getCategorySimpleInputBoxForTag().click();
        expect(filePage.getCategorySimpleDropdownTag()).toBeTruthy();
        filePage.getFilterDropDownOtions().first().click();
        browser.sleep(2000);
        expect(filePage.getAllTableDataTags().getText()).toContain('@All');
    });
    it('Verify functionality of Tag Category Hierarchy Filter"  at Level 1 when user select Level 1 tag', () => {
        browser.sleep(4000);
        // util.waitForElementToBeVisible(filePage.getFilterDropDown());
        filePage.getFilterDropDown().click();
        // util.waitForElementToBeVisible(filePage.getFilterDropDownOtions().first());
        expect(filePage.getFilterDropDownOtionThree()).toBeTruthy();
        filePage.getFilterDropDownOtionThree().click();
        filePage.getLevel1InputBoxForTag().click();
        // util.waitForElementToBeVisible(filePage.getFilterDropDownOtions().first());

        browser.actions().mouseMove(filePage.getFilterDropDownOtions().first()).perform();

        filePage.getFilterDropDownOtions().first().click();
        expect(filePage.getLevelHierarchyNode().getText()).toEqual('Qcat8tag1');
    });
    it('Verify functionality of Tag Category Hierarchy Filter" at Level1 and Level2', () => {
        filePage.getLevel2InputBoxForTag().click();
        util.waitForElementToBeVisible(filePage.getFilterDropDownOtions().first());

        browser.actions().mouseMove(filePage.getFilterDropDownOtions().first()).perform();

        filePage.getFilterDropDownOtions().first().click();
        expect(filePage.getLevelHierarchyPlusIocn()).toBeTruthy();
        filePage.getLevelHierarchyPlusIocn().click();

    });

});
