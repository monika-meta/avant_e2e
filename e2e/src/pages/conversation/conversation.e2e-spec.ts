import { ConversationPage } from './conversation.po';
import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';
import { USERNAME, PASSWORD } from '../../e2e-config';
import { HomePage } from '../home/home.po';

describe('Conversation', () => {

    let conversationPage: ConversationPage;
    let homePage: HomePage;
    let util: UtilPage;
    browser.ignoreSynchronization = false;

    beforeAll(() => {
        conversationPage = new ConversationPage();
        util = new UtilPage();
        homePage = new HomePage();
        browser.ignoreSynchronization = true;
        browser.waitForAngular();
        browser.wait(protractor.ExpectedConditions.visibilityOf(homePage.getHomeSpaceCollapsableEle()), 20000);
    });


    it('Validate Conversation tab', () => {
        conversationPage.getMiddlePanChannel().click();
        expect(conversationPage.getConversationTabEle().getAttribute('aria-selected')).toBe('true');
    });

    it('Verify conversation b/w users', (done) => {
        util.waitForElementToBeVisible(conversationPage.getMessageEditorEle(), 15000);

        expect(conversationPage.getMessageEditorEle()).toBeTruthy();
        expect(conversationPage.getmessageSendEle()).toBeTruthy();
        expect(conversationPage.getMessageEditorEle().getAttribute('class')).toContain('ql-blank');
        conversationPage.getMessageEditorEle().click();
        conversationPage.getMessageEditorEle().sendKeys('e2e testing Message');
        conversationPage.getmessageSendEle().click().then(data => {
            console.log(data);
            browser.sleep(5000);
            expect(conversationPage.getLastMessageDiv()).toBeTruthy();
            // expect(conversationPage.getLastMessageDiv().getText()).toEqual('e2e testing Message');

            done();
        });
        // ql-blank
    });

    it('Verify functionality of Edit message ', (done) => {
        browser.sleep(5000);
        util.waitForElementToBeVisible(conversationPage.getLastMessageRowEle(), 15000);
        const actionPopupBtn = conversationPage.getLastMessageRowEle().all(by.css('button[aria-haspopup="true"]')).first();
        browser.actions().mouseMove(conversationPage.getLastMessageRowEle()).perform();
        conversationPage.getLastMessageRowEle().all(by.css('button[aria-haspopup="true"]')).first().click();
        util.waitForElement('editMessage');
        util.waitForElementToBeVisible(conversationPage.getMessageEditPopupBtnEle(), 15000);
        browser.sleep(3000);

        conversationPage.getMessageEditPopupBtnEle().click();
        expect(conversationPage.getEditMessageEle()).toBeTruthy();
        conversationPage.getEditMessageEle().click().then(data => {
            const text = 'e2e testing Message';
            conversationPage.getEditMessageEle().sendKeys(' edited');
            conversationPage.getsaveEditMessageEle().click().then(dataa => {
                browser.sleep(3000);
                expect(conversationPage.getTextMessageByTextEle(text + ' edited')).toBeTruthy();
                done();
            });
        });
    });

    it('Validation confirmation message while removing message', () => {
        browser.sleep(5000);
        util.waitForElementToBeVisible(conversationPage.getLastMessageRowEle(), 15000);
        browser.actions().mouseMove(conversationPage.getLastMessageRowEle()).perform();
        browser.sleep(1000);
        conversationPage.getLastMessageRowEle().all(by.css('button[aria-haspopup="true"]')).first().click();
        util.waitForElement('deleteMessage');
        util.waitForElementToBeVisible(conversationPage.getDeleteMessageEle(), 15000);
        browser.sleep(3000);
        conversationPage.getDeleteMessageEle().click();
        expect(conversationPage.getDeletePopupEle()).toBeTruthy();
        expect(
            element(by.css(`p[value="Are you sure you want to delete this message? This cannot be undone."]`
            )
            )
        ).toBeTruthy();
        const text = 'e2e testing Message';
        expect(conversationPage.getDeletePopUpUserNameEle()).toBeTruthy();
        expect(conversationPage.getDeletePopUpTimeEle()).toBeTruthy();
        expect(conversationPage.getDeletePopUpMessageEle()).toBeTruthy();
        // expect(conversationPage.getDeletePopUpMessageEle().getText()).toEqual(text + ' edited');
        expect(conversationPage.getDeletePopUpDeleteBtnEle()).toBeTruthy();
        expect(conversationPage.getDeletePopUpCancelBtnEle()).toBeTruthy();
        // expect(conversationPage.getLastMessageRowEle()).toBeTruthy();
        // browser.actions().mouseMove(conversationPage.getLastMessageRowEle()).perform();
        // util.waitForElement('deleteMessage');
        // util.waitForElementToBeVisible(conversationPage.getLastMessageRowEle().all(by.css('button[aria-haspopup="true"]')).first(), 15000);
        // conversationPage.getLastMessageRowEle().all(by.css('button[aria-haspopup="true"]')).first().click();
        // util.waitForElement('deleteMessage');
        // expect(conversationPage.getDeleteMessageEle()).toBeTruthy();
        // browser.sleep(3000);
        // conversationPage.getDeleteMessageEle().click();
        // expect(conversationPage.getDeletePopupEle()).toBeTruthy();
        // expect(
        //     element(by.css(`p[value="Are you sure you want to delete this message? This cannot be undone."]`
        //     )
        //     )
        // ).toBeTruthy();
        // const text = 'e2e testing Message';

        // expect(conversationPage.getDeletePopUpUserNameEle()).toBeTruthy();
        // expect(conversationPage.getDeletePopUpTimeEle()).toBeTruthy();
        // expect(conversationPage.getDeletePopUpMessageEle()).toBeTruthy();
        // expect(conversationPage.getDeletePopUpMessageEle().getText()).toEqual(text + ' edited');
        // expect(conversationPage.getDeletePopUpDeleteBtnEle()).toBeTruthy();
        // expect(conversationPage.getDeletePopUpCancelBtnEle()).toBeTruthy();

        // // expect(conversationPage.getTextMessageByTextEle(text + ' edited')).toBeTruthy();

        // // conversationPage.getMessageEditorEle(text).sendKeys(text + ' edited');

        // // expect(conversationPage.getMessageEditorEle(text)).toBeTruthy();
        // // conversationPage.getsaveEditMessageEle().click().then(data => {
        // //     console.log(data);
        // //     browser.sleep(3000);

        // //     expect(conversationPage.getTextMessageByTextEle(text + ' edited')).toBeTruthy();
        // //     done();
        // // });
        const text = 'e2e testing Message';
        expect(conversationPage.getDeletePopUpCancelBtnEle()).toBeTruthy();
        conversationPage.getDeletePopUpCancelBtnEle().click();
        expect(conversationPage.getTextMessageByTextEle(text + ' edited')).toBeTruthy();
    });
    // it('Verify functionality of Cancel button on "Delete Message" dialog box', () => {


    // });
    it('Verify functionality of Delete button on "Delete Message" dialog box', () => {
        const text = 'e2e testing Message';
        browser.sleep(5000);
        util.waitForElementToBeVisible(conversationPage.getLastMessageRowEle(), 15000);
        browser.actions().mouseMove(conversationPage.getLastMessageRowEle()).perform();
        browser.sleep(1000);
        conversationPage.getLastMessageRowEle().all(by.css('button[aria-haspopup="true"]')).first().click();
        util.waitForElement('deleteMessage');
        util.waitForElementToBeVisible(conversationPage.getDeleteMessageEle(), 15000);
        browser.sleep(3000);
        conversationPage.getDeleteMessageEle().click();
        expect(conversationPage.getDeletePopupEle()).toBeTruthy();

        expect(conversationPage.getDeletePopUpDeleteBtnEle()).toBeTruthy();
        conversationPage.getDeletePopUpDeleteBtnEle().click();
        browser.sleep(3000);
        util.waitForElementToBeVisible(conversationPage.getLastMessageRowEle());
        expect(conversationPage.getTextMessageByTextEle(text + ' edited').length).toBe(0);
        // conversationPage.getDeletePopUpCancelBtnEle().click();

    });
    // it('Verify functionality of Send message button just bottom-right message text area', (done) => {
    //     const text = 'Type your message here. Type @ to mention someone.';
    //     expect(conversationPage.getMessageEditorEle()).toBeTruthy();
    //     expect(conversationPage.getmessageSendEle()).toBeTruthy();
    //     expect(conversationPage.getMessageEditorEle().getAttribute('class')).toContain('ql-blank');
    //     conversationPage.getmessageSendEle().click().then(data => {
    //         // expect(conversationPage.getTextMessageByTextEle('e2e testing Message')).toBeTruthy();
    //         done();
    //     });
    // });
    it('Validate actions for language translation option ', () => {
        browser.sleep(3000);
        util.waitForElementToBeVisible(homePage.selectLanguageBtnHeader());
        browser.sleep(3000);
        homePage.selectLanguageBtnHeader().click();
        // expect(homePage.getLanguageTranslateOptionEle('English')).toBeTruthy();
        // browser.actions().mouseMove(homePage.getLanguageTranslateOptionEle('English')).perform();
        // browser.sleep(15000);

        // homePage.getLanguageTranslateOptionEle('English').click();
        // expect(conversationPage.getLastMessageRowEle()).toBeTruthy();
        // browser.actions().mouseMove(conversationPage.getLastMessageRowEle()).perform();
        // conversationPage.getLastMessageRowEle().all(by.css('button[aria-haspopup="true"]')).first().click();
        // expect(conversationPage.getEditMessageTranslateEnEle()).toBeTruthy();
    });

    it('Verify functionality of Collapse and expand', () => {
        homePage.selectLanguageBtnHeader().click();

        // homePage.getLanguageTranslateEle().click();

        expect(homePage.getLanguageTranslateOptionEle('English')).toBeTruthy();
        homePage.getLanguageTranslateOptionEle('English').click();
        expect(conversationPage.getLastMessageRowEle()).toBeTruthy();
        browser.actions().mouseMove(conversationPage.getLastMessageRowEle()).perform();
        conversationPage.getLastMessageRowEle().all(by.css('button[aria-haspopup="true"]')).first().click();
        expect(conversationPage.getEditMessageTranslateEnEle()).toBeTruthy();
    });

});
