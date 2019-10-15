import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';
import { USERNAME, PASSWORD } from '../../e2e-config';
import { TagsPage } from './tags.po';
import { HomePage } from '../home/home.po';

describe('tags', () => {

    let tagsPage: TagsPage;
    let util: UtilPage;
    let home: HomePage;

    beforeAll(() => {
        tagsPage = new TagsPage();
        util = new UtilPage();
        home = new HomePage();
        browser.ignoreSynchronization = true;
        browser.waitForAngular();
        util.waitForElementToBeVisible(home.getHomeNavTagEle());
        expect(home.getHomeNavTagEle()).toBeTruthy();
        home.getHomeNavTagEle().click();
    });

    it('Validate UI of Tag when user clicks on the  Tag from the left pane', () => {
        browser.sleep(4000);
        expect(tagsPage.getSpaceName()).toBeTruthy();
        expect(tagsPage.getAddNewTagCategoryButton()).toBeTruthy();
        expect(tagsPage.getSearchCategoryInputBox()).toBeTruthy();
        expect(tagsPage.getTableHearder('Category Name')).toBeTruthy();
        expect(tagsPage.getTableHearder('Description')).toBeTruthy();
        expect(tagsPage.getTableHearder('Updated By ')).toBeTruthy();
        expect(tagsPage.getTableHearder('Updated On')).toBeTruthy();
    });

    it('Validate screen of status when no records are present ', () => {
        // util.waitForElementToBeVisible(tagsPage.getAddNewTagCategoryButton());
        expect(tagsPage.getAddNewTagCategoryButton()).toBeTruthy();
        tagsPage.getAddNewTagCategoryButton().click();
        util.waitForElementToBeVisible(tagsPage.getAddCategoryInput());
        expect(tagsPage.getAddCategoryInput()).toBeTruthy();
        tagsPage.getAddCategoryInput().sendKeys('test2');
        expect(tagsPage.getAddCategoryCheckIcon()).toBeTruthy();
        browser.sleep(2000);
        tagsPage.getAddCategoryCheckIcon().click();
        browser.sleep(2000);
        browser.sleep(2000);

        expect(tagsPage.getCategoryAddedRow('test2')).toBeTruthy();
        browser.sleep(2000);
        browser.sleep(2000);
        expect(tagsPage.getCategoryAddedRowEdit()).toBeTruthy();
        browser.actions().mouseMove(tagsPage.getCategoryAddedRowEdit().last()).perform();
        browser.sleep(1000);

        tagsPage.getCategoryAddedRowEdit().last().click();
        browser.sleep(1000);
        tagsPage.getCategoryAddedRowDescriptionColInput().click();
        browser.sleep(1000);
        tagsPage.getCategoryAddedRowDescriptionColInput().sendKeys('test Description');
        expect(tagsPage.getCategoryAddedRowSave()).toBeTruthy();
        browser.sleep(1000);
        tagsPage.getCategoryAddedRowSave().click();
        browser.sleep(4000);

    });

    it('Verify functionality of edit icon when user clicks on it Verify functionality of when user clicks on arrow of category  ', () => {
        expect(tagsPage.getCategoryAddedRowArrow()).toBeTruthy();
        tagsPage.getCategoryAddedRowArrow().click();
        browser.sleep(4000);
        expect(tagsPage.getCollapsedCategoryTr()).toBeTruthy();
        expect(tagsPage.getCollapsedCategoryTrAddBtn()).toBeTruthy();
        tagsPage.getCollapsedCategoryTrAddBtn().click();
        browser.sleep(2000);
        tagsPage.getCollapsedCategoryTrInput().sendKeys('test Tag');
        browser.sleep(1000);
        tagsPage.getCollapsedCategoryTrDescriptionTd().click();
        browser.sleep(2000);
        tagsPage.getCollapsedCategoryTrInput().sendKeys('test tag description');
        tagsPage.getCollapsedCategoryTrEnabledCheckbox().click();
        browser.sleep(2000);
        tagsPage.getCollapsedCategoryTrVisibleCheckbox().click();
        browser.sleep(2000);
        expect(tagsPage.getCategoryAddedRowSave()).toBeTruthy();
        tagsPage.getCategoryAddedRowSave().click();
        browser.sleep(2000);
    });
});
