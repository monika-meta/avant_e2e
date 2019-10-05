
import { ProfilePage } from './profile.po';
import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';


let util: UtilPage;

describe('profile', () => {

    let profilePage: ProfilePage;

    beforeAll(() => {
        profilePage = new ProfilePage();
        util = new UtilPage();
        browser.ignoreSynchronization = true;
        browser.waitForAngular();

        // browser.sleep(2000);
        // util.waitForElement('profileBtn');
        // profilePage.getProfileImgEle().click();
        // browser.sleep(2000);
        // util.waitForElement('profileEditBtn');
        // profilePage.getProfileEditBtnEle().click();
        // util.waitForElement('firstNameEdit');
        // profilePage.getFirstNameEle().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        // profilePage.getFirstNameEle().sendKeys(protractor.Key.BACK_SPACE);
        // profilePage.getFirstNameEle().clear();
        // profilePage.getLastNameEle().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        // profilePage.getLastNameEle().sendKeys(protractor.Key.BACK_SPACE);
        // profilePage.getLastNameEle().clear();
        // profilePage.enterFirstName('Yashpal');
        // profilePage.enterLastName('Sharma');
        // profilePage.getProfileEditSaveBtnEle().click();
        // browser.sleep(2000);
        // profilePage.getFirstCollapsableDiv();
        // profilePage.getFirstCollapsableDiv();
    });


    it('Verify items when user clicks on Profile image', () => {
        profilePage.getProfileImgEle().click();
        // browser.wait(this.EC.visibilityOf(profilePage.getProfileEditEle()));
        // browser.sleep(2000);
        expect(profilePage.getProfileEditBtnEle()).toBeTruthy();
        expect(profilePage.getLogoutBtn()).toBeTruthy();
        profilePage.getOverlayDiv().click();
    });

    // it('Verify Edit Picture in of Profile functionality', (done) => {
    //     // profilePage.getProfileImgEle().click();
    //     // expect(profilePage.getProfileEditEle()).toBeTruthy();
    //     // expect(profilePage.getLogoutBtn()).toBeTruthy();
    //     browser.driver.sleep(2000);
    //     util.waitForElement('profileEditBtn');
    //     profilePage.getProfileEditBtnEle().click();
    //     expect(profilePage.getEditProfilePopup()).toBeTruthy();
    //     profilePage.getImageEditBtnEle().click();
    //     const fileToUpload = '../../images/profile.jpg';
    //     util.uploadFile(fileToUpload);
    //     util.waitForElement('editPicSelected');
    //     expect(profilePage.getSelectedProfileImgEle()).toBeTruthy();
    //     // const data1 = profilePage.getSelectedProfileImgEle().getAttribute('src');
    //     profilePage.getProfileEditSaveBtnEle().click();
    //     // browser.driver.sleep(15000);

    //     // const data2 = profilePage.getProfileImgOnDashboardEle().getAttribute('src');
    //     // expect(data1).toEqual(data2);

    //     // browser.setFileDetector(new remote.FileDetector());


    //     // const fileToUpload = '../sample.txt';
    //     // const absolutePath = path.resolve(__dirname, fileToUpload);

    //     // const fileElem = element(by.css('input[type="file"]'));

    //     // // Unhide file input
    //     // browser.executeScript("arguments[0].style.visibility = 'visible';
    // //  arguments[0].style.height = '1px'; arguments[0].style.width = '1px';  arguments[0].style.opacity = 1", fileElem.getWebElement());

    //     // fileElem.sendKeys(absolutePath);

    //     // browser.driver.sleep(100);

    //     // // click upload button
    //     // element(by.css('button[data-ng-click="uploadFile(file)"]')).click();

    //     // profilePage.enterFirstName('Yashpall');
    //     // profilePage.enterLastName('Sharmaa');
    //     // profilePage.getProfileEditSaveBtnEle().click();
    //     // // browser.sleep(2000);
    //     // expect(profilePage.getEditProfilePopup()).not.toBeTruthy();
    //     // const updatedData = profilePage.getBindUserName();
    //     // const submittedData = 'Yashpall Sharmaa';
    //     // expect(updatedData).toEqual(submittedData);

    // });

    it('Verify Remove Picture in of Profile functionality', (done) => {
        // browser.sleep(2000);
        util.waitForElement('profileBtn');
        profilePage.getProfileImgEle().click();
        browser.sleep(2000);
        util.waitForElement('profileEditBtn');
        profilePage.getProfileEditBtnEle().click();
        util.waitForElement('deleteProfileImg');
        profilePage.getImageDeleteEle().click();
        expect(profilePage.getEditImgNameEle()).toBeTruthy();
        expect(profilePage.getYSEle()).toBeTruthy();
        profilePage.getProfileEditSaveBtnEle().click().then(() => {
            done();
        });
    });

    it('Validate UI of Edit profile for First and Last Name', (done) => {
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
        profilePage.getProfileEditSaveBtnEle().click().then(() => {
            browser.sleep(2000);
            expect(profilePage.getFirstNameEle().getAttribute('class')).toContain('ng-invalid');
            expect(profilePage.getLastNameEle().getAttribute('class')).toContain('ng-invalid');
            done();
        });

    });

    it('Verify functionality  of Cancel button on Edit Profile screen', (done) => {
        // browser.sleep(2000);
        util.waitForElement('firstNameEdit');
        profilePage.enterFirstName('Yashpall');
        profilePage.enterLastName('Sharmaa');
        profilePage.getProfileEditCancelBtnEle().click().then(() => {
            util.waitForElement('userNameDiv');
            const updatedData = profilePage.getBindUserName();
            expect(updatedData).toBe('Yashpal Sharma');
            done();
        });
    });

    it('Profile should not be edit without First Name when user clicks on save button.', () => {
        browser.sleep(2000);
        util.waitForElement('profileBtn');
        profilePage.getProfileImgEle().click();
        // browser.sleep(2000);
        util.waitForElement('profileEditBtn');
        profilePage.getProfileEditBtnEle().click();
        util.waitForElement('firstNameEdit');
        profilePage.getFirstNameEle().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        profilePage.getFirstNameEle().sendKeys(protractor.Key.BACK_SPACE);
        profilePage.getFirstNameEle().clear();
        util.waitForElement('profileEditsaveButton');
        profilePage.getProfileEditSaveBtnEle().getAttribute('disabled').then(data => {
            console.log("***************************************    ", data);
        });
        // expect().toBeTruthy();
    });

    it('Profile should not be edit without Last Name when user clicks on save button.', () => {
        // browser.sleep(2000);
        util.waitForElement('firstNameEdit');
        profilePage.getFirstNameEle().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        profilePage.getFirstNameEle().sendKeys(protractor.Key.BACK_SPACE);
        profilePage.getFirstNameEle().clear();
        profilePage.enterFirstName('Yashpall');
        profilePage.getLastNameEle().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        profilePage.getLastNameEle().sendKeys(protractor.Key.BACK_SPACE);
        profilePage.getLastNameEle().clear();
        expect(profilePage.getProfileEditSaveBtnEle().getAttribute('disabled')).toBeTruthy();
    });

    it('Profile should not be abled to edit without First Name and Last Name when user clicks on save button.', () => {
        // browser.sleep(2000);
        util.waitForElement('firstNameEdit');
        profilePage.getFirstNameEle().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        profilePage.getFirstNameEle().sendKeys(protractor.Key.BACK_SPACE);
        profilePage.getFirstNameEle().clear();
        profilePage.getLastNameEle().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        profilePage.getLastNameEle().sendKeys(protractor.Key.BACK_SPACE);
        profilePage.getLastNameEle().clear();
        profilePage.getProfileEditSaveBtnEle().click();
        expect(profilePage.getProfileEditSaveBtnEle().getAttribute('disabled')).toBeTruthy();
    });

    it('Verify Edit first name and last name on Edit Profile screen', () => {
        browser.sleep(2000);
        util.waitForElement('firstNameEdit');
        profilePage.enterFirstName('Yashpall');
        profilePage.enterLastName('Sharmaa');
        profilePage.getProfileEditSaveBtnEle().click();
        browser.sleep(4000);
        util.waitForElement('userNameDiv');
        const updatedData = profilePage.getBindUserName();
        expect(updatedData).toBe('Yashpall Sharmaa');
    });
});
