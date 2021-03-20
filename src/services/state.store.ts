import {Subject, Subscriber, Subscription, SubscriptionLike, ObjectUnsubscribedError} from 'rxjs';
import {fromJS, Record} from 'immutable';

/**
 * A variant of Subject that requires an initial value and emits its current
 * value whenever it is subscribed to.
 * All values are immutable
 */
export class ImmutableBehaviorSubject<T> extends Subject<T> {
  // tslint:disable-next-line:variable-name
  private _value?: Record<T> | T;

  constructor(value: T) {
    super();
    this._saveValue(value);
  }

  // tslint:disable-next-line:typedef
  private _getValue() {
    if ((this._value !== null && this._value !== undefined) && typeof this._value === 'object') {
      return (this._value as Record<T>).toJS();
    } else {
      return this._value as T;
    }
  }

  // tslint:disable-next-line:typedef
  private _saveValue(value: T) {
    if ((value !== null && value !== undefined) && typeof value === 'object') {
      this._value = fromJS(value);
    } else {
      this._value = value;
    }
  }

  get value(): T {
    return this.getValue();
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<T>): Subscription {
    const subscription = super._subscribe(subscriber);
    if (subscription && !(subscription as SubscriptionLike).closed) {
      subscriber.next(this._getValue());
    }
    return subscription;
  }

  getValue(): T {
    if (this.hasError) {
      throw this.thrownError;
    } else if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else {
      return this._getValue();
    }
  }

  // tslint:disable-next-line:typedef
  next(value: T) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
    if (!this.isStopped) {
      this._saveValue(value);

      const {observers} = this;
      const len = observers.length;
      const copy = observers.slice();
      for (let i = 0; i < len; i++) {
        const newVal = this._getValue();
        // tslint:disable-next-line:no-non-null-assertion
        copy[i].next(newVal!);
      }
    }
  }
}
