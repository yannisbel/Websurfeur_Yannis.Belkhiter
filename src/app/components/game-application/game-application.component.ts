import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GameService } from 'src/app/services/game/game.service';
import { Router } from '@angular/router';
import { Injectable, Pipe } from '@angular/core';
import Swal from 'sweetalert2';

const YOUTUBE_URL = 'https://www.youtube.com/embed/';

@Component({
  selector: 'app-game-application',
  templateUrl: './game-application.component.html',
  styleUrls: ['./game-application.component.scss']
})
export class GameApplicationComponent implements OnInit {

  constructor(private gameService: GameService, public sanitizer: DomSanitizer, private router: Router) { }

  title = 'demo'
  id = 'EsECAdYGA1w?start=116'

  getSafeUrl(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(YOUTUBE_URL + this.id);
  }


  ngOnInit(): void {
  }

  displayRules() {
    this.gameService.displayRules()
  }

  goBack() {
    this.router.navigate(['/game-mode-selection'])
  }

  private collector_color = '#4dc738';
  private goat_color = '#b56528';

  private getGoalsHtml() {
    return `<p>Ce jeu a été designé dans un objectif de médiation scientifique. Il fait part des travaux de recherche de <strong>Fedor V. Fomin, Frédéric Giroire, Alain Jean-Marie, Dorian Mazauric, et Nicolas Nisse</strong> sur le problème du préchargement de données sur des graphes. </p>
    <br/>
    <p>Ce jeu met donc en scène deux acteurs : </p>
    <p> - <span style='color: ${this.goat_color}'>la chèvre</span>, qui représente l'utilisateur de l'outil informatique qui consulte son navigateur internet,</p>
    <p> - <span style='color: ${this.collector_color}'>le collecteur de choux</span>, qui représente l'algorithme de préchargement des pages web. Chaque choux représente une page web, et à chaque fois que l'on ramasse un choux, la page web représentée par le choux est chargée.</p>
    <br/>
    <p>Le but de <span style='color: ${this.goat_color}'>la chèvre</span> est de manger un des choux présent sur le plateau de jeu. S'il s'avère que la chèvre gagne, c'est à dire qu'elle puisse manger un choux, cela signifierait alors que l'utilisateur rencontrerait une page web non-préchargée. Alors, le navigateur plante et l'utilisateur s'impatiente...</p>
    <p>Le but <span style='color: ${this.collector_color}'>du collecteur de choux</span> est de récolter tous les choux présents sur le plateau de jeu avant que la chèvre ne puisse en manger un. Si tel est le cas, cela signifie que chaque page web a bien été préchargée avant que l'utilisateur n'y accède. Le navigateur web ne plante pas et l'utilisateur ne s'impatiente pas.</p>`;
  }

  displayGoals() {
    Swal.fire({
      icon: 'info',
      html: this.getGoalsHtml()
    })
  }

}
