import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { AuthClient, UpdateRegisterCommand } from '../../../../../api-client';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

export enum PeriodoEnum {
    Primeiro = 1,
    Segundo = 2,
    Terceiro = 3,
    Quarto = 4,
    Quinto = 5,
    Sexto = 6,
    Setimo = 7,
    Oitavo = 8,
    Nono = 9,
    Decimo = 10
}

@Component({
    selector: 'app-personal-data',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        TextFieldModule,
    ],
    templateUrl: './personal-data.component.html',
    styleUrl: './personal-data.component.scss'
})
export class PersonalDataComponent implements OnInit {
    PeriodoEnum = PeriodoEnum;
    personalDataForm!: FormGroup;
    loading = false;
    userId: number | null = null;

    periodos = [
        { value: PeriodoEnum.Primeiro, label: '1º Período' },
        { value: PeriodoEnum.Segundo, label: '2º Período' },
        { value: PeriodoEnum.Terceiro, label: '3º Período' },
        { value: PeriodoEnum.Quarto, label: '4º Período' },
        { value: PeriodoEnum.Quinto, label: '5º Período' },
        { value: PeriodoEnum.Sexto, label: '6º Período' },
        { value: PeriodoEnum.Setimo, label: '7º Período' },
        { value: PeriodoEnum.Oitavo, label: '8º Período' },
        { value: PeriodoEnum.Nono, label: '9º Período' },
        { value: PeriodoEnum.Decimo, label: '10º Período' },
    ];

    constructor(
        private readonly fb: FormBuilder,
        private readonly authClient: AuthClient,
        private readonly toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.personalDataForm = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3)]],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            periodo: [null, Validators.required],
            // Accept masked (000.000.000-00) or plain 11 digits while typing
            cpf: ['', [Validators.required, Validators.pattern(/^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/)]],
            matricula: ['', [
                Validators.required,
                this.matriculaValidator
            ]],
        });
        this.loading = true;
        this.authClient.getRegister()
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (res) => {
                    this.userId = res.id ?? null;
                    this.personalDataForm.patchValue({
                        nome: res.name ?? '',
                        email: res.email ?? '',
                        periodo: res.period ?? null,
                        cpf: this.maskCPF(res.cpf ?? ''),
                        matricula: res.enrollment != null ? String(res.enrollment).replace(/\D/g, '').slice(0, 9) : '',
                    });
                }
            });
    }

    private readonly matriculaValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const raw = String(control?.value ?? '');
        const digits = raw.replace(/\D/g, '');

        if (!digits) return null;

        if (digits.length !== 9) return { matriculaInvalida: true };

        const year = Number(digits.slice(0, 4));
        const seqStr = digits.slice(4);
        const seqNum = Number(seqStr);

        const currentYear = new Date().getFullYear();
        const yearOk = Number.isInteger(year) && year >= 1950 && year <= currentYear;
        const seqOk = /^\d{5}$/.test(seqStr) && seqNum >= 1 && seqNum <= 99999;

        return (yearOk && seqOk) ? null : { matriculaInvalida: true };
    };

    get fc() {
        return this.personalDataForm.controls as {
            nome: FormControl<string | null>;
            email: FormControl<string | null>;
            periodo: FormControl<PeriodoEnum | null>;
            cpf: FormControl<string | null>;
            matricula: FormControl<string | null>;
        };
    }

    formatCPF(event: any): void {
        const raw = String(event?.target?.value ?? '');
        const inputType = String((event as any)?.inputType ?? '').toLowerCase();
        let digits = raw.replace(/\D/g, '').slice(0, 11);

        // When deleting, do not re-apply mask so backspace can clear smoothly
        if (inputType.startsWith('delete')) {
            this.fc.cpf.setValue(digits, { emitEvent: false });
            return;
        }

        // While typing, apply a non-intrusive progressive mask
        const masked = this.maskCPFPartial(digits);
        this.fc.cpf.setValue(masked, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.personalDataForm.invalid || this.userId == null) {
            this.personalDataForm.markAllAsTouched();
            return;
        }

        const formData = this.personalDataForm.getRawValue();
        const matriculaDigits = String(formData.matricula ?? '').replace(/\D/g, '').slice(0, 9);
        const command = new UpdateRegisterCommand({
            name: formData.nome ?? '',
            period: Number(formData.periodo),
            cpf: String(formData.cpf ?? '').replace(/\D/g, ''),
            enrollment: matriculaDigits ? Number(matriculaDigits) : undefined,
        });

        this.loading = true;
        this.authClient.updateRegister(this.userId!, command)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (res) => {
                    this.toastr.success('Dados atualizados com sucesso');
                    this.personalDataForm.patchValue({
                        nome: res.name ?? formData.nome,
                        email: res.email ?? formData.email,
                        periodo: res.period ?? formData.periodo,
                        cpf: this.maskCPF(res.cpf ?? String(formData.cpf).replace(/\D/g, '')),
                        // Ensure matricula stays digits-only even if backend/localization adds separators
                        matricula: res.enrollment != null
                            ? String(res.enrollment).replace(/\D/g, '').slice(0, 9)
                            : formData.matricula,
                    });
                }
            });
    }

    onCancel(): void {
        window.history.back();
    }

    private maskCPF(value: string): string {
        const digits = (value || '').replace(/\D/g, '').slice(0, 11);
        if (!digits) return '';
        return this.maskCPFPartial(digits, false);
    }

    // Builds a progressive CPF mask; avoids dangling separators
    private maskCPFPartial(digits: string, forceFull: boolean = false): string {
        let out = '';
        const n = Math.min(digits.length, 11);
        for (let i = 0; i < n; i++) {
            out += digits[i];
            if (i === 2 && (forceFull ? true : n > 3)) out += '.';
            else if (i === 5 && (forceFull ? true : n > 6)) out += '.';
            else if (i === 8 && (forceFull ? true : n > 9)) out += '-';
        }
        return out;
    }

    onCpfBlur(): void {
        // On blur, enforce full mask formatting
        const raw = String(this.fc.cpf.value ?? '');
        const masked = this.maskCPF(raw);
        this.fc.cpf.setValue(masked, { emitEvent: false });
    }

    formatMatricula(event: any): void {
        const raw = String(event?.target?.value ?? '');
        const onlyDigits = raw.replace(/\D/g, '').slice(0, 9);
        this.fc.matricula.setValue(onlyDigits, { emitEvent: false });
    }
}
