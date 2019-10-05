import { browser, protractor, element, by, ElementFinder } from 'protractor';


export class UtilPage {

    EC = protractor.ExpectedConditions;
    readonly defaultWaitTime = 30000;

    async navigateToURL(path: string): Promise<void> {
        return await browser.get(path);
    }

    async waitForUrl(url: string, waitTime = this.defaultWaitTime) {
        // console.log('this.EC.urlContains(url)', this.EC.urlContains(url));
        browser.wait(this.EC.urlContains(url), waitTime);
        // this.waitForAngularEnabled();
    }

    waitForElement(id: string) {
        browser.wait(this.EC.visibilityOf(element(by.id(id))), this.defaultWaitTime);
    }

    waitForElementByEle(ele) {
        browser.wait(this.EC.visibilityOf(ele), this.defaultWaitTime);
    }

    waitForElementToBeVisible(element: ElementFinder, waitTime = this.defaultWaitTime) {
        browser.wait(this.EC.visibilityOf(element), waitTime);
    }

    waitForElementToLoadWithText(element: ElementFinder) {
        browser.wait(() => {
            return element.getText().then((text) => {
                return '' != text;
            });
        }, 10000);
    }

    async waitForAngularEnabled() {
        await browser.waitForAngularEnabled(true).then(() => {
            console.log('data');
        });
    }


    isApproachable(element) {
        return element.isPresent().then(function (present) {
            return present ? element.isDisplayed() : false;
        });
    };

    uploadFile(image) {
        const path = require('path');
        const image_path = path.resolve(__dirname, image);
        const fileElem = element(by.css('input[type="file"]'));

        fileElem.sendKeys(image_path);
        browser.driver.sleep(100);
        // element(by.css('input[type="file"]')).click();
        // element(by.css('button[data-ng-click="uploadFile(file)"]')).click();
    }

    hasClass(ele, cls) {
        return ele.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    }

}
