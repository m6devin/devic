import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordTranslationFormComponent } from './word-translation-form.component';

describe('WordTranslationFormComponent', () => {
  let component: WordTranslationFormComponent;
  let fixture: ComponentFixture<WordTranslationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordTranslationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordTranslationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
