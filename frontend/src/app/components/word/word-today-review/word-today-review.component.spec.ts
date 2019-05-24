import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordTodayReviewComponent } from './word-today-review.component';

describe('WordTodayReviewComponent', () => {
  let component: WordTodayReviewComponent;
  let fixture: ComponentFixture<WordTodayReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordTodayReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordTodayReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
