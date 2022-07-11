import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver'

@Injectable({
  providedIn: 'root'
})
export class GraphConstructorService {

  readonly tools = ['add-node', 'add-link', 'remove', 'move'];
  readonly originalNodeColor = '#69b3a2';
  readonly selectedNodeColor = 'red'
  private graphTypes = {
    tree: 'Arbre',
    cycle: 'Cycle',
    grid: 'Grille',
    tore: 'Grille Torique',
    specific: 'Conserver position des noeuds',
    random: 'Autre',
  }

  // {index: , x: , y: }
  private nodes = [];

  // {index: ,source: , target: } with index as the postion in the array, source the source node and target the target node
  private links = [];

  constructor() { }

  enterFilename(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      Swal.fire({
        title: 'Enregistrer sous...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        input: 'text',
        inputLabel: 'Nom du  fichier',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!'
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(result.value)
        }
      })
    })
  }

  async selectGraphType(): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Type du graphes',
      input: 'select',
      inputOptions: this.graphTypes,
      showCancelButton: true,
      cancelButtonText: 'Annuler'
    })

    if (result.isConfirmed === true) {
      console.log('HERE', result.value)
      let args: number[] = [];
      switch (result.value) {
        case 'grid':
        case 'tore':
          args = await this.selectGridProperties();
          break;
        case 'tree':
          args = await this.selectTreeProperty();
          break;
        default:
          break;
      }
      return this.save(result.value, args);
    }
  }

  private async selectGridProperties(): Promise<number[]> {
    let res: number[] = [];
    const resultSwal = await Swal.fire({
      title: 'Définir les propriétés de la grille',
      html: '<label>Longueur : </label><input id="swal-input1" class="swal2-input" type="number" min="3" value="3" /><br>'
        + '<label>Largeur : </label><input id="swal-input2" class="swal2-input"  type="number" min="3" value="3"/>',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value
        ]
      }
    })
    //console.log(resultSwal)
    resultSwal.value.forEach(n => {
      res.push(+n)
    })
    return res
  }

  private async selectTreeProperty(): Promise<number[]> {
    let res: number[] = [];
    const resultSwal = await Swal.fire({
      title: 'Définir l\'arité de l\'arbre',
      input: 'number',
      inputValue: 2,
      allowOutsideClick: false,
      allowEscapeKey: false,
    })
    //console.log(resultSwal);
    res.push(+resultSwal.value)
    return res;
  }

  toolAction(tool: string, source: any, target = undefined) {
    switch (tool) {
      case 'add-node':
        this.addNode(source.x, source.y);
        break;
      case 'add-link':
        this.addLink(source, target)
        break;
      case 'remove':
        if (target === undefined) {
          // Trying to remove a node
          this.removeNode(source.x, source.y)
        } else {
          // Trying to remove a link
          this.removeLink(source, target)
        }
        break;
      case 'move':
        this.moveNode(source, target)
        break;
      default:
        break;
    }
  }

  save(type: string = '', args: number[] = []): Promise<boolean> { // Penser à retirer les paramètres inutiles (type et args)
    return new Promise((resolve) => {
      this.enterFilename().then((filename) => {
        if (filename) {
          const graphJson = this.convertGraphToJsonFile(type, args);
          //console.log('JSON GRAPH', graphJson);
          const blobGraphFromJson = new Blob([graphJson], { type: 'application/json' });
          //console.log('JSON BLOB', blobGraphFromJson);
          saveAs(blobGraphFromJson, `${filename}.json`);
          resolve(true);
        }
      })
    })

  }

  private convertGraphToJsonFile(type: string = '', args: number[] = []) {
    this.nodes.forEach((node, i) => { node['index'] = i });
    const jsonLinks = [];
    this.links.forEach((link) => {
      jsonLinks.push({
        source: this.foundNodeIndex(link.source),
        target: this.foundNodeIndex(link.target)
      })
    })
    let graphJson = {
      typology: 'specific',
      nodes: this.nodes,
      links: jsonLinks,
    }
    /* switch (type) {
      case 'grid':
      case 'tore':
        graphJson['width'] = args[0];
        graphJson['height'] = args[1];
        break;
      case 'tree':
        graphJson['arity'] = args[0];
      default:
        break;
    } */
    return JSON.stringify(graphJson, null, 2)
  }

  private foundNodeIndex(nodePosition) {
    return this.nodes.findIndex(node => node.x === nodePosition.x && node.y === nodePosition.y)
  }

  private addNode(x, y) {
    const node = { x: x, y: y };
    this.nodes.push(node);
  }

  private addLink(source, target) {
    const link = { source: source, target: target };
    this.links.push(link);
  }

  private removeNode(x, y) {
    this.nodes = this.nodes.filter(node => node.x !== x || node.y !== y);
  }

  private removeLink(source, target) {
    this.links = this.links.filter(link => !this.checkCirclePosition(link.source, source) || !this.checkCirclePosition(link.target, target))
  }

  private moveNode(movingCircle, endPosition) {
    /* console.log('MOVING CIRCLE', movingCircle);
    console.log('TO', endPosition); */
    const nodeIndex = this.nodes.findIndex(node => node.x === movingCircle.x && node.y === movingCircle.y)
    this.nodes[nodeIndex].x = endPosition.x
    this.nodes[nodeIndex].y = endPosition.y

    this.links.forEach(link => {
      if (this.checkCirclePosition(link.source, movingCircle)) {
        link.source.x = endPosition.x;
        link.source.y = endPosition.y;
      } else if (this.checkCirclePosition(link.target, movingCircle)) {
        link.target.x = endPosition.x;
        link.target.y = endPosition.y;
      }
    })
  }

  /**
   * 
   * @param c1 the position of the first circle
   * @param c2 the position of the second circle
   * 
   * @return true if the circle are at the same position. Otherwise return false
   */
  private checkCirclePosition(c1, c2) {
    return c1.x === c2.x && c1.y === c2.y
  }

  reset() {
    this.nodes = [];
    this.links = [];
  }
}
