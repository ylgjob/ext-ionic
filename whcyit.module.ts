import './src/rxjs-extensions';

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IonicModule } from 'ionic-angular';
import * as _ from 'lodash';

import { DynamicComponentModuleFactory } from 'angular2-dynamic-component';

import { WHCYIT_IONIC_CONFIG, Config, defaultConfig } from './src/config/config';
import { Dialog } from './src/utils/dialog';
import { HttpProvider, CorsHttpProvider } from './src/utils/http/http';

import { MapToIterable } from './src/pipes/map-to-iterable';
import { OrderBy } from './src/pipes/order-by';

import { AlphaScroll } from './src/components/alpha-scroll/alpha-scroll';

import { OpenUrlModalCmp } from './src/components/open-url-modal/open-url-modal-component';
import { OpenUrlModalController } from './src/components/open-url-modal/open-url-modal';

import { BaiduMapController } from './src/components/baidu-map/baidu-map';
import { BaiduMap } from './src/components/baidu-map/baidu-map-component';
import { ImageLoaderSpinnerCmp } from './src/components/image-loader/image-loader-spinner-component';

import { ImageLoaderCmp } from './src/components/image-loader/image-loader-component';
import { ImageLoaderController } from './src/components/image-loader/image-loader';

import { StarRatingCmp } from './src/components/star-rating/star-rating';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    MapToIterable,
    OrderBy
  ],
  declarations: [
    MapToIterable,
    OrderBy
  ],
  providers: [
    MapToIterable,
    OrderBy
  ]
})
export class WhcyitPipeModule { }

@NgModule({
  imports: [
    WhcyitPipeModule,
    IonicModule,
    DynamicComponentModuleFactory.buildModule([IonicModule])
  ],
  exports: [
    WhcyitPipeModule,
    AlphaScroll,
    BaiduMap,
    ImageLoaderCmp,
    StarRatingCmp
  ],
  declarations: [
    AlphaScroll,
    OpenUrlModalCmp,
    BaiduMap,
    ImageLoaderSpinnerCmp,
    ImageLoaderCmp,
    StarRatingCmp
  ],
  entryComponents: [
    OpenUrlModalCmp
  ]
})
export class WhcyitModule {
  static forRoot(config?: Config): ModuleWithProviders {
    return {
      ngModule: WhcyitModule,
      providers: [
        { provide: WHCYIT_IONIC_CONFIG, useValue: _.isUndefined(config) ? defaultConfig : _.assign({}, defaultConfig, config) },
        OpenUrlModalController,
        BaiduMapController,
        ImageLoaderController,
        Dialog,
        HttpProvider,
        CorsHttpProvider
      ]
    };
  }
}