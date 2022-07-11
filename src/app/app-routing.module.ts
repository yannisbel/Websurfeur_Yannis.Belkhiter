import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { ConfigurationMenuComponent } from './components/configuration-menu/configuration-menu.component';
import { CreditComponent } from './components/credit/credit.component';
import { GameApplicationComponent } from './components/game-application/game-application.component';
import { GameModeMenuComponent } from './components/game-mode-menu/game-mode-menu.component';
import { GraphConstructorComponent } from './components/graph-constructor/graph-constructor.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'game-mode-selection'},
  {path: 'game-application', component: GameApplicationComponent},
  {path: 'configuration', component: ConfigurationMenuComponent},
  {path: 'game-mode-selection', component: GameModeMenuComponent},
  {path: 'board', component: BoardComponent},
  {path: 'graph-constructor', component: GraphConstructorComponent},
  {path: 'credit', component: CreditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
