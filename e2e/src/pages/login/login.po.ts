import { browser, by, element, protractor } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';

export class LoginPage {
    EC = protractor.ExpectedConditions;

    navigateTo() {
        return browser.get('/');
    }

    enterUsername(username: string) {
        return this.getUsernameEle().sendKeys(username);
    }

    getUsernameEle() {
        return element(by.id('email'));
    }

    clearUsername() {
        return this.getUsernameEle().clear();
    }

    enterPassword(pswd: string) {
        return element(by.id('password')).sendKeys(pswd);
    }

    clearPassword() {
        return element(by.id('password')).clear();
    }

    getLoginBtn() {
        return element(by.id("login"));
    }

    login() {
        this.enterUsername(USERNAME);
        this.enterPassword(PASSWORD);
        browser.sleep(2000);
        this.getLoginBtn().click();
    }

    logout() {
        element(by.id('profileBtn')).click();
        browser.wait(this.EC.visibilityOf(element(by.id('logoutBtn'))));
        browser.sleep(2000);

        element(by.id('logoutBtn')).click();
    }

}