import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Adventure } from 'src/app/models/Adventure/adventure';
import { ADVENTURES } from 'src/app/models/Adventure/adventures.mock';
import { Mode } from 'src/app/models/Adventure/mode';
import Swal from 'sweetalert2';
import { GameService } from '../game/game.service';
import { GraphService } from '../graph/graph.service';

@Injectable({
  providedIn: 'root'
})
export class AdventureService {

  private adventures: Adventure[] = ADVENTURES;
  private currentAdventure: Adventure = null;

  constructor(private router: Router,
    private gameService: GameService,
    private graphService: GraphService) {}

  getAvailableAdventures() { return this.adventures; }

  launchAdventure(adventure: Adventure) {
    this.currentAdventure = adventure;
    this.currentAdventure.reset();
    this.gameService.setAdventure(this.currentAdventure)
    this.gameService.setEndLevelCallback(this.launchNextLevel.bind(this));
    this.launchNextLevel();
  }

  async launchNextLevel() {
    const extras = await this.configureAdventureNextLevel(this.currentAdventure)
    
    /* this.currentAdventure.goToNextLevel(); */
    if(extras) {
      const role = this.getLevelPlayerRole();
      const mes = `Dans ce niveau vous jouerez le role du camp ${role}. <br>Le collecteur de choux récolte ${this.currentAdventure.getCurrentLevel().getCollectSpeed()} choux par tours`

      Swal.fire({
        html: mes
      })
      this.router.navigate(['/board'], extras);
      return false;
    } else {
      this.router.navigate(['/adventure-menu']);
      return true;
    }
  }

  private async configureAdventureNextLevel(adventure: Adventure): Promise<NavigationExtras> {
    const level = this.currentAdventure.getCurrentLevel();
    let extras: NavigationExtras = undefined;
    if(level !== undefined) {
      await this.graphService.generateGraph(level.getGraphType(), level.getGraphParams());
      this.gameService.setOpponentType('ai');
      this.gameService.setCollect_speed(level.getCollectSpeed());
      this.gameService.setAiSide(level.getAiSide());
      extras = {
        queryParams: {
          gameMode: level.getDifficulty(),
          adventure: true
        }
      }
      return extras;
    }
  }

  getAdventureMode(): Mode {
    return this.currentAdventure.getMode();
  }

  getCurrentLevelMediation() {
    return this.currentAdventure.getMediationInfo();
  }

  getLevelPlayerRole() {
    return this.currentAdventure.getCurrentLevel().getPlayerRoleName()
  }

  async goToNextLevel() {
    const res = await this.currentAdventure.goToNextLevel();
    if(res) {
      this.router.navigate(['/adventure-menu']);
    } else {
      return true
    }
  }
}
