import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { saveAs } from 'file-saver';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigurationMenuComponent } from './components/configuration-menu/configuration-menu.component';
import { GameModeMenuComponent } from './components/game-mode-menu/game-mode-menu.component';
import { GameService } from './services/game/game.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditComponent } from './components/credit/credit.component';
import { BoardComponent } from './components/board/board.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslateService } from './services/translate/translate.service';
import { GraphService } from './services/graph/graph.service';
import { GraphConstructorComponent } from './components/graph-constructor/graph-constructor.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationMenuComponent,
    GameModeMenuComponent,
    BoardComponent,
    CreditComponent,
    GraphConstructorComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    GameService,
    GraphService,
    TranslateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
