import { OnInit, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import { Content } from 'ionic-angular';
import { OrderBy } from '../../pipes/order-by';
export declare class AlphaScroll implements OnInit, OnChanges, OnDestroy {
    private content;
    private elementRef;
    private orderBy;
    listData: any;
    key: string;
    itemTemplate: string;
    currentPageClass: any;
    private letterIndicatorEle;
    private indicatorHeight;
    private indicatorWidth;
    private hammer;
    sortedItems: any;
    alphabet: any;
    constructor(content: Content, elementRef: ElementRef, orderBy: OrderBy);
    ngOnInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    setAlphaClass(alpha: any): string;
    calculateDimensionsForSidebar(): {
        top: string;
        height: string;
    };
    alphaScrollGoToList(letter: any): void;
    private setupHammerHandlers();
    private unwindGroup(groupItems);
    private iterateAlphabet(alphabet);
    private groupItems(sortedListData);
}
