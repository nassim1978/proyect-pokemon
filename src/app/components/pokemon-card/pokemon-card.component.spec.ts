import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonCardComponent } from './pokemon-card.component';
import { MatCardModule } from '@angular/material/card';
import { PokemonService } from '../../services/pokemon.service';
describe('PokemonCardComponent', () => {
  let component: PokemonCardComponent;
  let fixture: ComponentFixture<PokemonCardComponent>;

  beforeEach(async () => {
    const mockPokemonService = jasmine.createSpyObj('PokemonService', [
      'getPokemonList',
    ]);

    await TestBed.configureTestingModule({
      declarations: [PokemonCardComponent],
      providers: [{ provide: PokemonService, useValue: mockPokemonService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
