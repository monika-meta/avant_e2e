
import { Observable } from 'rxjs';
import { User } from './user.model';

/**
 * Interface defining each auth service
 */
export interface IAuthService {

  /**
   * Determines if the user is already logged in
   */
  isLoggedIn: boolean;

  /**
   * Logs the user in
   * @param user The user to login
   */
  loginOnServer(user: User): Observable<any>;

  /**
   * Registers the user in
   * @param user The user to register
   */
  registerUser(user: User): Observable<any>;

  /**
   * reset the user in
   * @param user The user to reset
   */
  resetPassword(user: User): Observable<any>;

  /**
   * Logs the user out
   */
  logout(): void;

  /**
   * Gets the currently logged in user
   */
  getUser(): User;

  /**
  Refreshing the token for logged in user once token expired in.
   **/
  refreshTokens(): Observable<any>

  //Set timer for refresh token;
  scheduleRenewal(): void
}
