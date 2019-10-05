import { browser, protractor, element, by } from 'protractor';
import { UtilPage } from '../../util/page-util';
import { USERNAME, PASSWORD } from '../../e2e-config';
import { MemberPage } from '../member/member.po';
import { HomePage } from '../home/home.po';

describe('member', () => {

    let memberPage: MemberPage;
    let util: UtilPage;
    let home: HomePage;

    beforeAll(() => {

        memberPage = new MemberPage();
        util = new UtilPage();
        browser.ignoreSynchronization = true;
        home = new HomePage();

        browser.waitForAngular();
        util.waitForElementToBeVisible(home.getHomeTabMembersEle());

        expect(home.getHomeTabMembersEle()).toBeTruthy();

        home.getHomeTabMembersEle().click();

    });
    it('Verify email selection of users from members', () => {
        expect(memberPage.getCheckedYSEmailDiv()).toBeTruthy();
    });
    it('Verify sorting functionality based User name', () => {
        browser.actions().mouseMove(memberPage.getSortingButton()).perform();
        let sorted = [], unSorted = [];
        memberPage.getAllEmailIDsArray().each(function (eachName) {
            eachName.getText().then(function (name) {
                unSorted[i] = name;
                i++;
            });
        }).then(function () {
            sorted = unSorted.slice();
            sorted.sort();
            expect(sorted).toEqual(unSorted);
        });

    });
});
