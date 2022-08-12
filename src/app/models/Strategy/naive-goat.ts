import { NgModule } from '@angular/core';
import { IStrategy } from './istrategy';
import { CommonModule } from '@angular/common';
import { Graph } from 'src/app/models/Graph/graph';
import { GraphService } from 'src/app/services/graph/graph.service';
import { GameService } from 'src/app/services/game/game.service';


export class RandomGoat implements IStrategy {

  actual_place: any;

  public action(graph: Graph, goat_position: { index: number, x: number, y: number }, cabbage_positions: { index: number, x: number, y: number }[], collectSpeed: number): any {
    let voisins = graph.edges(goat_position);
    let objectif = voisins[Math.floor(Math.random() * voisins.length)]
    return objectif;
  }

  placement(graph: Graph, goat_position_index: number, cabbage_positions_index: number[]) {
    return 0;
  }
 
}
