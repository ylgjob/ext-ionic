import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  Host,
  Input,
  ElementRef
} from '@angular/core';
import { Content } from 'ionic-angular';
import * as _ from 'lodash';

import { OrderBy } from '../../pipes/order-by';

@Component({
  selector: 'ion-alpha-scroll',
  template: `
    <ion-list class="ion-alpha-list">
      <div *ngFor="let item of sortedItems">
        <ion-item-divider id="scroll-letter-{{item.letter}}" *ngIf="item.isDivider">{{item.letter}}</ion-item-divider>
        <DynamicComponent [componentTemplate]="itemTemplate" [componentContext]="{'item': item, 'currentPageClass': currentPageClass}" *ngIf="!item.isDivider">
        </DynamicComponent>
      </div>
    </ion-list>
    <ul class="ion-alpha-sidebar" [ngStyle]="calculateDimensionsForSidebar()">
      <li *ngFor="let alpha of alphabet" [class]="setAlphaClass(alpha)" tappable (click)="alphaScrollGoToList(alpha.letter)">
        <a>{{alpha.letter}}</a>
      </li>
    </ul>
  `
})
export class AlphaScroll implements OnInit, OnChanges, OnDestroy {
  @Input() listData: any;
  @Input() key: string;
  @Input() itemTemplate: string;
  @Input() currentPageClass: any;
  private letterIndicatorEle: HTMLElement;
  private indicatorHeight: number;
  private indicatorWidth: number;
  private hammer: HammerManager;
  sortedItems: any = [];
  alphabet: any = [];

  constructor( @Host() private content: Content, private elementRef: ElementRef, private orderBy: OrderBy) {
    this.letterIndicatorEle = document.createElement("div");
    this.letterIndicatorEle.className = 'ion-alpha-letter-indicator';
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(this.letterIndicatorEle);
  }

  ngOnInit() {
    setTimeout(() => {
      this.indicatorWidth = this.letterIndicatorEle.offsetWidth;
      this.indicatorHeight = this.letterIndicatorEle.offsetHeight;
      this.setupHammerHandlers();
    });
  }

  ngOnChanges() {
    let sortedListData: Array<any> = this.orderBy.transform(this.listData, [this.key]);
    let groupItems: any = this.groupItems(sortedListData);
    this.sortedItems = this.unwindGroup(groupItems);
    this.alphabet = this.iterateAlphabet(groupItems);
  }

  ngOnDestroy() {
    if (this.letterIndicatorEle) {
      this.letterIndicatorEle.remove();
    }

    if (this.hammer) {
      this.hammer.destroy();
    }
  }

  setAlphaClass(alpha: any): string {
    return alpha.isActive ? 'ion-alpha-active' : 'ion-alpha-invalid';
  }

  calculateDimensionsForSidebar() {
    return {
      top: this.content.contentTop + 'px',
      height: (this.content.getContentDimensions().contentHeight - 28) + 'px'
    }
  }

  alphaScrollGoToList(letter: any) {
    let ele: any = this.elementRef.nativeElement.querySelector(`#scroll-letter-${letter}`);
    if (ele) {
      this.content.scrollTo(0, ele.offsetTop);
    }
  }

  private setupHammerHandlers() {
    let sidebarEle: HTMLElement = this.elementRef.nativeElement.querySelector('.ion-alpha-sidebar');

    if (!sidebarEle) return;

    this.hammer = new Hammer(sidebarEle, {
      recognizers: [
        [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }],
      ]
    });

    this.hammer.on('panstart', (e: any) => {
      this.letterIndicatorEle.style.top = ((window.innerHeight - this.indicatorHeight) / 2) + 'px';
      this.letterIndicatorEle.style.left = ((window.innerWidth - this.indicatorWidth) / 2) + 'px';
      this.letterIndicatorEle.style.visibility = 'visible';
    });

    this.hammer.on('panend pancancel', (e: any) => {
      this.letterIndicatorEle.style.visibility = 'hidden';
    });

    this.hammer.on('panup pandown', _.throttle((e: any) => {
      let closestEle: any = document.elementFromPoint(e.center.x, e.center.y);
      if (closestEle && ['LI', 'A'].indexOf(closestEle.tagName) > -1) {
        let letter = closestEle.innerText;
        this.letterIndicatorEle.innerText = letter;
        let letterDivider: any = this.elementRef.nativeElement.querySelector(`#scroll-letter-${letter}`);
        if (letterDivider) {
          this.content.scrollTo(0, letterDivider.offsetTop);
        }
      }
    }, 50));
  }

  private unwindGroup(groupItems: any): Array<any> {
    let result: Array<any> = [];
    for (let letter in groupItems) {
      result = result.concat([{ isDivider: true, letter: letter }].concat(groupItems[letter]));
    }
    return result;
  }

  private iterateAlphabet(alphabet: any): Array<any> {
    let str: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result: Array<any> = [];
    for (var i = 0; i < str.length; i++) {
      var letter = str.charAt(i);
      var isActive = alphabet[letter] ? true : false;
      result.push({ letter: letter, isActive: isActive });
    }
    return result;
  }

  private groupItems(sortedListData: Array<any>): any {
    let result: any = {};
    for (let i = 0; i < sortedListData.length; i++) {
      let listValue: any = _.get(sortedListData[i], this.key);
      let letter = listValue.toUpperCase().charAt(0);
      if (typeof result[letter] === 'undefined') {
        result[letter] = [];
      }
      result[letter].push(sortedListData[i]);
    }
    return result;
  }
}