import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteFormPage } from './cliente-form-page';

describe('ClienteFormPage', () => {
  let component: ClienteFormPage;
  let fixture: ComponentFixture<ClienteFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteFormPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
