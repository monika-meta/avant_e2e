import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import { User } from './util/user.model';
import { IAuthService } from './util/iauth-service.interface';
import { ChatHubService } from 'src/app/shared/services/chat-hub.service';
import { ConflowSettings } from 'src/app/shared/settings/conflow-settings';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
    public isLoggedIn: boolean;
    public role: string;
    private authClient: any;
    private user: User;
    private _expiresAt: number;
    private _idToken: string;
    private _accessToken: string;
    public refreshSubscription: any;
    public tokenRenewalTimeout: any;

    constructor(private _http: HttpClient, private router: Router, private chatHubService: ChatHubService) {
        if (localStorage.getItem('access_token')) {
            this.isLoggedIn = true;
            this.getRolesFromToken();
        }
    }

    /**
     * Logs the user out
     */
    public logout(): void {
        this.isLoggedIn = false;
        this.unscheduleRenewal();
        localStorage.removeItem('userID');
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('tenantID');
        localStorage.removeItem('tenantName');
        this.router.navigate(['index']);
        localStorage.removeItem('isLoggedIn');
        this.chatHubService.StopConnection();
    }

    /**
     * Logs the user in with the API
     * @param user The user to login
     */
    public loginOnServer(user: User): Observable<any> {
        const userCredential = {
            Login: user.email,
            Password: user.password
        };

        return this._http.post(`${ConflowSettings.authServiceUrl}${ConflowSettings.rewriteUrl('Login')}`, userCredential).pipe(
            tap((response) => {
                if (response.status === 200) {
                    this.loginTasks(user.email, response.data.access_token, response.data.id_token, response.data.tenantID, response.data.tenantName, response.data.expires_in);
                }
            })
        );
    }

    /**
     * Registers the user in with the API
     * @param user The user to register
     */
    public registerUser(user: User): Observable<any> {
        const userCredential = {
            FirstName: user.firstname,
            LastName: user.lastname,
            NickName: user.nickname,
            Login: user.email,
            Password: user.password
        };

        return this._http.post(`${ConflowSettings.authServiceUrl}${ConflowSettings.rewriteUrl('api/Authentication/CreateUser')}`, userCredential, { observe: 'response' });
    }

    /**
     * reset the user with the API
     * @param user The user to reset
     */
    public resetPassword(user: User): Observable<any> {
        const userCredential = {
            Login: user.email
        };

        return this._http.post(`${ConflowSettings.authServiceUrl}${ConflowSettings.rewriteUrl('api/Authentication/ResetPassword')}`, userCredential, { responseType: 'text' });
    }

    /**
     * Gets the currently logged in user, returns null if not logged in
     */
    public getUser(): User {
        if (!this.user && this.isLoggedIn) {
            // Logged in but not loaded,
            this.getRolesFromToken();
        }

        return this.user;
    }

    public loginTasks(email: string, access_token?: string, id_token?: string, tenantID?: string, tenantName?: string, expiresIn?: any): void {
        this.isLoggedIn = true;
        localStorage.setItem('userID', email);
        localStorage.setItem('isLoggedIn', "true");
        if (id_token) {
            localStorage.setItem('id_token', id_token);
        }

        if (access_token) {
            localStorage.setItem('access_token', access_token);
            this.getRolesFromToken();
        }

        if (tenantID) {
            localStorage.setItem('tenantID', tenantID);
        }
        if (tenantName) {
            localStorage.setItem('tenantName', tenantName);
        }
        const expiresAt = ((expiresIn - 10) * 1000) + Date.now();
        this._accessToken = access_token;
        this._idToken = id_token;
        localStorage.setItem('expires_at', expiresAt.toString());
        this._expiresAt = expiresAt;
    }

    /**
    Refreshing the token for logged in user once token expired in.
     **/
    public refreshTokens(): Observable<any> {
        return this._http.post(`${ConflowSettings.authServiceUrl}${ConflowSettings.rewriteUrl('api/Authentication/RefreshToken')}`, null, { headers: ConflowSettings.httpHeaders }).pipe(
            tap((response) => {
                if (response.status === 200) {
                    localStorage.setItem('access_token', response.data.access_token);
                    localStorage.setItem('id_token', response.data.id_token);

                    const expiresAt = ((response.data.expires_in - 10) * 1000) + Date.now();
                    this._accessToken = response.data.access_token;
                    this._idToken = response.data.access_token;
                    localStorage.setItem('expires_at', expiresAt.toString());
                    this._expiresAt = expiresAt;
                    this.scheduleRenewal();
                }
                else {
                    this.logout();
                }
            })
        );
    }

    public isAuthenticated(): boolean {
        // Check whether the current time is past the
        // access token's expiry time
        return localStorage.getItem('access_token') && Date.now() < Number(localStorage.getItem('expires_at'));
    }

    /**
    Scheduling the renewal of token before it expires.
   **/
    public scheduleRenewal() {

        if (!this.isAuthenticated()) return;
        this.unscheduleRenewal();

        const expiresAt = Number(localStorage.getItem('expires_at'));//this._expiresAt;

        const source = Observable.of(expiresAt).flatMap(
            expiresAt => {

                const now = Date.now();

                // Use the delay in a timer to
                // run the refresh at the proper time
                return Observable.timer(Math.max(1, expiresAt - now));
            });

        // Once the delay time from above is
        // reached, get a new JWT and schedule
        // additional refreshes
        this.refreshSubscription = source.subscribe(() => {
            this.refreshTokens().subscribe();
            this.scheduleRenewal();
        });
    }

    public unscheduleRenewal() {
        if (!this.refreshSubscription) return;
        this.refreshSubscription.unsubscribe();
    }



    /**
   * Parses the JWT token
   */
    private getRolesFromToken(): void {
        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(localStorage.getItem('access_token'));
        const user: User = {
            email: decodedToken.email,
            nickname: decodedToken.nickname,
            id: decodedToken.id
        };
        this.user = user;
        this.role = decodedToken['http://myexample.com/role'];
    }



}

