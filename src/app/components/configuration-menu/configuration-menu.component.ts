import { ParamBoundary } from 'src/app/models/param-boundary.model';
import { GameService } from 'src/app/services/game/game.service';
import { GraphService } from 'src/app/services/graph/graph.service';
import { NavigationExtras, Router } from '@angular/router';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Specific } from 'src/app/models/Graph/Specific/specific';


@Component({
  selector: 'app-configuration-menu',
  templateUrl: './configuration-menu.component.html',
  styleUrls: ['./configuration-menu.component.scss']
})
export class ConfigurationMenuComponent implements OnInit {

  public configurations = ['tree', 'cycle', 'grid', 'tore', 'rope'];
  public selected_configuration: string = 'tree';
  public importations = ['classic', 'dodecahedron', 'petersen'];
  public configuration_param_boundaries: { [index: string]: { param1: ParamBoundary, param2: ParamBoundary | undefined } } = {
    tree: {
      param1: { min: 2, max: 25 },
      param2: { min: 1, max: 10 }
    },
    cycle: {
      param1: { min: 2, max: 20 },
      param2: undefined
    },
    grid: {
      param1: { min: 1, max: 25 },
      param2: { min: 1, max: 25 }
    },
    tore: {
      param1: { min: 1, max: 25 },
      param2: { min: 1, max: 25 }
    },
    peterson: {
      param1: { min: -1, max: -1 },
      param2: undefined
    },
    classic: {
      param1: { min: -1, max: -1 },
      param2: undefined
    },
    rope: {
      param1: { min: 1, max: 25 },
      param2: undefined
    },
    import: {
      param1: { min: 1, max: 25 },
      param2: undefined
    }
  }

  public param1: number = 0;
  public param2: number = 0;

  public selectedFileName = undefined;
  private inputGraphJSONFile: File = null;
  private graphGeneration: boolean = true;
  private graphImportation: boolean = false;

  public opponent_types = ['ai', 'player'];
  private selected_opponent_type = 'player' // 'ai';

  public sides = ['goat', 'harvest'];
  private player_side = 'goat';

  public collect_speed = 1;
  public path_speed = 1;

  public selected_level = 'easy';

  constructor(private gameService: GameService, private router: Router, private graphService: GraphService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initParams();
    this.selectConfiguration(this.selected_configuration);
      this.getDataFromLocalStorage();
      if(navigator.userAgent.includes('Android') 
          || navigator.userAgent.includes('iPad') || navigator.userAgent.includes('iPhone')) {
        this.selected_opponent_type = 'ai'
      }
      this.selectGraphType(this.selected_configuration);
      this.updateParamsName();
  }
  
  private getDataFromLocalStorage() {
    if(localStorage.getItem('graphType')) {
      this.selected_configuration = localStorage.getItem('graphType');
    }
    if(localStorage.getItem('graphParam1')) {
      this.gameService.config['graphParam1'] = +localStorage.getItem('graphParam1')
    }
    if(localStorage.getItem('graphParam2')) {
      this.gameService.config['graphParam2'] = +localStorage.getItem('graphParam2')
    }
    if(localStorage.getItem('opponentType')) {
      this.gameService.selectedOpponentType = localStorage.getItem('opponentType')
    }
    if(localStorage.getItem('selectedAi')) {
      this.gameService.selectedAi = localStorage.getItem('selectedAi')
    }
    if(localStorage.getItem('gameMode')) {
      this.gameService.gameModeSelected = localStorage.getItem('gameMode')
    }
    if(localStorage.getItem('speed')) {
      this.gameService.config['collectSpeed'] = +localStorage.getItem('speed')
    }
    if(localStorage.getItem('copsNum')) {
      this.gameService.config['copsNumber'] = +localStorage.getItem('copsNum')
    }
  }

  private setDataToLocalStorage() {
    localStorage.setItem('graphType', this.selected_configuration)
    localStorage.setItem('graphParam1', `${this.gameService.config['graphParam1']}`)
    localStorage.setItem('graphParam2', `${this.gameService.config['graphParam2']}`)
    localStorage.setItem('opponentType', this.selected_opponent_type)
    localStorage.setItem('selectedAi', this.gameService.selectedAi)
    localStorage.setItem('gameMode', this.gameService.gameModeSelected)
    localStorage.setItem('speed', `${this.gameService.config['thiefSpeed']}`)
    localStorage.setItem('copsNum', `${this.gameService.config['copsNumber']}`)
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges()
  }

  updateGraphParams() {
    this.gameService.config['graphParam1'] = this.gameService.paramsBoundaries[this.gameService.selectedGraphType].param1;
    this.gameService.config['graphParam2'] = this.gameService.paramsBoundaries[this.gameService.selectedGraphType].param2;
  }

  updateParamsName() {
    switch (this.selected_configuration) {
      case 'grid':
        this.gameService.paramsNames = ['Largeur :', 'Longueur :'];
        break;
      case 'tore':
        this.gameService.paramsNames = ['Largeur :', 'Longueur :'];
        break;
      case 'cycle':
        this.gameService.paramsNames = ['Nombre de noeuds :']
        break;
      case 'tree':
        this.gameService.paramsNames = ['Nombre de noeuds :', 'Arité de l\'arbre :']
        break;
      case 'copsAlwaysWin':
        this.gameService.paramsNames = ['Nombre de noeuds :']
        break;
      case 'random':
        this.gameService.paramsNames = []
        break;
      default:
        this.gameService.paramsNames = []
        break;
    }
  }


  private initParams(): void {
    if (this.configuration_param_boundaries[this.selected_configuration].param1 !== undefined) {
      this.param1 = this.configuration_param_boundaries[this.selected_configuration].param1!.min;
    } else { this.param1 = -1 }
    if (this.configuration_param_boundaries[this.selected_configuration].param2 !== undefined) {
      this.param2 = this.configuration_param_boundaries[this.selected_configuration].param2!.min;
    } else { this.param2 = -1 }
  }

  displayRules() {
    this.gameService.displayRules()
  }

  selectGraphImportation() {
    this.graphGeneration = false;
    this.graphImportation = true;
    /* this.selectedGraphType = 'grid' */
  }

  goBack() {
    this.router.navigate(['/game-mode-selection'])
  }

  /* Functions for board configuration selection */

  getConfigurationName(configuration: string): string {
    switch (configuration) {
      case 'tree':
        return 'Arbre';
      case 'cycle':
        return 'Cycle';
      case 'grid':
        return 'Grille';
      case 'tore':
        return 'Grille torique';
      case 'the_one':
        return 'Un arbre différent';
      case 'rope':
        return 'Graphes Cordaux';
      case 'dodecahedron':
        return 'Dodécahédron';
      case 'petersen':
        return 'Petersen';
      case 'classic':
        return 'Classique';  
      default:
        return 'Configuration inconnue';
      case 'import':
        return 'import';
    }
  }

  selectConfiguration(configuration: string) {
    if(!configuration.includes('conf')) {
      this.selected_configuration = configuration;
      this.graphImportation = false;
      this.graphGeneration = true;
    }
    this.initParams();
  }

  selectImportation(configuration: string) {
    if(!configuration.includes('import')) {
      this.selected_configuration = configuration;
      this.graphImportation = false;
      this.graphGeneration = true;
    }
    this.initParams();
  }

  isSelectedConfiguration(configuration: string): string {
    let classes = this.selected_configuration === configuration ? 'selected' : ''
    classes += ` ${configuration.includes('conf') ? 'disabled' : ''}`
    return classes
  }

  isSelectedGraphType(typology : any) {
    return typology === this.selected_configuration ? 'selected' : ''
  }

  async selectGraphType(type: string) {
    this.selected_configuration = type;
    if(type !== 'import' && type !== 'dodecahedron' && type !== 'petersen' && type !== 'classic') {
      this.graphImportation = false;
      this.graphGeneration = true;
      this.updateGraphParams();
    }
    this.updateParamsName();
  }
  

  onFileChange(file : File) {
    if (file) {
      this.inputGraphJSONFile = file;
      this.selectedFileName = this.inputGraphJSONFile.name;
      this.graphService.loadGraphFromFile(file);
      this.graphGeneration = false;
      this.graphImportation = true;
    } else {
      this.selectedFileName = undefined
    }
  }

  /* Functions for inputs */

  checkValueRightness(event: FocusEvent) {
    const target = event.target as any
    if (target.value !== '') {
      if (+target.value < target.min) {
        target.value = target.min;
      } else if (target.max !== '' && +target.value > target.max) {
        target.value = target.max;
      }
    } else {
      target.value = target.min;
    }
  }

  getParam1Name() {
    switch (this.selected_configuration) {
      case 'tree':
        return 'Nombre de noeuds : ';
      case 'cycle':
        return 'Nombre de noeuds : ';
      case 'petersen':
        return '';
      case 'grid':
        return 'Largeur : ';
      case 'tore':
        return 'Largeur :';
      case 'rope':
        return 'Nombre de noeuds : ';
      case 'dodecahedron':
        return '';
      case 'petersen':
        return '';
      case 'import':
        return '';
      default:
        return 'Unknown but usefeul (I think)'
    }
  }


  
  getParam2Name() {
    switch (this.selected_configuration) {
      case 'tree':
        return 'Arité :';
      case 'cycle':
        return '';
      case 'petersen':
        return '';
        case 'grid':
          return 'Longueur :';
        case 'tore':
          return 'Longueur :';
        case 'rope':
          return '';
        case 'dodecahedron':
          return '';
      default:
        return 'Unknown but usefeul (I think)'
    }
  }

  displayHack(){
    this.gameService.role_goat = 'hacker';
    this.gameService.role_cabbage = 'page';
    this.gameService.changeColorHack();
    Swal.fire({
      icon: 'info',
      title: 'Mode WebSurfer activé',
      imageUrl: 'assets/hacker.png',
      imageHeight: '10em',
      text: 'Vous jouer maintenant avec un hacker et un navigateur web',
    })
  }

  displayGoat(){
    this.gameService.role_goat = 'goat';
    this.gameService.role_cabbage = 'cabbage';
    this.gameService.changeColorGoat();
    Swal.fire({
      icon: 'info',
      title: 'Mode Ludique activé',
      imageUrl: 'assets/harvest.png',
      imageHeight: '10em',
      text: 'Vous jouer maintenant avec une chèvre et un collecteur de choux',
    })
  }

  public update_action = {
    increase: 'INCREASE',
    decrease: 'DECREASE'
  }

  updateNumberFieldValue(event: FocusEvent, action: string) {
    const target = event.target as any
    switch (action) {
      case this.update_action.increase:
          target.value++;
        break;
      case this.update_action.decrease:
          target.value--;
        break;
      default:
        break;
    }
  }

  /* Functions for opponent type selection */

  getOpponentTypeMessage(type: string): string {
    switch (type) {
      case 'ai':
        return 'Jouer contre un ordinateur';
      case 'player':
        return 'Jouer à 2 joueurs';
      default:
        return 'Adversaire inconnue';
    }
  }

  selectOpponentType(type: string) {
    if(type == 'ai') {
      this.selected_opponent_type = 'ai';
    } else {
      this.selected_opponent_type = 'player';
    }
  }

  isSelectedOpponentType(type: string): string {
    return this.selected_opponent_type === type ? `selected ${type}` : type;
  }

  isOnePlayerGame(): boolean {
    return this.selected_opponent_type === 'ai'
  }

  /* Functions for side selection */

  getSideName(side: string): string {
    switch (side) {
      case 'goat':
        return 'La Chèvre';
      case 'harvest':
        return 'Le collecteur de choux';
      default:
        return 'Camp inconnue';
    }
  }

  selectSide(side: string) {
    this.player_side = side;
  }

  isSelectedSide(side: string): string {
    return this.player_side === side ? 'selected' : '';
  }

  /* Functions for the level selection */

  isSelectedLevel(level: string): string {
    return this.selected_level === level ? 'selected' : '';
  }

  /* Start game function */

    async startGame() {
    this.gameService.board_conf = this.selected_configuration;
    this.gameService.opponent_type = this.selected_opponent_type;
    this.gameService.player_side = this.player_side;
    const params = [this.param1, this.param2]
    this.gameService.board_params = params;
    this.gameService.graph = this.graphService.generateGraph(this.selected_configuration, params); 
    this.gameService._path_speed = this.path_speed;
    this.gameService.collect_speed = this.collect_speed;
    console.log("configuration choisie", this.selected_configuration)
    console.log("graphe choisi", this.gameService.graph)
    
    this.router.navigate(['/board'])
  }


}
