import { NgModule } from '@angular/core';
import { IStrategy } from './istrategy';
import { CommonModule } from '@angular/common';
import { Graph } from 'src/app/models/Graph/graph';
import { GraphService } from 'src/app/services/graph/graph.service';
import { GameService } from 'src/app/services/game/game.service';
import { link } from 'fs';


export class NaiveGoat implements IStrategy {

  actual_place: any;

  public action(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]): any {
    let closest = graph.edges(goat_position_index);
    let distance = graph.nodes.length;
    let liste_dist = [];
    for(const l of closest) {
      let min = graph.distance(l, cabbage_positions_index);
      for(const t of cabbage_positions_index){
        const d = graph.distance(l, t); // On calcule la distance entre tous les sommets occupées par les choux et celui de la chèvre
        if (min >= d){
          min = d;
        }
      }
      liste_dist.push(min)
    }
    let min = Math.min(...liste_dist)
    let objectif = closest[liste_dist.indexOf(min)]
    return objectif;
    //console.log('solution retenue', objectif)
  }

  public placement(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]) {
    this.actual_place = graph.getRandomEdge();
    return this.actual_place;
  }

 
}
