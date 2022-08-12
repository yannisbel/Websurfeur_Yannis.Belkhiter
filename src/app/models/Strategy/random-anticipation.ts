import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IStrategy } from './istrategy';
import { Graph } from 'src/app/models/Graph/graph';
import * as d3 from 'd3';


export class RandomAnticipation implements IStrategy {
  [x: string]: any;

  actual_place: any;

  public placement(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]) {
    let edges = graph.edges(this.actual_place);
    edges.push(this.actual_place)
    edges = edges.filter(e => !(goat_position_index === e))
    return edges;
  }

  public action(graph: Graph, goat_position: { index: number, x: number, y: number }, cabbage_positions: { index: number, x: number, y: number }[], collectSpeed: number) {
    let res = [];
    let marked = [];
    let s = collectSpeed;
    let voisins = graph.edges(goat_position)
    for (const cabbage of cabbage_positions){
      for (const v of voisins){
        if(goat_position.index !== cabbage.index && s !== 0 && v.index === cabbage.index){
          marked.push(cabbage.index)
          const selected_target = d3.select('#'+'cabbage'+cabbage.index);
          res.push(selected_target);
          s = s-1
        }
      }
    }
    if (s !== 0){
      let h = cabbage_positions.filter(e => !(marked.includes(e.index)));
      while (s !== 0){
        let rand = Math.floor(Math.random() * h.length)
        const cabbage = h[rand]
        if(goat_position.index !== cabbage.index && s !== 0 && !(marked.includes(cabbage.index))){
          marked.push(cabbage.index)
          const selected_target = d3.select('#'+'cabbage'+cabbage.index);
          res.push(selected_target);
          s = s-1
        }
      }
    }
  return res;
  }
}

