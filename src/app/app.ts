// app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'frontend-projet'; // J'ai changé le signal en simple string si vous n'utilisez pas réellement un signal. Si vous voulez utiliser un signal, laissez, mais le code précédent utilisait `name = 'Angular';`
}
