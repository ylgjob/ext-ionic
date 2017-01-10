"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var ionic_angular_1 = require('ionic-angular');
var _ = require('lodash');
var dialog_1 = require('../dialog');
var response_result_1 = require('./response/response-result');
var url_params_builder_1 = require('./url-params-builder');
var ticket_expired = 'ticket_expired';
var defaultRequestOptions = new http_1.RequestOptions({
    method: http_1.RequestMethod.Get,
    responseType: http_1.ResponseContentType.Json
});
var HttpProvider = (function () {
    function HttpProvider(_http, dialog) {
        this._http = _http;
        this.dialog = dialog;
    }
    Object.defineProperty(HttpProvider.prototype, "http", {
        get: function () {
            return this._http;
        },
        enumerable: true,
        configurable: true
    });
    HttpProvider.prototype.requestWithError = function (url, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.request(url, options).then(function (result) {
                if (result.status == 1) {
                    _this.dialog.alert('系统提示', result.msg);
                    return;
                }
                resolve(result.data);
            }).catch(function (reason) {
                reject(reason);
            });
        });
    };
    HttpProvider.prototype.request = function (url, options) {
        var _this = this;
        var loading = this.dialog.loading('正在加载...');
        loading.present();
        options = _.isUndefined(options) ? defaultRequestOptions : defaultRequestOptions.merge(options);
        return new Promise(function (resolve, reject) {
            _this.http.request(url, options).map(function (r) { return new response_result_1.ResponseResult(r.json()); }).toPromise().then(function (result) {
                loading.dismiss();
                resolve(result);
            }).catch(function (reason) {
                loading.dismiss();
                reject(reason);
            });
        });
    };
    HttpProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, dialog_1.Dialog])
    ], HttpProvider);
    return HttpProvider;
}());
exports.HttpProvider = HttpProvider;
var CorsHttpProvider = (function () {
    function CorsHttpProvider(http, events) {
        this.http = http;
        this.events = events;
        this._devMode = false;
    }
    Object.defineProperty(CorsHttpProvider.prototype, "appKey", {
        set: function (key) {
            this._appKey = key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorsHttpProvider.prototype, "ticket", {
        set: function (t) {
            this._ticket = t;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorsHttpProvider.prototype, "devMode", {
        get: function () {
            return this._devMode;
        },
        set: function (enabled) {
            this._devMode = enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorsHttpProvider.prototype, "loginUrl", {
        get: function () {
            return this._loginUrl;
        },
        set: function (url) {
            this._loginUrl = url;
        },
        enumerable: true,
        configurable: true
    });
    CorsHttpProvider.prototype.login = function (options) {
        var search = url_params_builder_1.URLParamsBuilder.build(options);
        search.set('__login__', 'true');
        return this.request(this.loginUrl, { search: search });
    };
    CorsHttpProvider.prototype.logout = function () {
        var _this = this;
        var search = url_params_builder_1.URLParamsBuilder.build({ '__logout__': true });
        return this.request(this.loginUrl, { search: search }).then(function (result) {
            _this._ticket = null;
            return result;
        }).catch(function (reason) {
            return reason;
        });
    };
    CorsHttpProvider.prototype.request = function (url, options) {
        var _this = this;
        var search = url_params_builder_1.URLParamsBuilder.build({
            'appKey': this._appKey,
            '__ticket__': this._ticket,
            'devMode': this.devMode,
            '__cors-request__': true
        });
        if (_.isUndefined(options)) {
            options = {};
        }
        if (_.has(options, 'search')) {
            search.setAll(options.search);
        }
        return this.http.requestWithError(url, _.assign({}, options, { search: search })).then(function (result) {
            if (result && _.isString(result) && result.toString() == ticket_expired) {
                _this.events.publish(ticket_expired);
                return ticket_expired;
            }
            return result;
        }).catch(function (reason) {
            return reason;
        });
    };
    CorsHttpProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [HttpProvider, ionic_angular_1.Events])
    ], CorsHttpProvider);
    return CorsHttpProvider;
}());
exports.CorsHttpProvider = CorsHttpProvider;
//# sourceMappingURL=http.js.map