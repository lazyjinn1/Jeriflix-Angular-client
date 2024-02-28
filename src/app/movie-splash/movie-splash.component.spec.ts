import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieSplashComponent } from './movie-splash.component';

describe('MovieSplashComponent', () => {
  let component: MovieSplashComponent;
  let fixture: ComponentFixture<MovieSplashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieSplashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovieSplashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
