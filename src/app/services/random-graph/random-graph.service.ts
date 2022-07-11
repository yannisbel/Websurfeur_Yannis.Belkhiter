import { Injectable } from '@angular/core';
import { BackendService } from '../backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class RandomGraphService {

  private graphs;

  constructor(private backend: BackendService) {}

  loadGraphs() {
    this.backend.get('graph').subscribe(graphs => {
      this.graphs = graphs;
    });
  }

  getRandomGraph() {
    return this.graphs[this.getRandomInt(this.graphs.length)];
  }

  private getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
