import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private activeTabIndexSource = new BehaviorSubject<number>(0);
  activeTabIndex$ = this.activeTabIndexSource.asObservable();

  setActiveTabIndex(index: number) {
    this.activeTabIndexSource.next(index);
  }
}
