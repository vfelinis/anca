import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../store';
import { UserState } from '../store/User';
import { UserService } from '../services/user/user.service';


@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
    private user: UserState;
    private userService: UserService;
    constructor(private store: Store<ApplicationState>, private inj: Injector) {
        this.store.subscribe(s => this.user = s.userState);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
            const clone = req.clone({ setHeaders: {'Authorization': `Bearer ${this.user.token}`} });
            return next.handle(clone).do(
                success => {},
                (error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        const userService = this.inj.get(UserService);
                        userService.unauthorized();
                    }
                }
            );
        }
        return next.handle(req);
    }
}
