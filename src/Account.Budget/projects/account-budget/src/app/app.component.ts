import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    const bypassSecurityTrustResourceUrl = this.domSanitizer.bypassSecurityTrustResourceUrl;

    this.matIconRegistry.addSvgIcon(
      'github',
      bypassSecurityTrustResourceUrl('../assets/github-circle-white-transparent.svg'),
    );
    this.matIconRegistry.addSvgIcon('google', bypassSecurityTrustResourceUrl('../assets/google-brands.svg'));
    this.matIconRegistry.addSvgIcon('twitter', bypassSecurityTrustResourceUrl('../assets/twitter-brands.svg'));
    this.matIconRegistry.addSvgIcon('facebook', bypassSecurityTrustResourceUrl('../assets/facebook-f-brands.svg'));
  }
}
