import { API_CONFIG } from './../config/api.config';
import { StorageService } from './../services/storage.service';
import { Observable } from "rxjs"
import { HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const localUser = this.storage.getLocalUser();

        if (localUser && this.isRequestToApi(req)) {
            const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + localUser.token) });
            return next.handle(authReq);
        } else {
            return next.handle(req);
        }
    }

    isRequestToApi(req: HttpRequest<any>) : Boolean {
        const baseUrlLength = API_CONFIG.baseUrl.length;

        return req.url.substring(0, baseUrlLength) == API_CONFIG.baseUrl;
    }
}

export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
}
