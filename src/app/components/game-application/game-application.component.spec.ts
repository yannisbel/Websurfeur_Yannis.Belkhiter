import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameApplicationComponent } from './game-application.component';

describe('GameApplicationComponent', () => {
  let component: GameApplicationComponent;
  let fixture: ComponentFixture<GameApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
