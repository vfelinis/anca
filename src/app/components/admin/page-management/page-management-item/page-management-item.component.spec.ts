import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageManagementItemComponent } from './page-management-item.component';

describe('PageManagementItemComponent', () => {
  let component: PageManagementItemComponent;
  let fixture: ComponentFixture<PageManagementItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageManagementItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageManagementItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
