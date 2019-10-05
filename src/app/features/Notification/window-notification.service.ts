import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowNotificationService {
  public permission: Permission;
  constructor() {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }

  public isSupported(): boolean {
    return 'Notification' in window;
  }
  requestPermission(): void {
    let self = this;
    if ('Notification' in window) {
      Notification.requestPermission(function (status) {
        return self.permission = status;
      });
    }
  }
  create(title: string, options?: PushNotification): any {
    let self = this;
    return new Observable(function (obs) {
      if (!('Notification' in window)) {
        obs.complete();
      }
      if (self.permission != "default" && self.permission !== 'granted') {
        obs.complete();
      }
      let _notify = new Notification(title, options);
      _notify.onshow = function (e) {
        return obs.next({
          notification: _notify,
          event: e,
          type:"show"
        });
      };
      _notify.onclick = function (e) {
        return obs.next({
          notification: _notify,
          event: e,
          type:"click"
        });
      };
      _notify.onerror = function (e) {
        return obs.error({
          notification: _notify,
          event: e,
          type:"error"
        });
      };
      _notify.onclose = function () {
        return obs.complete();
      };
    });
  }
  generateNotification(title: string, body: string, tag: string): Observable<any> {
    let self = this;
    let pushNotification: PushNotification;
    pushNotification = {
      body: body,
      icon: "./favicon.ico",
      //tag: tag
      
    }
    return self.create(title, pushNotification);
 
  }
}
export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
  autoClose?: number;
}
