import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';
import * as d3 from 'd3';
import { GraphService } from 'src/app/services/graph/graph.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @ViewChild('visualiser', { static: true })
  visualiser: ElementRef | undefined;

  private svg: any;

  constructor(private router: Router,
              private gameService: GameService,
              private graphService: GraphService,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.setStyle(this.visualiser?.nativeElement, 'visibility', 'hidden')
    this.gameService.reset();
    const width = this.visualiser?.nativeElement.offsetWidth;
    const height = this.visualiser?.nativeElement.offsetHeight;
    /* console.log('Visu', this.visualiser) */
    this.svg = d3.select('#visualiser')
      .append('svg')
        .attr('id', 'mainBoard')
        .attr('width', width)
        .attr('height', height);
    this.graphService.drawGraph(this.svg);

    setTimeout(() => {
      this.gameService.startGame(this.svg)
      this.renderer.setStyle(this.visualiser?.nativeElement, 'visibility', 'visible');
      this.gameService.setReplayCallback(this.replay.bind(this));
    }, 3000)
  }

  replay(): void {
    d3.select('#details-informations')
          .style('color', `black`)
          .text(() => "Chargement du plateau de jeu...");
    this.clearSvg();
    setTimeout(() => {
      this.ngOnInit();
    }, 500)
  }

  goBackToMenu(): void {
    this.gameService.graph = undefined;
    this.router.navigate(['/configuration']);
  }

  private clearSvg(): void {
    this.renderer.setStyle(this.visualiser?.nativeElement, 'visibility', 'hidden')
    this.svg.remove();
  }

  validateTurn() {
    this.gameService.validateTurn()
  }

  previousTurn() {
    this.gameService.previousTurn()
  }

}
