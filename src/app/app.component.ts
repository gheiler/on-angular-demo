import { Component, OnInit } from '@angular/core';
import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as log from 'loglevel';
import { User } from './appcommon/models/user';
import { routerTransition } from './components/animations/router.animations';


@Component({
  selector: 'app-root',
  animations: [ routerTransition ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private rolesService: NgxRolesService, private permsService: NgxPermissionsService,
    private http: HttpClient) {}

  ngOnInit(): void {
    log.setLevel(environment.LOG_LEVEL);
    log.setDefaultLevel(environment.LOG_LEVEL);

    this.http.get('api/userInfo').subscribe((user: User) => {
      for (const role in user.roles) {
        if (user.roles.hasOwnProperty(role)) {
          const permissions = user.roles[role];
          permissions.forEach( (perm) => {
            this.permsService.addPermission(perm);
          });
          this.rolesService.addRole(role, permissions);
        }
      }
    });
  }
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}