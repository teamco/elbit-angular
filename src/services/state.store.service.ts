import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class StateStoreService {
  // tslint:disable-next-line:variable-name
  private readonly _store = new BehaviorSubject<{}>({mini: []});

  // the getter will return the last value emitted in _store subject
  // @ts-ignore
  private get stores(): { mini: [] } {
    // @ts-ignore
    return this._store.getValue();
  }

  // Expose the observable$ part of the _todos subject (read only stream)
  readonly stores$ = this._store.asObservable();

  // assigning a value to this.stores will push it onto the observable
  // and down to all of its subscribers (ex: this.stores = [])
  // @ts-ignore
  // tslint:disable-next-line:adjacent-overload-signatures
  private set stores(val: object) {
    // @ts-ignore
    this._store.next(val);
  }

  // tslint:disable-next-line:typedef
  addEntity(ns: string, entity: object) {
    // we assign a new copy of stores by adding a new store
    // with automatically assigned ID ( don't do this at home, use uuid() )
    const stores = [
      // @ts-ignore
      ...(this.stores[ns] || []),
      // @ts-ignore
      {id: (this.stores[ns] || []).length + 1, entity, assigned: false}
    ];

    // @ts-ignore
    this.stores = {
      ...this.stores,
      ...{[ns]: stores}
    };
  }

  // tslint:disable-next-line:typedef
  assign(ns: string, entity: object) {
    // tslint:disable-next-line:no-shadowed-variable
    // @ts-ignore
    const store = this.stores[ns].find(state => state.id === entity.id);

    if (store) {
      // @ts-ignore
      const index = this.stores[ns].indexOf(store);
      // @ts-ignore
      this.stores[ns][index] = {
        // @ts-ignore
        ...store,
        assigned: true
      };
      this.stores = {...this.stores};
    }
  }

  // tslint:disable-next-line:typedef
  removeEntity(ns: string, id: number) {
    // @ts-ignore
    this.stores = {
      ...this.stores,
      // @ts-ignore
      [ns]: this.stores[ns].filter(store => store.id !== id)
    };
  }
}
