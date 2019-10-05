import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';
import { USERNAME, PASSWORD } from '../../e2e-config';
import { TagsPage } from './tags.po';
import { HomePage } from '../home/home.po';

describe('Conversation', () => {

    let tagsPage: TagsPage;
    let util: UtilPage;
    let home: HomePage;

    beforeAll(() => {

        tagsPage = new TagsPage();
        util = new UtilPage();
        home = new HomePage();
        browser.ignoreSynchronization = true;

        browser.waitForAngular();
        util.waitForElementToBeVisible(home.getHomeNavFileManagerEle());
        expect(home.getHomeNavFileManagerEle()).toBeTruthy();
        home.getHomeNavFileManagerEle().click();
    });

    it('Validate UI of Tag when user clicks on the  Tag from the left pane', () => {
        expect(tagsPage.getSpaceName()).toBeTruthy();
        expect(tagsPage.getAddNewTagCategoryButton()).toBeTruthy();
        expect(tagsPage.getSearchCategoryInputBox()).toBeTruthy();
        expect(tagsPage.getTableHearder('Category Name')).toBeTruthy();
        expect(tagsPage.getTableHearder('Description')).toBeTruthy();
        expect(tagsPage.getTableHearder('Updated By ')).toBeTruthy();
        expect(tagsPage.getTableHearder('Updated On')).toBeTruthy();
    });

    it('Validate screen of status when no records are present ', () => {
        tagsPage.getAddNewTagCategoryButton().click();
        expect(tagsPage.getAddCategoryInput()).toBeTruthy();
        tagsPage.getAddCategoryInput().sendText('test');
        expect(tagsPage.getAddCategoryCheckIcon()).toBeTruthy();
        tagsPage.getAddCategoryCheckIcon().click();
        expect(tagsPage.getCategoryAddedRow('test')).toBeTruthy();
        expect(tagsPage.getCategoryAddedRowEdit()).toBeTruthy();
        tagsPage.getCategoryAddedRowEdit().click();
        tagsPage.getCategoryAddedRowDescriptionColInput().click();
        tagsPage.getCategoryAddedRowDescriptionColInput().sendText('test Description');
        expect(tagsPage.getCategoryAddedRowSave()).toBeTruthy();
        tagsPage.getCategoryAddedRowSave().click();


    });
    it('Verify functionality of edit icon when user clicks on it Verify functionality of when user clicks on arrow of category  ', () => {
        expect(tagsPage.getCategoryAddedRowArrow()).toBeTruthy();
        tagsPage.getCategoryAddedRowArrow().click();
        expect(tagsPage.getCollapsedCategoryTr()).toBeTruthy();
        expect(tagsPage.getCollapsedCategoryTrAddBtn()).toBeTruthy();
        tagsPage.getCollapsedCategoryTrAddBtn().click();
        tagsPage.getCollapsedCategoryTrInput().sendText('test Tag');
        tagsPage.getCollapsedCategoryTrDescriptionTd().click();
        tagsPage.getCollapsedCategoryTrInput().sendText('test tag description');
        tagsPage.getCollapsedCategoryTrEnabledCheckbox().click();
        tagsPage.getCollapsedCategoryTrVisibleCheckbox().click();
        expect(tagsPage.getCategoryAddedRowSave()).toBeTruthy();
        tagsPage.getCategoryAddedRowSave().click();
    });
});
