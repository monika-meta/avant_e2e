import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';
import { USERNAME, PASSWORD } from '../../e2e-config';
import { HomePage } from '../home/home.po';
import { FilePage } from '../file/file.po';

describe('Conversation', () => {

    let util: UtilPage;
    let home: HomePage;
    let filePage: FilePage;

    beforeAll(() => {

        filePage = new FilePage();
        util = new UtilPage();
        home = new HomePage();
        browser.ignoreSynchronization = true;
        browser.waitForAngular();
        util.waitForElementToBeVisible(home.getHomeNavFileManagerEle());
        expect(home.getHomeNavFileManagerEle()).toBeTruthy();
        home.getHomeNavFileManagerEle().click();
    });

    it('Validate search header of Files tab', () => {
        browser.sleep(4000);
        // util.waitForElementToBeVisible(home.getHomeTabFilesEle());
        // expect(home.getHomeTabFilesEle()).toBeTruthy();

        // home.getHomeTabFilesEle().click();
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
});
