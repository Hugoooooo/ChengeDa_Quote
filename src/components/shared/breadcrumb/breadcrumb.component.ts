import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { APPPATH } from 'src/app/app-sitemap.const';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: IBreadCrumb[];
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    });
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {

    let pathName = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';
    let parentPath = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.parent : '';

    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split('/').pop();``
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      pathName = route.snapshot.params[paramName];
    }
    const nextUrl = path ? `${url}/${path}` : url;
    const breadcrumb: IBreadCrumb = {
      label: pathName,
      url: nextUrl,
      isRedirect: url != `/${APPPATH.Main}`
    };

    // 同層帶入父層麵包屑 (編輯/新增等等..)
    let parentBreadcrumb: IBreadCrumb = null;
    if (parentPath) {
      const parentRoute = route.parent.routeConfig.children.find(p => p.path == parentPath);
      if (parentRoute) {
        parentBreadcrumb = {
          label: parentRoute.data.breadcrumb,
          url: `${url}/${parentPath}`,
          isRedirect: url != `/${APPPATH.Main}`
        };
        breadcrumbs.push(parentBreadcrumb);
      }
    }

    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }


}

export interface IBreadCrumb {
  label: string;
  url: string;
  isRedirect: boolean;
}
