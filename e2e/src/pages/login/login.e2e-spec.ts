
import { LoginPage } from './login.po';
import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';
import { USERNAME, PASSWORD } from '../../e2e-config';
import { ProfilePage } from '../profile/profile.po';


let util: UtilPage;

describe('login', () => {

    let loginPage: LoginPage;
    let profilePage: ProfilePage;

    beforeAll(() => {
        browser.driver.manage().window().maximize();
        loginPage = new LoginPage();
        util = new UtilPage();
        profilePage = new ProfilePage();

        loginPage.navigateTo();

        browser.ignoreSynchronization = true;

        browser.waitForAngular();
        browser.wait(protractor.ExpectedConditions.visibilityOf(loginPage.getUsernameEle()), 10000);
    });

    afterAll(() => {
        browser.sleep(2000);
        util.waitForElement('profileBtn');
        profilePage.getProfileImgEle().click();
        browser.sleep(2000);
        util.waitForElement('profileEditBtn');
        profilePage.getProfileEditBtnEle().click();
        util.waitForElement('firstNameEdit');
        profilePage.getFirstNameEle().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        profilePage.getFirstNameEle().sendKeys(protractor.Key.BACK_SPACE);
        profilePage.getFirstNameEle().clear();
        profilePage.getLastNameEle().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        profilePage.getLastNameEle().sendKeys(protractor.Key.BACK_SPACE);
        profilePage.getLastNameEle().clear();
        profilePage.enterFirstName('Yashpal');
        profilePage.enterLastName('Sharma');
        profilePage.getProfileEditSaveBtnEle().click();
        browser.sleep(2000);
        profilePage.getFirstCollapsableDiv();
    });


    // it('should disable login button if user not entered username and password', () => {
    //     loginPage.clearUsername();
    //     loginPage.clearPassword();

    //     expect(loginPage.getLoginBtn().getAttribute('disabled')).toBeTruthy();
    // });


    // it('should disable login button if user not entered password', () => {
    //     loginPage.clearUsername();
    //     loginPage.clearPassword();

    //     loginPage.enterUsername(USERNAME);

    //     expect(loginPage.getLoginBtn().getAttribute('disabled')).toBeTruthy();
    // });


    it('should login', () => {
        loginPage.clearUsername();
        loginPage.clearPassword();

        loginPage.enterUsername(USERNAME);
        loginPage.enterPassword(PASSWORD);
        loginPage.getLoginBtn().click();
        util.waitForUrl('dashboard');
        expect(browser.driver.getCurrentUrl()).toContain('dashboard');
    });

    // it('should log out', () => {
    //     loginPage.logout();
    //  });

    // it('should login again', () => {
    //     loginPage.clearUsername();
    //     loginPage.clearPassword();

    //     loginPage.enterUsername(USERNAME);
    //     loginPage.enterPassword(PASSWORD);
    //     loginPage.getLoginBtn().click();
    //     util.waitForUrl('dashboard');
    //     expect(browser.driver.getCurrentUrl()).toContain('dashboard');
    // });


})