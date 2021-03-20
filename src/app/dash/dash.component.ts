import {AfterContentInit, Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {StoreSummary, StoreSummaryService} from '../../services/store.summary.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {StateStoreService} from '../../services/state.store.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.less']
})

export class DashComponent implements OnInit, AfterContentInit {

  constructor(
    private breakpointObserver: BreakpointObserver,
    private summaryService: StoreSummaryService,
    public stateStore: StateStoreService
  ) {
  }

  resizeObservable$: Observable<Event> | undefined;
  resizeSubscription$: Subscription | undefined;

  miniCardData: StoreSummary[] | any;

  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: {cols: 1, rows: 1},
          chart: {cols: 1, rows: 2},
          table: {cols: 1, rows: 4},
        };
      }

      return {
        columns: 4,
        miniCard: {cols: 1, rows: 1},
        chart: {cols: 2, rows: 2},
        table: {cols: 4, rows: 4},
      };
    })
  );

  private defaultMiniCardsHeight = 200;
  public miniCardsOH = true;

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.fixContainerHeight();
    });

    this.stateStore.stores$.subscribe({
      next: store => {
        // @ts-ignore
        this.miniCardData = [...store.mini.filter(mini => mini.assigned).map(i => i.entity)];
        this.fixContainerHeight();
      }
    });
  }

  // tslint:disable-next-line:typedef
  ngAfterContentInit() {
    setTimeout(() => {
      // Handle lazy drag init
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }

  // tslint:disable-next-line:typedef
  private fixContainerHeight() {
    setTimeout(() => {
      const tiles = document.querySelectorAll('.dashboard-tile');
      const lastTile = tiles[tiles.length - 1];

      let miniCardsHeight = this.defaultMiniCardsHeight;
      if (lastTile && lastTile instanceof HTMLElement) {
        miniCardsHeight = lastTile?.offsetTop + lastTile?.offsetHeight;
      }

      if (miniCardsHeight > this.defaultMiniCardsHeight) {
        this.miniCardsOH = false;
      }

      // @ts-ignore
      document.querySelector('.mini-cards').style = `height: ${miniCardsHeight}px;`;
    }, 500);
  }

  // tslint:disable-next-line:typedef
  dropMiniCard(event: CdkDragDrop<StoreSummary[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        // @ts-ignore
        this.miniCardData,
        event.previousIndex,
        event.currentIndex
      );

      // @ts-ignore
      this.miniCardDataStore.next(this.miniCardData);
    }
  }

  // tslint:disable-next-line:typedef
  crossOffItem(data: any) {
    console.log(data);
  }
}
