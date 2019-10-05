
import { HomePage } from './home.po';
import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';
import { USERNAME, PASSWORD } from '../../e2e-config';


let util: UtilPage;

describe('Home', () => {

    let homePage: HomePage;

    beforeAll(() => {
        homePage = new HomePage();
        util = new UtilPage();


        browser.ignoreSynchronization = true;

        browser.waitForAngular();
        browser.wait(protractor.ExpectedConditions.visibilityOf(homePage.getHomeLogoEle()), 10000);
    });


    it('Verify left pane items', () => {
        expect(homePage.getHomeLogoEle()).toBeTruthy();
        expect(homePage.getHomeLogoTextEle()).toBeTruthy();
        // homePage.getHomeLogoBindText().then(text => {
        //     expect(text).toEqual('DIVA Cloud');

        // });
        expect(homePage.getHomeLogoTextEle().getText() ).toEqual('DIVA Cloud');

        expect(homePage.getHomeToggleBtnEle()).toBeTruthy();
    });

    it('Verify tabs under APPLICATIONS', () => {
        expect(homePage.getHomeNavChannelEle()).toBeTruthy();
        expect(homePage.getHomeNavFileManagerEle()).toBeTruthy();
        expect(homePage.getHomeNavSettingEle()).toBeTruthy();
        expect(homePage.getHomeNavTagEle()).toBeTruthy();

    });

    it('Verify Space drop down ', () => {
        expect(homePage.getHomeSpaceDropdownEle()).toBeTruthy();
    });

    it('Validate middle UI (Pane)', () => {
        const space = homePage.getHomeSpaceCollapsableEle();
        const Projects = space.all(space).first();
        const channels = Projects.all(space).first();
        expect(space).toBeTruthy();
        expect(Projects).toBeTruthy();
        expect(channels).toBeTruthy();

    });
    it('Validate headers of  in third Pane.', () => {
        const count = element.all(by.css('#homeBreadcrumb li')).count();
        expect(count).toEqual(3);
        expect(homePage.getHomeTabConversationEle()).toBeTruthy();
        expect(homePage.getHomeTabFilesEle()).toBeTruthy();
        expect(homePage.getHomeTabStatusEle()).toBeTruthy();
        expect(homePage.getHomeTabMembersEle()).toBeTruthy();

    });
});
