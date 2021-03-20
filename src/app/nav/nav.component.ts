import {Component, OnInit, AfterViewInit, OnDestroy, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {StoreSummaryService} from '../../services/store.summary.service';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {StateStoreService} from '../../services/state.store.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements AfterViewInit, OnDestroy, OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  menuItems: string[];

  // tslint:disable-next-line:variable-name
  @ViewChild(TemplateRef) _dialogTemplate: TemplateRef<any> | undefined;
  // tslint:disable-next-line:variable-name
  private _overlayRef: OverlayRef | undefined;
  // tslint:disable-next-line:variable-name
  private _portal: TemplatePortal | undefined;

  public currentItem: any;

  // tslint:disable-next-line:variable-name max-line-length
  public dragItems: { mini: any[] };

  constructor(
    // tslint:disable-next-line:variable-name
    private _overlay: Overlay,
    private router: Router,
    // tslint:disable-next-line:variable-name
    private _viewContainerRef: ViewContainerRef,
    private breakpointObserver: BreakpointObserver,
    private summaryService: StoreSummaryService,
    public stateStore: StateStoreService
  ) {
    this.menuItems = ['configuration', 'dashboard'];
    this.dragItems = {mini: []};
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.summaryService.getStoreSummary().subscribe({
      next: summaryData => {
        summaryData.forEach(entity => this.stateStore.addEntity('mini', entity));
      }
    });
  }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    // @ts-ignore
    this._portal = new TemplatePortal(this._dialogTemplate, this._viewContainerRef);
    this._overlayRef = this._overlay.create({
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: false
    });
    // @ts-ignore
    // this._overlayRef.backdropClick().subscribe(() => this._overlayRef.detach());

    this.stateStore.stores$.subscribe({
      next: store => {
        // @ts-ignore
        this.dragItems.mini = [...store.mini];
      }
    });
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    // @ts-ignore
    this._overlayRef.dispose();
    this.currentItem = undefined;
  }

  // tslint:disable-next-line:typedef
  openDialog() {
    // @ts-ignore
    this._overlayRef.detach();
    // @ts-ignore
    this._overlayRef.attach(this._portal);
  }

  // tslint:disable-next-line:typedef
  handleDrag(drawer: { toggle: () => void; }, dragItem: any) {
    // drawer.toggle();
    this.currentItem = dragItem;
    // tslint:disable-next-line:no-unused-expression
    !dragItem.assigned && this.stateStore.assign('mini', dragItem);
  }

  // tslint:disable-next-line:typedef
  routeIsActive(routePath: string) {
    return this.router.url === routePath;
  }
}
