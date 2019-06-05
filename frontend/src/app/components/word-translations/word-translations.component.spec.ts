import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordTranslationsComponent } from './word-translations.component';

describe('WordTranslationsComponent', () => {
  let component: WordTranslationsComponent;
  let fixture: ComponentFixture<WordTranslationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordTranslationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
