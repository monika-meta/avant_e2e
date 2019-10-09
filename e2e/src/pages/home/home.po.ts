import { browser, by, element, protractor } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';

export class HomePage {
    EC = protractor.ExpectedConditions;

    navigateTo() {
        return browser.get('/');
    }


    getHomeLogoEle() {
        return element(by.id('homeLogo'));
    }
    selectLanguageBtnHeader(){
        return element(by.xpath(`//*[@id="mat-content__id"]/div[1]/app-header[1]/mat-toolbar[1]/button[3]`));
    }
    getLanguageTranslateEle() {
        return element(by.id('translateDropdown'));
    }
    getLanguageTranslateOptionEle(index) {
        return element(by.xpath(`//button[@id="translateDropdown"][${index}]`));
    }
    getHomeLogoTextEle() {
        return element(by.id('homeLogoText'));
    }

    getHomeLogoBindText() {
        return this.getHomeLogoTextEle().getText();
    }

    getHomeToggleBtnEle() {
        return element(by.id('homeToggleBtn'));
    }
    getHomeNavChannelEle() {
        return element(by.id('HomeNavChannel'));
    }

    getHomeNavFileManagerEle() {
        return element(by.id('HomeNavFileManager'));
    }
    getHomeNavSettingEle() {
        return element(by.id('HomeNavSetting'));
    }
    getHomeNavTagEle() {
        return element(by.id('HomeNavTag'));
    }
    getHomeSpaceDropdownEle() {
        return element(by.id('homeSpaceDropdown'));
    }
    getHomeSpaceCollapsableEle() {
        return element(by.id('spaceCollapsable'));
    }

    getHomeBreadcrumbEle() {
        return element(by.id('homeBreadcrumb'));
    }

    getHomeBreadcrumbListEle() {
        return element(by.xpath('//ul[@id="homeBreadcrumb"]//li'));
    }

    getHomeTabConversationEle() {
        return element(by.xpath('//div[contains(@class,"mat-tab-label")][@cdkmonitorelementfocus]//div[@class="mat-tab-label-content"][text()="Conversation"]'));
    }
    getHomeTabFilesEle() {
        return element(by.xpath('//div[contains(@class,"mat-tab-label")][@cdkmonitorelementfocus]//div[@class="mat-tab-label-content"][text()="Files"]'));
    }
    getHomeTabStatusEle() {
        return element(by.xpath('//div[contains(@class,"mat-tab-label")][@cdkmonitorelementfocus]//div[@class="mat-tab-label-content"][text()="Status"]'));
    }
    getHomeTabMembersEle() {
        return element(by.xpath('//div[contains(@class,"mat-tab-label")][@cdkmonitorelementfocus]//div[@class="mat-tab-label-content"][text()="Members"]'));
    }

}
