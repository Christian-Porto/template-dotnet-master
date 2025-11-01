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
        // If not on sign-in page, navigate there instead of reloading
        if (this.router.url.indexOf('sign-in') === -1) {
            return new Promise(async (resolve, reject) => {
                try {
                    const currentUrl = encodeURIComponent(this.router.url || '/');
                    this.router.navigateByUrl(`/sign-in?redirectURL=${currentUrl}`);
                } catch {
                    // Ignore navigation errors
                }
                reject(response);
            });
        }

        return new Promise(async (resolve, reject) => {
            // On sign-in page, just propagate the error so the component can show feedback
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
            let messageToShow: string | undefined;

            if (response instanceof HttpErrorResponse) {
                // Case 1: Blob containing problem+json
                if (
                    response.error instanceof Blob &&
                    (response.error.type === 'application/problem+json' || response.error.type === 'application/json')
                ) {
                    try {
                        const errorResponse: any = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (e: Event) => {
                                try {
                                    resolve(JSON.parse((e as any).target.result));
                                } catch {
                                    resolve(null);
                                }
                            };
                            reader.onerror = reject;
                            reader.readAsText(response.error);
                        });
                        messageToShow = errorResponse?.detail || errorResponse?.title;
                    } catch { /* ignore */ }
                }

                // Case 2: Already parsed object (Angular parsed JSON)
                if (!messageToShow && response.error && typeof response.error === 'object') {
                    messageToShow = response.error.detail || response.error.title || undefined;
                }

                // Case 3: Raw string error
                if (!messageToShow && typeof response.error === 'string') {
                    try {
                        const parsed = JSON.parse(response.error);
                        messageToShow = parsed?.detail || parsed?.title || undefined;
                    } catch {
                        messageToShow = response.error;
                    }
                }

                // Friendly mapping for duplicate CPF unique constraint
                if (messageToShow && /Duplicate entry/i.test(messageToShow) && /IX_Users_Cpf/i.test(messageToShow)) {
                    messageToShow = 'CPF já cadastrado para outro usuário.';
                }
            }

            // Friendly mapping for duplicate Enrollment (Matrícula) unique constraint
            if (messageToShow && /Duplicate entry/i.test(messageToShow) && /IX_Users_Enrollment/i.test(messageToShow)) {
                messageToShow = 'Matrícula já cadastrada para outro usuário.';
            }

            // Normalize CPF duplicate message accents if needed
            if (messageToShow && /CPF j. cadastrado para outro usu.rio\./i.test(messageToShow)) {
                messageToShow = 'CPF já cadastrado para outro usuário.';
            }

            this.toastr.error(messageToShow || 'Ocorreu um erro inesperado.')
            reject(response);
        });
    }
}
