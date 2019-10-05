import { browser, by, element } from 'protractor';
import { BASE_URL, USERNAME, PASSWORD } from '../../e2e-config';
import { UtilPage } from '../../util/page-util';

export class ProfilePage {

    navigateTo() {
        return browser.get('/');
    }

    getFirstCollapsableDiv() {
        const util = new UtilPage();
        browser.sleep(4000);
        util.waitForElementByEle( element(by.xpath('//*[@id="spaceCollapsable"]/a[1]')));
        element(by.xpath('//*[@id="spaceCollapsable"]/a[1]')).click();
        util.waitForElementByEle(element(by.xpath('//*[@id="spaceCollapsable"]/ul[1]/li[1]/channel-list-collapsable[1]/a[1]')));
        element(by.xpath('//*[@id="spaceCollapsable"]/ul[1]/li[1]/channel-list-collapsable[1]/a[1]')).click();
        util.waitForElementByEle(element(by.xpath('//*[@id="spaceCollapsable"]/ul[1]/li[1]/channel-list-collapsable[1]/ul[1]/li[2]/channel-list-item[1]/a[1]')));
        element(by.xpath('//*[@id="spaceCollapsable"]/ul[1]/li[1]/channel-list-collapsable[1]/ul[1]/li[2]/channel-list-item[1]/a[1]')).click();
    }

    getProfileImgEle() {
        return element(by.id('profileBtn'));
    }

    getProfileImgOnDashboardEle() {
        return element(by.css('img[class="avatar-content ng-star-inserted"]'));
    }

    getSelectedProfileImgEle() {
        return element(by.id('editPicSelected'));
    }


    getProfileEditBtnEle() {
        return element(by.id('profileEditBtn'));
    }


    getLogoutBtn() {
        return element(by.id('logoutBtn'));
    }

    getEditProfilePopup() {
        return element(by.id('mat-dialog-0'));
    }
    getBindUserName() {
        return element(by.id('userNameDiv')).getText();
    }
    getFirstNameEle() {
        return element(by.id('firstNameEdit'));

    }
    getLastNameEle() {
        return element(by.id('lastNameEdit'));

    }
    getProfileEditSaveBtnEle() {
        return element(by.id('profileEditsaveButton'));

    }
    getProfileEditCancelBtnEle() {
        return element(by.id('profileEditCancelButton'));

    }

    getOverlayDiv() {
        return element(by.css('div[class="cdk-overlay-backdrop cdk-overlay-transparent-backdrop cdk-overlay-backdrop-showing"]'));
    }

    enterFirstName(username: string) {
        return this.getFirstNameEle().sendKeys(username);
    }
    enterLastName(username: string) {
        return this.getLastNameEle().sendKeys(username);
    }
    getEditImageEle() {
        return element(by.id('editProfileImg'));
    }
    getImageEditBtnEle() {
        return element(by.id('editProfileImgBtn'));
    }
    getImageDeleteEle() {
        return element(by.id('deleteProfileImg'));
    }
    getEditImgNameEle() {
        return element(by.id('editImgName'));
    }
    getYSEle() {
        return element(by.cssContainingText('.avatar-content .ng-star-inserted', 'YS'));
    }
    isImageLoad() {
        const ele = this.getEditImageEle();
        console.log('********************************', ele);
        if (ele.offset.offsetHeight > 1 && ele.offset.naturalHeight <= 1) {
            return false;
        }
        return true;
    }

}
