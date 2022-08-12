import { TitleService } from '@account-budget/services';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

function getDomSanitizer(): DomSanitizer {
  return inject(DomSanitizer);
}

function getTitleService(): TitleService {
  return inject(TitleService);
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  githubUrl = getDomSanitizer().bypassSecurityTrustUrl('https://github.com/djarekg/account');
  title$ = getTitleService().title$;
}
