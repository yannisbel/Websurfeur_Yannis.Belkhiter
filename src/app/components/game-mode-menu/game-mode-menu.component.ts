import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-game-mode-menu',
  templateUrl: './game-mode-menu.component.html',
  styleUrls: ['./game-mode-menu.component.scss']
})
export class GameModeMenuComponent implements OnInit {

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
  }

  displayRules() {
    this.gameService.displayRules()
  }

  jeuLibre() {
    this.router.navigate(['/configuration']),
    this.displayRules()
  }

}
