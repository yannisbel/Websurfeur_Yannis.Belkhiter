import { Injectable } from '@angular/core';
import { BackendService } from '../backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private route = 'stat';
  private statistics = [];

  constructor(private backend: BackendService) {
    this.getStatistics();
  }

  getStatistics(): Promise<Object[]> {
    let resolveFunc: (res: Object[]) => void;
    const promise = new Promise<Object[]>((resolve) => {
      resolveFunc = resolve;
    })

    this.backend.get(this.route).subscribe(stats => {
      this.statistics = stats;
      console.log(this.statistics);
      resolveFunc(this.statistics);
    })

    return promise;
  }

  postStatistic(stat) {
    this.backend.post(this.route, stat).subscribe(stat => {
      console.log(`${stat} is post on the server`);
    })
  }
}
