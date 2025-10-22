import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private readonly toastr: ToastrService,
        private readonly router: Router,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((response) => {
                switch (response.status) {
                    case 400:
                        return this.Handle400(response);
                    case 401:
                        return this.Handle401(response);
                    case 403:
                        return this.Handle403(response);
                    case 404:
                        return this.Handle404(response);
                    default:
                        return this.Handle500(response);
                }
            })
        );
    }

    private async Handle400(response: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const errors: string[] = [];

            console.warn(response);
            if (
                response instanceof HttpErrorResponse &&
                response.error instanceof Blob &&
                response.error.type === 'application/problem+json'
            ) {
                try {
                    const errorResponse: any = await new Promise((resolve, reject) => {
                        let reader = new FileReader();
                        reader.onload = (e: Event) => {
                            resolve(JSON.parse((<any>e.target).result));
                        };
                        reader.onerror = reject;
                        reader.readAsText(response.error);
                    });

                    for (let parentKey in errorResponse.errors) {
                        for (let childKey in errorResponse.errors[parentKey]) {
                            errors.push(errorResponse.errors[parentKey][childKey]);
                        }
                    }
                    errors.push(errorResponse.detail)
                } catch (e) { }
            }

            if (errors.length) {
                for (let error of errors) {
                    console.warn(error);

                    this.toastr.error(error);
                }
            } else {
                this.toastr.error('Ocorreu um erro na sua requisição. Tente novamente mais tarde.');
            }

            reject(response);
        });
    }

    private async Handle401(response: any): Promise<any> {
        if (this.router.url.indexOf('sign-in') == -1) {
            return new Promise(async (resolve, reject) => {
                window.location.reload();
                reject(response);
            });
        }

        return new Promise(async (resolve, reject) => {
            reject(response);
        });
    }

    private async Handle403(response: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            this.toastr.error('Você não possui permissão para executar essa operação.');

            this.router.navigate(["/"])

            reject(response);
        });
    }

    private async Handle404(response: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            this.toastr.info('Não encontrado');

            reject(response);
        });
    }

    private async Handle500(response: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            this.toastr.error('Ocorreu um erro inesperado.')
            reject(response);
        });
    }
}
