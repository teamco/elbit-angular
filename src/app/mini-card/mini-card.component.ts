import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-mini-card',
  templateUrl: './mini-card.component.html',
  styleUrls: ['./mini-card.component.less']
})

export class MiniCardComponent {
  @Input() icon: string | undefined;
  @Input() title: string | undefined;
  @Input() value: string | undefined;
  @Input() color: string | undefined;
  @Input() isIncrease: boolean | undefined;
  @Input() isCurrency: boolean | undefined;
  @Input() duration: string | undefined;
  @Input() percentValue: string | undefined;

  constructor() {
  }
}
