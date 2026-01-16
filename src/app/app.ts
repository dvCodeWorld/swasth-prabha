import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaService } from './services/pwa.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('swasth-prabha');
  private pwaService = inject(PwaService);
}
