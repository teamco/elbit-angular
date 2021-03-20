import {AfterContentInit, Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {StoreSummary} from '../../services/store.summary.service';
import {StateStoreService} from '../../services/state.store.service';

@Component({
  selector: 'app-runtime',
  templateUrl: './runtime.component.html',
  styleUrls: ['./runtime.component.less']
})

export class RuntimeComponent implements OnInit {

  constructor(
    private breakpointObserver: BreakpointObserver,
    public stateStore: StateStoreService
  ) {
  }

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

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.stateStore.stores$.subscribe({
      next: store => {
        // @ts-ignore
        this.miniCardData = [...store.mini.filter(mini => mini.assigned).map(i => i.entity)];
        console.log(this.miniCardData);
      }
    });
  }
}
