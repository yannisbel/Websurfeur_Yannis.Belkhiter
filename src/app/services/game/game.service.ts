import { Injectable } from '@angular/core';
import { Graph } from 'src/app/models/Graph/graph';
import Swal from 'sweetalert2';
import * as d3 from 'd3';
import { Pawn } from 'src/app/models/Pawn/pawn';
import { environment } from 'src/environments/environment';
import { NavigationExtras, Router } from '@angular/router';
import { GloutonGoat } from 'src/app/models/Strategy/glouton-goat';
import { MaxPathGoat } from 'src/app/models/Strategy/max-path-goat';
import { IStrategy } from 'src/app/models/Strategy/istrategy';
import { GraphService } from 'src/app/services/graph/graph.service';
import { RandomGoat } from 'src/app/models/Strategy/naive-goat';
import { NaiveCabbage } from 'src/app/models/Strategy/naive-cabbage';
import { MaxDegAnticipation } from 'src/app/models/Strategy/max-deg-anticipation';
import { RandomAnticipation } from 'src/app/models/Strategy/random-anticipation';
import { leastIndex } from 'd3';
import { AdventureLevel } from 'src/app/models/Adventure/AdventureLevel/adventure-level';
import { AdventureService } from '../Adventure/adventure.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  [x: string]: any;

  public role_goat = 'goat';
  public role_cabbage = 'cabbage'
  private one_shoot = 0;
  private trou = [];
  private previous_trou = [];
  private previous_position: {index: number, x: number, y: number} = {index: 0, x: -1, y: -1 };
  private _board_configuration: string | undefined;
  private _board_params: number[] = [];
  private _opponent_type: string | undefined;
  private _player_side: string = 'unknown';
  private _graph!: Graph;
  private _collect_speed = 1;
  public path_speed;
  public isAdventure = false;

  public ai_strat!: IStrategy;

  private svg: any;

  public gameMode = 'easy';

  private goat_turn: boolean = false;
  private goat_win: boolean = false;
  private goat_token: Pawn | undefined;

  private goat_position: {index: number, x: number, y: number} = {index: 0, x: -1, y: -1 };
  private previous_goat_position = this.goat_position;
  private cabbage_positions: {index: number, x: number, y: number}[] = [];
  private collected_cabbages: any[] = [];
  private cabbage_position_index: number[] = [];

  private collector_color = '#4dc738';
  private goat_color = '#b56528';

  private replayCallback: () => void = () => {};

  constructor(private router: Router) { 

  }

  /* Functions for game */

  startGame(svg: any): void {
    console.log('Starting game');
    console.log(this._graph)
    this.svg = svg;
    let start_point;
    switch(this._graph?.typology) {
      case 'tree':
      default:
        start_point = this._graph?.nodes[0];
        break;
    }
    
    console.log('okay', this.isAdventure);
    console.log('lets go', this.adventureLevel);

    if (this.isAdventure){
      this.chooseAIStrat();
      this.opponent_type = 'ai';
      this._player_side = this.getAdventurePlayerRole();
      console.log('wahoo', this._player_side);
    }

    if (this.opponent_type === 'ia'){
      this.chooseAIStrat();
      console.log('c est moi!');
    }

    if (this.opponent_type !== 'ia'){
      this.isAdventure = false;
    }

    for(const node of this._graph?.nodes) {
      if(node.index === start_point.index) continue;
      this.svg.append('circle')
        .attr('fill', `url(#${this.role_cabbage})`)
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
/*
    d3.select('#details-informations')
    .style('color', `${this.collector_color}`)
    .text(() => "C'est au tour du collecteur de choux");
    this.displayCollectCount();
*/
    console.log('cabbage', this.cabbage_positions);
    console.log('index', start_point.index);

    this.previous_position = start_point;
    this.goat_position = start_point;
    this.goat_token = new Pawn(this.role_goat, start_point, this.graph, this);
    this.goat_turn = false;
    this.update();
  }

  private handleClickOnCabbage(target: EventTarget) {
    // console.log('Click on cabbage', target);
    if(this.goat_turn && this.role_cabbage === 'cabbage') {
      d3.select('#collect-limit').remove();
      d3.select('#details-informations')
        .append('p')
        .attr('id', 'collect-limit')
        .style('color', 'red')
        .text(() => "Ce n'est pas au tour du collecteur de choux")
      return;
    }
    if(this.goat_turn && this.role_cabbage === 'page') {
      d3.select('#collect-limit').remove();
      d3.select('#details-informations')
        .append('p')
        .attr('id', 'collect-limit')
        .style('color', 'red')
        .text(() => "Ce n'est pas au tour du navigateur web")
      return;
    }
    console.log('c la cible', target)
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

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
    },1000)
  }

  changeColorHack(){
    if (this.role_goat === 'hacker'){
      this.collector_color = '#0000FF';
      this.goat_color = '#5b5b5b';
    }
  }

  changeColorGoat(){
    if (this.role_goat === 'goat'){
      this.collector_color = '#4dc738';
      this.goat_color = '#b56528';
    }
  }

  chooseAIStrat() {
    if (this._player_side === 'goat'){
      if (this.gameMode === 'easy'){
      this.ai_strat = new NaiveCabbage();
    }
    if (this.gameMode === 'medium'){
      this.ai_strat = new RandomAnticipation();
      }
    if (this.gameMode === 'hard'){
      this.ai_strat = new MaxDegAnticipation();
    }
    else{
      this.ai_strat = new MaxDegAnticipation();
    }
  }
  else{
    if (this.gameMode === 'easy'){
      this.ai_strat = new RandomGoat();
      }
    if (this.gameMode === 'medium'){
      this.ai_strat = new GloutonGoat();
      }
    if (this.gameMode === 'hard'){
      this.ai_strat = new MaxPathGoat();
      }
    else{
      this.ai_strat = new MaxPathGoat();
      }
    }
  }

  async update() {
    if(this.opponent_type === 'ai') {
      if(this._player_side === 'goat'){
        if(this.goat_turn === true){
          d3.select('#details-informations')
            .style('color', `${this.goat_color}`)
            .data([this.role_cabbage])
            .text(function(d){
              console.log("d",d)
              if(d === 'cabbage'){
                return "Le collecteur de choux a fini de récolter les choux pour ce tour (sommets violets)";
              }
              else{
                return "Le navigateur web a fini de précharger les pages web pour ce tour (sommets violets)";
              }})
            .append('p')
            .style('color', `${this.goat_color}`)
            .data([this.role_cabbage])
            .text(function(d){
              if(d === 'cabbage'){
                return "C'est au tour de la chèvre"
              }
              else{
                return "C'est au tour du hacker"
              }})
              this.displayPathCount(this._path_speed)
          d3.select('#info-jeu')
            .style('color', `${this.goat_color}`)
            .data([this.role_cabbage])
            .text(function(d){
              if(d === 'cabbage'){
                return "JOUEUR = Chèvre"
              }
              else{
                return "JOUEUR = Hacker"
              }})
            .append('p')
            .attr('id', 'ia-player')
            .style('color', `${this.collector_color}`)
            .data([this.role_cabbage])
            .text(function(d){
              if(d === 'cabbage'){
                return "IA = Collecteur de choux"
              }
              else{
                return "IA = Navigateur Web"
              }});
        }
        else{ //C'est au tour de l'ia et il joue le collecteur de choux
          this.chooseAIStrat();
          console.log('trou précédent', this.trou);
          console.log('cabbage', this.cabbage_position);
          d3.select('#details-informations')
          .style('color', `${this.collector_color}`)
          .data([this.role_cabbage])
          .text(function(d){
            if(d === 'cabbage'){
              return "Le collecteur de choux réfléchit à son coup..."
            }
            else{
              return "Le navigateur web réfléchit à son coup..."
            }})
          console.log("Strategy", this.ai_strat);
          let pos = this.ai_strat.action(this.graph, this.goat_position, this.cabbage_positions, this.collect_speed);
          this.collected_cabbages = pos;
          console.log('choux à retirer', this.collected_cabbages);
          this.validateTurn();
        }
      }
      else{
        if(this.goat_turn === false){
          this.previous_position = this.goat_position;
          d3.select('#details-informations')
            .style('color', `${this.collector_color}`)
            .data([this.role_cabbage])
            .text(function(d){
              if(d === 'cabbage'){
              return "La chèvre a finit son tour. Elle s'est déplacé sur un nouveau sommet."
            }
            else{
              return "Le hackeur a finit son tour. Il s'est déplacé sur un nouveau sommet."
            }})
            .append('p')
            .style('color', `${this.collector_color}`)
            .data([this.role_cabbage])
            .text(function(d){
              if(d === 'cabbage'){
              return "C'est au tour de la chèvre :"
            }
            else{
              return "C'est au tour du navigateur web :"
            }})
          d3.select('#info-jeu')
            .style('color', `${this.collector_color}`)
            .data([this.role_cabbage])
            .text(function(d){
              if(d === 'cabbage'){
                return "JOUEUR = Collecteur de choux"
              }
              else{
                return "JOUEUR = Navigateur web"
              }})
            .append('p')
            .attr('id', 'ia-player')
            .style('color', `${this.goat_color}`)
            .data([this.role_cabbage])
            .text(function(d){
              if(d === 'cabbage'){
                return "IA = Chèvre"
              }
              else{
                return "IA = Hacker"
              }});
        }
        else{ //C'est au tour de l'ia et il joue la chèvre
          this.chooseAIStrat();
          d3.select('#details-informations')
            .style('color', `${this.goat_color}`)
            .data([this.role_cabbage])
            .text(function(d){
              if(d === 'cabbage'){
                return "La chèvre réfléchit à son coup..."
              }
              else{
                return "Le hackeur réfléchit à son tour..."
              }})
          let pos = this.ai_strat.action(this.graph, this.goat_position, this.cabbage_positions, this.collect_speed);
          this.goat_position = pos;
          this.goat_position_index = pos.index;
          this.goat_token?.updatePosition(pos);
          this.displayPathCount(this._path_speed);
          this.validateTurn();
        }
      }
    }  else {
      if(this.goat_turn === true) {
        d3.select('#details-informations')
          .style('color', `${this.goat_color}`)
          .data([this.role_cabbage])
          .text(function(d){
            if(d === 'cabbage'){
            return "Le collecteur de choux a fini de récolter les choux pour ce tour (sommets violets)"
          }
          else{
            return "Le navigateur web a fini de précharger les pages pour ce tour (sommets violets)"
          }})
          .append('p')
          .style('color', `${this.goat_color}`)
          .data([this.role_cabbage])
          .text(function(d){
            if(d === 'cabbage'){
            return "C'est à la chèvre de jouer :"
          }
          else{
            return "C'est au hackeur de jouer :"
          }})
        d3.select('#info-jeu')
          .style('color', `${this.goat_color}`)
          .data([this.role_cabbage])
          .text(function(d){
            if(d === 'cabbage'){
            return "JOUEUR 1 = Chèvre"
          }
          else{
            return "JOUEUR 1 = Hackeur"
          }})
          .append('p')
          .attr('id', 'ia-player')
          .style('color', `${this.collector_color}`)
          .data([this.role_cabbage])
          .text(function(d){
            if(d === 'cabbage'){
            return "JOUEUR 2 = Collecteur de choux"
          }
          else{
            return "JOUEUR 2 = Navigateur web"
          }});
        this.displayPathCount(this._path_speed)
      } else if(!this.goat_turn) {
        console.log('trou précédent', this.trou);
        d3.select('#details-informations')
          .style('color', `${this.collector_color}`)
          .data([this.role_cabbage])
          .text(function(d){
            if(d === 'cabbage'){
            return "La chèvre vient de finir son tour, c'est au collecteur de choux de jouer"
          }
          else{
            return "Le hackeur vient de finir son tour, c'est au navigateur web de jouer"
          }})
        d3.select('#info-jeu')
          .style('color', `${this.goat_color}`)
          .data([this.role_cabbage])
          .text(function(d){
            if(d === 'cabbage'){
            return "JOUEUR 1 = Chèvre"
          }
          else{
            return "JOUEUR 1 = Hackeur"
          }})
          .append('p')
          .attr('id', 'ia-player')
          .style('color', `${this.collector_color}`)
          .data([this.role_cabbage])
          .text(function(d){
            if(d === 'cabbage'){
            return "JOUEUR 2 = Collecteur de choux"
          }
          else{
            return "JOUEUR 2 = Navigateur web"
          }});
        this.displayCollectCount();
      }
    }

  }


  private displayCollectCount() {
    d3.select('#collect-informations').remove();
    d3.select('#details-informations')
          .append('p')
          .style('color', this.role_cabbage)
          .attr('id', 'collect-informations')
          .text(`Nombre de coups restant à collecter : ${this.collect_speed - this.collected_cabbages.length}`)
  }

  private displayPathCount(n: number) {
    d3.select('#path-informations').remove();
    d3.select('#details-informations')
          .append('p')
          .style('color', this.role_goat)
          .attr('id', 'path-informations')
          .text(`Nombre de pas restant à faire : ${n}`)
  }

  getRoleCabb(){
    return this.role_cabbage;
  }

  private checkEnd() {
    return this.goat_win || this.cabbage_positions.length === 0;
  }

  private updateGoatPosition(new_goat_position: {index: number, x: number, y: number}) {
    this.previous_position = this.goat_position;
    console.log('position précédente', this.previous_position);
    if (this.one_shoot === 1){
      this.one_shoot = 0;
    }
      this.goat_position = {...new_goat_position}
    const idx = this.cabbage_positions.findIndex(n => n.index === new_goat_position.index)
    if(idx !== -1) {
      this.goat_win = true;
    }
  }


  previous_goat(){
    console.log('ancienne position de la chèvre', this.previous_goat_position)
    console.log('actuelle', this.goat_position)
    this.goat_position = this.previous_goat_position;
    this.goat_position_index = this.previous_goat_position.index;
    this.goat_token?.updatePosition(this.previous_goat_position);
    this.updateGoatPosition(this.previous_goat_position);
    this.goat_token?.setState(environment.pawnWaitingTurn);
  }


  previous_cabbage(){
    //On remet en violets les sommets pris du tour précédent
      console.log('anciennes positions des choux', this.trou)
      for (const c of this.trou){
        let x = c.attr('cx');
        let y = c.attr('cy');
        let index = c.attr('index');
        let cabb = this._graph.nodes[index];
        console.log('index number', index)
        this.svg.append('circle')
        .attr('fill', `url(#${this.role_cabbage})`)
        .attr('r', 30)
        .attr('cx', x)
        .attr('cy', y)
        .attr('index', index)
        .attr('id', `cabbage${parseInt(index)}`)
        .on('click', (event: Event) => {
        this.handleClickOnCabbage(event.target!)
        })
        this.cabbage_positions.push(cabb);
        console.log('liste des choux', this.cabbage_positions)
        this.trou = [];

      }
        /* for(const t of this.trou){
        console.log('indice', t.attr('index'))
        const num = t.attr('index')
        var  cercle = d3.selectAll('circle')
          .filter(function() {
            return d3.select(this).attr("index") == num; // filter by single attribute
          })
        this.svg.append('circle')
          .attr('fill', 'url(#cabbage)')
          .attr('r', 30)
          .attr('cx', cercle.attr('cx'))
          .attr('cy', cercle.attr('cy'))
          .attr('index', num)
          .attr('id', `cabbage${num}`)

        let cabbage_toadd = this.cabbage_positions[0]
        cabbage_toadd.index = parseInt(t.attr("index"));
        cabbage_toadd.x = parseFloat(t.attr("cx"));
        cabbage_toadd.y = parseFloat(t.attr("cy"))
        this.cabbage_positions.push(cabbage_toadd)
      } */
  }



  previousTurn() {
    if (this.opponent_type === 'ai'){
      console.log("ai = collecteur, position chèvre : ", this.goat_position, this.previous_goat_position)
      if (this._player_side === 'goat'){
        this.previous_goat()
        this.previous_cabbage()
        this.goat_turn = true;
        this.goat_token?.setState(environment.pawnOnTurn);
        this.update();
      } else{
        this.previous_goat()
        this.previous_cabbage()
        this.goat_turn = false;
      }
    } else {
      if (this.goat_turn){
        for (let number of [].constructor(this._path_speed)){
          this.previous_cabbage()
          this.goat_turn = false
          this.update();
        }
        this.validateTurn();
      } else {
        this.previous_goat()
        this.goat_turn = true
        this.update();
        this.validateTurn();
      }
    this.update();
    this.validateTurn();
    }
 }

  validateTurn() {
    if(this.goat_turn === true) {
      this.previous_goat_position = this.previous_position;
      this.updateGoatPosition(this.goat_token?.getPosition() as any);
      this.goat_token?.setState(environment.pawnOnTurn);
      this._path_speed -= 1;
    } else {
      console.log('hello', this.collected_cabbages);
      this.collectCabbages();
      this.goat_token?.setState(environment.pawnOnTurn)
    }

    if(this.checkEnd() && !this.isAdventure) {
      if (this.role_goat === 'hacker'){
        this.message = this.goat_win ? 'Le hacker a gagné !' : 'Le navigateur web a gagné !'
        this.img_url = this.goat_win ? 'assets/hacker.png' : 'assets/page.png'
      }
      else{
        this.message = this.goat_win ? 'La chèvre a gagné !' : 'Le collecteur de choux a gagné !'
        this.img_url = this.goat_win ? 'assets/goat.png' : 'assets/harvest.png'
      }
      Swal.fire({
        title : 'Fin de partie',
        icon: 'success',
        text: this.message,
        showDenyButton: true,
        denyButtonText: 'Retour au menu',
        confirmButtonText: 'Rejouer',
        imageUrl: this.img_url,
        imageHeight: '10em'
      }).then((result) => {
        if(result.isDenied) {
          this.router.navigate(['/configuration']);
        } else if(result.isConfirmed) {

          this.replayCallback();
        }
      })

    }

    if(this.checkEnd() && this.isAdventure) {
      if (this.player_side === 'goat'){
        this.message = this.goat_win ? 'La chèvre a gagnée ! Vous avez réussi le niveau !' : 'Le collecteur de choux a gagné ! Vous avez échoué...'
        this.img_url = this.goat_win ? 'assets/goat.png' : 'assets/harvest.png'
      }
      else{
        this.message = this.goat_win ?  'La chèvre a gagné ! Vous avez échoué...' : 'Le collecteur de choux a gagné ! Vous avez réussi le niveau !'
        this.img_url = this.goat_win ? 'assets/harvest.png' : 'assets/goat.png'
      }
      Swal.fire({
        title : 'Fin de partie',
        icon: 'success',
        text: this.message,
        showDenyButton: true,
        denyButtonText: 'Retour au menu',
        confirmButtonText: 'Niveau suivant',
        imageUrl: this.img_url,
        imageHeight: '10em'
      }).then((result) => {
        if(result.isDenied) {
          this.router.navigate(['/adventure-menu']);
        } else if(result.isConfirmed) {
          this.AdventureService.launchNextLevel()
          /*
          this.adventure.goToNextLevel();
          console.log('indice de niveau', this.adventure.level_index);
          this.setAdventureLevel(this.adventure.getCurrentLevel());
          console.log('niveau_actuel', this.adventureLevel);
          console.log('avant', this._graph);
          this._graph = (this.GraphService.generateGraph(this.adventureLevel.getGraphType(), this.adventureLevel.getGraphParams()));
          console.log('après', this._graph);
          if (this.adventureLevel.getAiSide() === 'goat'){
            this.gameService.set_player_side = 'cabbage';
          }else{
            this.gameService.set_player_side = 'cabbage';
          }
          this.setCollect_speed(this.adventureLevel.getCollectSpeed());
          let extras = {
            queryParams: {
              gameMode: level.getDifficulty(),
              adventure: true
            }
          }
          this.update()
          */
        }
        })

    }
    this.goat_turn = true;
    if (this._path_speed === 0){
      this.goat_turn = !this.goat_turn;
      this._path_speed = 5;
      this.goat_token?.setState(environment.pawnWaitingTurn);
    }
    this.update()
  }

  private collectCabbages() {
    console.log('trou', this.trou)
    if (this.trou !== []){
      for(const t of this.trou){
        const num = t.attr('index')
        this.svg.selectAll('circle')
          .filter(function() {
            return d3.select(this).attr("index") == num; // filter by single attribute
          })
          .transition().duration(1000)
          .attr('r', 20)
          .attr('fill', 'rgb(69, 133, 195)')
          .style('fill', 'rgb(69, 133, 195)')
      }
      this.previous_trou = this.trou
      this.trou = [];
    }
    for(const cabbage of this.collected_cabbages) {
      console.log("liste des choux 2", this.cabbage_positions)
      const idx = this.cabbage_positions.findIndex(c =>{
        return c.index == cabbage.attr('index')
      })
      this.trou.push(cabbage);
      const num = cabbage.attr('index')
      this.svg.selectAll('circle')
        .filter(function() {
          return d3.select(this).attr("index") == num; // filter by single attribute
        })
        .transition().duration(1000)
        .attr('r', 20)
        .attr('fill', 'purple')
        .style('fill', 'purple')
      if(idx !== -1) {
        console.log('hey', cabbage.attr('index'))
        this.cabbage_positions.splice(idx, 1)
        cabbage.remove();
      }
    }
    this.collected_cabbages = []
    console.log("liste des choux 2", this.cabbage_positions)
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

  public nextLevel(){
    this.adventure.goToNextLevel();
    console.log('indice de niveau', this.adventure.level_index);
    this.setAdventureLevel(this.adventure.getCurrentLevel());
    console.log('niveau_actuel', this.adventureLevel);
    console.log('avant', this._graph);
    const type_graph = this.adventureLevel.getGraphType();
    const param_graph =  this.adventureLevel.getGraphParams();
    this._graph = GraphService.generateGraph(type_graph, param_graph)[1];
    console.log('après', this._graph);
    if (this.adventureLevel.getAiSide() === 'goat'){
      this.gameService.set_player_side = 'cabbage';
    }else{
      this.gameService.set_player_side = 'cabbage';
    }
    this.setCollect_speed(this.adventureLevel.getCollectSpeed());
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

  setAiSide(ai: string) { this._opponent_type = ai}

  get graph(): Graph { return this._graph; }

  get collect_speed(): number { return this._collect_speed; }

  getAdventurePlayerRole() {
    return this.adventure.getCurrentLevel().getPlayerRoleName();
  }



  /* Setters */

  setIsAdventure(adventure) {
    this.isAdventure = adventure;
  }

  setAdventure(adventure) {
    this.adventure = adventure;
    this.isAdventure = true;
  }

  setAdventureLevel(level) {
    this.adventureLevel = level;
    this.isAdventure = true;
  }

  
  setEndLevelCallback(callback) {
    this.endLevelCallback = callback;
  }

  setDisplayWarningZone(callback) {
    this.displayWarningZone = callback;
  }

  set board_conf(conf: string) { this._board_configuration = conf; }

  set board_params(params: number[]) { this._board_params = params; }

  set opponent_type(type: string) { this._opponent_type = type; }

  set player_side(side: string) { this._player_side = side; }

  set graph(graph: Graph) { this._graph = graph; }

  setGraph(graph: Graph) { this._graph = graph; }


  set collect_speed(speed: number) { this._collect_speed = speed; }

  setCollect_speed(speed: number)  { this._collect_speed = speed; }

  setReplayCallback(callback: () => void) {
    this.replayCallback = callback;
  }

  reset() {
    this.goat_win = false;
    this.cabbage_positions = [];
    this.collected_cabbages = [];
  }

}
