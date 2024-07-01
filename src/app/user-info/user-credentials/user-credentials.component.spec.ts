import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCredentialsComponent } from './user-credentials.component';

describe('UserCredentialsComponent', () => {
  let component: UserCredentialsComponent;
  let fixture: ComponentFixture<UserCredentialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCredentialsComponent]
    });
    fixture = TestBed.createComponent(UserCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
