import { Injectable } from '@angular/core';
import {
  Http,
  Request,
  Response,
  RequestOptionsArgs,
  ResponseContentType,
  RequestMethod,
  RequestOptions,
  URLSearchParams
} from '@angular/http';
import { Events } from 'ionic-angular';
import * as _ from 'lodash';

import { Dialog } from '../dialog';
import { ResponseResult } from './response/response-result';
import { URLParamsBuilder } from './url-params-builder';

const ticket_expired: string = 'ticket_expired';

const defaultRequestOptions: RequestOptions = new RequestOptions({
  method: RequestMethod.Get,
  responseType: ResponseContentType.Json
});

export interface LoginOptions {
  username: string;
  password: string;
  appId?: string;
  jpushId?: string;
  __login__?: boolean;
}

@Injectable()
export class HttpProvider {
  constructor(
    private _http: Http,
    private dialog: Dialog
  ) { }

  get http(): Http {
    return this._http;
  }

  requestWithError<T>(url: string | Request, options?: RequestOptionsArgs): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.request<T>(url, options).then((result: ResponseResult<T>) => {
        if (result.status == 1) {
          this.dialog.alert('系统提示', result.msg);
          return;
        }
        resolve(result.data);
      }).catch(reason => {
        reject(reason);
      });
    });
  }

  request<T>(url: string | Request, options?: RequestOptionsArgs): Promise<ResponseResult<T>> {
    let loading = this.dialog.loading('正在加载...');
    loading.present();

    options = _.isUndefined(options) ? defaultRequestOptions : defaultRequestOptions.merge(options);
    return new Promise<ResponseResult<T>>((resolve, reject) => {
      this.http.request(url, options).map(
        (r: Response) => new ResponseResult<T>(r.json())
      ).toPromise().then((result: ResponseResult<T>) => {
        loading.dismiss();
        resolve(result)
      }).catch(reason => {
        loading.dismiss();
        reject(reason);
      });
    });
  }
}

@Injectable()
export class CorsHttpProvider {
  private _appKey: string;
  private _ticket: string;
  private _devMode: boolean = false;
  private _loginUrl: string;

  constructor(private http: HttpProvider, private events: Events) { }

  set appKey(key: string) {
    this._appKey = key;
  }

  set ticket(t: string) {
    this._ticket = t;
  }

  get devMode(): boolean {
    return this._devMode;
  }

  set devMode(enabled: boolean) {
    this._devMode = enabled;
  }

  get loginUrl(): string {
    return this._loginUrl;
  }

  set loginUrl(url: string) {
    this._loginUrl = url;
  }

  login(options: LoginOptions): Promise<string> {
    let search = URLParamsBuilder.build(options);
    search.set('__login__', 'true');
    return this.request<string>(this.loginUrl, { search: search });
  }

  logout() {
    let search = URLParamsBuilder.build({ '__logout__': true });
    return this.request<string>(this.loginUrl, { search: search }).then(result => {
      this._ticket = null;
      return result;
    }).catch(reason => {
      return reason;
    });
  }

  request<T>(url: string | Request, options?: RequestOptionsArgs): Promise<T> {
    let search: URLSearchParams = URLParamsBuilder.build({
      'appKey': this._appKey,
      '__ticket__': this._ticket,
      'devMode': this.devMode,
      '__cors-request__': true
    });

    if (_.isUndefined(options)) {
      options = {};
    }

    if (_.has(options, 'search')) {
      search.setAll(<URLSearchParams>options.search);
    }

    return this.http.requestWithError<T>(
      url, _.assign({}, options, { search: search })
    ).then(result => {
      if (result && _.isString(result) && result.toString() == ticket_expired) {
        this.events.publish(ticket_expired);
        return ticket_expired;
      }
      return result;
    }).catch(reason => {
      return reason;
    });
  }
}