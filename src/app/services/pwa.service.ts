import { Injectable, ApplicationRef, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, first, interval, concat } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private swUpdate = inject(SwUpdate);
  private appRef = inject(ApplicationRef);

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.checkForUpdates();
      this.handleUpdates();
    }
  }

  private checkForUpdates(): void {
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });
  }

  private handleUpdates(): void {
    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe((evt) => {
        if (this.promptUser()) {
          this.swUpdate.activateUpdate().then(() => document.location.reload());
        }
      });

    this.swUpdate.unrecoverable.subscribe((event) => {
      console.error('An unrecoverable error occurred:', event.reason);
      if (confirm('An error occurred that we cannot recover from. Reload the application?')) {
        document.location.reload();
      }
    });
  }

  private promptUser(): boolean {
    return confirm('A new version of the application is available. Load the new version?');
  }

  checkForUpdate(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
    }
  }
}
