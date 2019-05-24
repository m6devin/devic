import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerFormComponent } from './file-manager-form.component';

describe('FileManagerFormComponent', () => {
  let component: FileManagerFormComponent;
  let fixture: ComponentFixture<FileManagerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
