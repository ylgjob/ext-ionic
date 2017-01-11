import { AfterViewInit, OnChanges, EventEmitter, ElementRef, SimpleChange } from '@angular/core';
import { Config } from '../../config/config';
import { BaiduMapOptions } from './baidu-map-options';
import { BaiduMapController } from './baidu-map';
export declare class BaiduMap implements AfterViewInit, OnChanges {
    private _elementRef;
    private baiduMapCtrl;
    private config;
    options: BaiduMapOptions;
    onMapLoaded: EventEmitter<void>;
    onMapLoadFialed: EventEmitter<any>;
    onMapClick: EventEmitter<any>;
    onMarkerClick: EventEmitter<any>;
    private mapLoaded;
    constructor(_elementRef: ElementRef, baiduMapCtrl: BaiduMapController, config: Config);
    ngAfterViewInit(): void;
    ngOnChanges(changes: {
        [propertyName: string]: SimpleChange;
    }): void;
    private reDraw(opts);
    private draw(markers);
    private getOptions();
}
