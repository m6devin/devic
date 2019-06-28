import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordDetailsPanelComponent } from './word-details-panel.component';

describe('WordDetailsPanelComponent', () => {
  let component: WordDetailsPanelComponent;
  let fixture: ComponentFixture<WordDetailsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordDetailsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
