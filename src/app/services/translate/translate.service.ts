import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor() { }

  graphTypeName(type: string): string {
    switch (type) {
      case 'grid':
        return 'Grille';
      case 'cycle':
        return 'Cycle'
      case 'tree':
        return 'Arbre';
      case 'rope':
        return 'Cordaux';
      case 'random':
        return 'Aléatoire';
      case 'tore':
        return 'Grille torique';
      case 'petersen':
        return 'Petersen';
      case 'dodecahedron':
        return 'Dodécahédron'
      default:
        return '';
    }
  }

  opponentTypeName(type: string): string {
    switch (type) {
      case 'ai':
        return 'Jouer contre un ordinateur';
      case 'player':
        return 'Jouer à 2 joueurs';
      default:
        return '';
    }
  }

  graphConstructorToolsName(tool: string) {
    switch (tool) {
      case 'add-node':
        return 'Ajouter un sommet';
      case 'add-link':
        return 'Ajouter une arrête';
      case 'remove':
        return 'Effacer un élément';
      case 'save':
        return 'Enregistrer';
      case 'move':
        return 'Déplacer un sommet';
      default:
        return '';
    }
  }

}
