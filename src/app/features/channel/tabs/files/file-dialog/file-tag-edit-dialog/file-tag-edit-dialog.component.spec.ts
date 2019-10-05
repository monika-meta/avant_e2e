import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTagEditDialogComponent } from './file-tag-edit-dialog.component';

describe('FileTagEditDialogComponent', () => {
  let component: FileTagEditDialogComponent;
  let fixture: ComponentFixture<FileTagEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTagEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTagEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
