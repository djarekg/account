import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

function getDomSanitizer() {
  return inject(DomSanitizer);
}
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  licenseUrl = getDomSanitizer().bypassSecurityTrustResourceUrl(
    'https://github.com/angular/components/blob/main/LICENSE',
  );
}
