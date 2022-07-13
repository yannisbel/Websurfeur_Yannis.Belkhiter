import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Adventure } from 'src/app/models/Adventure/adventure';
import { ADVENTURES } from 'src/app/models/Adventure/adventures.mock';
import { AdventureService } from 'src/app/services/Adventure/adventure.service';
import { GameService } from 'src/app/services/game/game.service';
import { GraphService } from 'src/app/services/graph/graph.service';

@Component({
  selector: 'app-adventure-menu',
  templateUrl: './adventure-menu.component.html',
  styleUrls: ['./adventure-menu.component.scss']
})
export class AdventureMenuComponent implements OnInit {

  public adventures = this.adventureService.getAvailableAdventures();
  public selected_adventure: Adventure = null;

  constructor(private router: Router,
    private adventureService: AdventureService) { }

  ngOnInit(): void {
    this.selected_adventure = this.adventures[0]
  }

  selectAdventure(adventure) {
    this.selected_adventure = adventure;
  }

  isSelected(adventure) {
    return this.selected_adventure === adventure ? 'selected' : ''
  }

  launchAdventure() {
    this.adventureService.launchAdventure(this.selected_adventure);
  }

  goBack() {
    this.router.navigate(['/game-mode-selection'])
  }

}
