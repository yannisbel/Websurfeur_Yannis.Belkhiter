import { Injectable } from '@angular/core';
import { Graph } from 'src/app/models/Graph/graph';
import Swal from 'sweetalert2';
import * as d3 from 'd3';
import { Pawn } from 'src/app/models/Pawn/pawn';
import { environment } from 'src/environments/environment';
import { NavigationExtras, Router } from '@angular/router';
import { Strat2Goat } from 'src/app/models/Strategy/strat-2-goat';
import { IStrategy } from 'src/app/models/Strategy/istrategy';
import { GraphService } from '../graph/graph.service';
import { NaiveGoat } from 'src/app/models/Strategy/naive-goat';
import { NaiveCabbage } from 'src/app/models/Strategy/naive-cabbage.module';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  [x: string]: any;

  private _board_configuration: string | undefined;
  private _board_params: number[] = [];
  private _opponent_type: string | undefined;
  private _player_side: string = 'unknown';
  private _graph!: Graph;
  private _collect_speed = 1;

  public ai_strat!: IStrategy;

  private svg: any;

  private goat_turn: boolean = false;
  private goat_win: boolean = false;
  private goat_token: Pawn | undefined;
  private goat_node: Node;
  private cabbage_node: Node[];

  private goat_position: {x: number, y: number} = { x: -1, y: -1 };
  private cabbage_positions: {index: number, x: number, y: number}[] = [];
  private collected_cabbages: any[] = [];

  private collector_color = '#4dc738';
  private goat_color = '#b56528';

  private replayCallback: () => void = () => {};

  constructor(private router: Router) { 

  }

  /* Functions for game */

  startGame(svg: any): void {
    console.log('Starting game');
    this.svg = svg;
    let start_point;
    switch(this._graph?.typology) {
      case 'tree':
      default:
        start_point = this._graph?.nodes[0];
        break;
    }
    
    this.goat_turn = false;
    this.goat_node = start_point;

    if (this.opponent_type === 'ia'){
      this.chooseAIStrat()
      console.log('c est moi!');
    }

    for(const node of this._graph?.nodes) {
      if(node.index === start_point.index) continue;
      this.svg.append('circle')
        .attr('fill', 'url(#cabbage)')
        .attr('r', 30)
        .attr('cx', node.x)
        .attr('cy', node.y)
        .attr('index', node.index)
        .attr('id', `cabbage${node.index}`)
        .on('click', (event: Event) => {
          this.handleClickOnCabbage(event.target!)
        })
      this.cabbage_positions.push(node);
    }

    this.cabbage_positions = this.cabbage_nodes;
    console.log('index', start_point.index);

    this.goat_position_index = start_point.index;
    this.goat_position = { x: start_point.x, y: start_point.y };
    this.goat_token = new Pawn('goat', start_point, this.graph, this)

    this.update();
  }

  private handleClickOnCabbage(target: EventTarget) {
    // console.log('Click on cabbage', target);
    if(this.goat_turn) {
      d3.select('#collect-limit').remove();
      d3.select('#details-informations')
        .append('p')
        .attr('id', 'collect-limit')
        .style('color', 'red')
        .text(() => "Ce n'est pas au tour du collecteur de choux")
      return;
    }
    
    const selected_target = d3.select(target as any)
    if(this.collected_cabbages.find(t => t.attr('id') === selected_target.attr('id'))) {
      d3.select('#collect-limit').remove();
      const idx = this.collected_cabbages.findIndex(t => t.attr('id') === selected_target.attr('id'));
      if(idx !== -1) {
        this.collected_cabbages.splice(idx, 1);
        selected_target.attr('opacity', '1');
      }
    } else {
      if(this.collected_cabbages.length < this.collect_speed) {
        this.collected_cabbages.push(selected_target);
        selected_target.attr('opacity', '0.6');
      } else {
        d3.select('#collect-limit').remove();
        d3.select('#details-informations')
          .append('p')
          .attr('id', 'collect-limit')
          .style('color', 'red')
          .text(() => "Vous avez atteint la limite de récolte pour ce tour");
      }
    }
    this.displayCollectCount();
  }

  setOpponentType(type: string) {
    this.opponentType = type;
  }

  async validateParams() {
    if (this.paramSafetyCheck()) {

      if (this.graphGeneration) {
        await this.graphService.generateGraph(this.selectedGraphType, [this.config['graphParam1'], this.config['graphParam2']])
      }
      // else if (this.graphImportation) {
      //   this.graphService.loadGraphFromFile(this.inputGraphJSONFile);
      // }
      
      switch (this.gameModeSelected) {
        case "easy":
          break;
        case "medium":
          break;
        case "hard":
          break;
        case "extreme":
          break;
      }
      const extras: NavigationExtras = {
        queryParams: {
          // copsNum: this.cops,
          // graphType: this.selectedGraphType,
          // oppenent: this.selectedOpponentType,
          // graphParams: [this.graphParam1, this.graphParam2],
          gameMode: this.gameModeSelected
        }
      }
      this.gameService.setOpponentType(this.selectedOpponentType);
      this.gameService.setThiefSpeed(this.config['collectSpeed']);
      if (this.selectedOpponentType === 'ai') {
        this.gameService.setAiSide(this.selectedAi);
      } else {
        this.gameService.setAiSide(undefined);
      }
      this.setDataToLocalStorage();
      this.router.navigate(['/board'], extras);
    }
  }

  chooseAIStrat() {
    if (this._player_side === 'goat'){
      this.ai_strat = new NaiveCabbage();
    }
    else{
      this.ai_strat = new NaiveGoat();
    }
  }

  async update() {
    if(this.opponent_type === 'ai') {
      if(this._player_side === 'goat'){
        if(this.goat_turn === true){
          d3.select('#details-informations')
          .style('color', `${this.goat_color}`)
          .text(() => "C'est au tour de la chèvre")
        }
        else{ //C'est au tour de l'ia et il joue le collecteur de choux
          this.chooseAIStrat();
          console.log('cabbage', this.cabbage_position);
          d3.select('#details-informations')
          .style('color', `${this.collector_color}`)
          .text(() => "Le ramasseur de choux réfléchit à son coup...")
          console.log("Strategy", this.ai_strat);
          console.log("position_cabbage", this.cabbage_position_index);
          let pos = this.ai_strat.action(this.graph, this.goat_node, this.cabbage_nodes);
          console.log(pos);
          this.updateCabbagePosition(pos);
          this.validateTurn();
        }
      }
      else{
        if(this.goat_turn === false){
          d3.select('#details-informations')
          .style('color', `${this.collector_color}`)
          .text(() => "C'est au tour du ramasseur de choux")
        }
        else{ //C'est au tour de l'ia et il joue la chèvre
          this.chooseAIStrat();
          console.log('goat', this.goat_position);
          d3.select('#details-informations')
          .style('color', `${this.goat_color}`)
          .text(() => "La chèvre réfléchit à son coup...")
          console.log("Strategy", this.ai_strat);
          console.log("position_goat", this.goat_position_index);
          let pos = this.ai_strat.action(this.graph, this.cops_position, this.cabbage_positions_index);
          this.updateGoatPosition(pos);
          this.validateTurn();
        }
      }
    } else {
      if(this.goat_turn === true) {
        d3.select('#details-informations')
          .style('color', `${this.goat_color}`)
          .text(() => "C'est au tour de la chèvre")
      } else if(!this.goat_turn) {
        d3.select('#details-informations')
          .style('color', `${this.collector_color}`)
          .text(() => "C'est au tour du collecteur de choux");
        this.displayCollectCount();
      }
    }
  }
  


  private displayCollectCount() {
    d3.select('#collect-informations').remove();
    d3.select('#details-informations')
          .append('p')
          .attr('id', 'collect-informations')
          .text(() => `Nombre de choux restant à collecter : ${this.collect_speed - this.collected_cabbages.length}`)
  }

  private checkEnd() {
    return this.goat_win || this.cabbage_positions.length === 0;
  }

  private updateGoatPosition(new_goat_position: {index: number, x: number, y: number}) {
    this.goat_position = {...new_goat_position}
    const idx = this.cabbage_positions.findIndex(n => n.index === new_goat_position.index)
    if(idx !== -1) {
      this.goat_win = true;
    }
  }

  private updateCabbagePosition(positions : any) {
    for(const cabbage of positions) {
      const idx = this.cabbage_positions.findIndex(c =>{
        return c.index == cabbage.attr('index') 
      })
      
      if(idx !== -1) {
        this.cabbage_positions.splice(idx, 1)
        cabbage.remove();
      }
    }
    this.collected_cabbages = []
  }

  validateTurn() {
    if(this.goat_turn === true) {
      this.updateGoatPosition(this.goat_token?.getPosition() as any)
      this.goat_token?.setState(environment.pawnWaitingTurn)
    } else {
      this.collectCabbages();
      this.goat_token?.setState(environment.pawnOnTurn)
    }

    if(this.checkEnd()) {
      const message = this.goat_win ? 'La chèvre a gagnée !' : 'Le collecteur de choux a gagné !'
      const img_url = this.goat_win ? 'assets/goat.png' : 'assets/harvest.png'
      Swal.fire({
        title : 'Fin de partie',
        icon: 'success',
        text: message,
        showDenyButton: true,
        denyButtonText: 'Retour au menu',
        confirmButtonText: 'Rejouer',
        imageUrl: img_url,
        imageHeight: '10em'
      }).then((result) => {
        if(result.isDenied) {
          this.router.navigate(['/configuration']);
        } else if(result.isConfirmed) {
          this.replayCallback();
        }
      })

    }

    this.goat_turn = !this.goat_turn;
    this.update()
  }

  private collectCabbages() {
    for(const cabbage of this.collected_cabbages) {
      const idx = this.cabbage_positions.findIndex(c =>{
        return c.index == cabbage.attr('index') 
      })
      
      if(idx !== -1) {
        this.cabbage_positions.splice(idx, 1)
        cabbage.remove();
      }
    }
    this.collected_cabbages = []
  }


  /* Functions use to display the rules */

  private getRulesHtml() {
    return `<p>Dans ce jeu, deux camps s'affrontent : <span style='color: ${this.goat_color}'>la chèvre</span> et <span style='color: ${this.collector_color}'>le collecteur de choux</span>.</p><p>Le but de <span style='color: ${this.goat_color}'>la chèvre</span> est de manger un des choux présent sur le plateau de jeu.</p><p>Le but <span style='color: ${this.collector_color}'>du collecteur de choux</span> est de récolter tous les choux présent sur le plateau de jeu avant que la chèvre ne puisse en manger un.</p>`
      + `<br/><p>Le jeu se déroule au tout par tour. Après que <span style='color: ${this.goat_color}'>la chèvre</span> est placée sur le point de départ, <span style='color: ${this.collector_color}'>le collecteur de choux</span> commence à récolter les choux. <span style='color: ${this.goat_color}'>La chèvre</span> peut se déplacer d'un sommet par tour en suivant les arêtes.</p><p><span style='color: ${this.collector_color}'>Le collecteur de choux</span> peut récolter, par tour, un nombre de choux égal à sa vitesse de récolte.</p>`;
  }

  displayRules() {
    Swal.fire({
      icon: 'info',
      html: this.getRulesHtml()
    })
  }

  /* Getters */

  get board_conf(): string {
    if(this._board_configuration === undefined) {
      return 'unknwon';
    }
    return this._board_configuration;
  }

  get board_params(): number[] { return this._board_params; }

  get opponent_type(): string {
    if(this._opponent_type === undefined) {
      return 'unknown';
    }
    return this._opponent_type;
  }

  get player_side(): string { return this._player_side; }

  get graph(): Graph { return this._graph; }

  get collect_speed(): number { return this._collect_speed; }

  /* Setters */

  set board_conf(conf: string) { this._board_configuration = conf; }

  set board_params(params: number[]) { this._board_params = params; }

  set opponent_type(type: string) { this._opponent_type = type; }

  set player_side(side: string) { this._player_side = side; }

  set graph(graph: Graph) { this._graph = graph; }

  set collect_speed(speed: number) { this._collect_speed = speed; }

  setReplayCallback(callback: () => void) {
    this.replayCallback = callback;
  }

  reset() {
    this.goat_win = false;
    this.cabbage_positions = [];
    this.collected_cabbages = [];
  }

}
