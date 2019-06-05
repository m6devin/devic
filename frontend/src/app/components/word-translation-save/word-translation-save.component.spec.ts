import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordTranslationSaveComponent } from './word-translation-save.component';

describe('WordTranslationSaveComponent', () => {
  let component: WordTranslationSaveComponent;
  let fixture: ComponentFixture<WordTranslationSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordTranslationSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordTranslationSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
