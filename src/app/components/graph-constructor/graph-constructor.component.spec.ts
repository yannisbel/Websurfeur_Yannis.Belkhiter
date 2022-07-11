import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphConstructorComponent } from './graph-constructor.component';

describe('GraphConstructorComponent', () => {
  let component: GraphConstructorComponent;
  let fixture: ComponentFixture<GraphConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphConstructorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
