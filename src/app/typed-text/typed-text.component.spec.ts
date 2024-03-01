import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypedTextComponent } from './typed-text.component';

describe('TypedTextComponent', () => {
  let component: TypedTextComponent;
  let fixture: ComponentFixture<TypedTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypedTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypedTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
