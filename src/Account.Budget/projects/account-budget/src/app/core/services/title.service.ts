import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

const DEFAULT_TITLE = 'My Budget';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private title = new BehaviorSubject('');
  title$ = this.title.asObservable();

  constructor(private route: ActivatedRoute, private router: Router, private titleStrategy: Title) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const activatedRoute = this.getChild(this.route);

      activatedRoute.data.subscribe(data => {
        this.title.next(data['title'] ?? DEFAULT_TITLE);
      });
    });
  }

  private getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    return activatedRoute.firstChild ? this.getChild(activatedRoute.firstChild) : activatedRoute;
  }
}
