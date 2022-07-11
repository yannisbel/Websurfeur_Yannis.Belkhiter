import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WebSurfeur';
  toState = 'state1';

  changeState(state: any){
    this.toState = state;
  }
}
