import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleTranslatorRenderComponent } from './google-translator-render.component';

describe('GoogleTranslatorRenderComponent', () => {
  let component: GoogleTranslatorRenderComponent;
  let fixture: ComponentFixture<GoogleTranslatorRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleTranslatorRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleTranslatorRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
