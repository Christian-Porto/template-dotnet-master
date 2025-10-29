import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
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
    ) {}

    ngOnInit(): void {
        this.personalDataForm = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3)]],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            periodo: [null, Validators.required],
            cpf: ['', [Validators.required, Validators.pattern(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/)]],
            matricula: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
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
                        matricula: res.enrollment != null ? String(res.enrollment) : '',
                    });
                }
            });
    }

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
        let value = event.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        if (value.length >= 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
        } else if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
        }

        this.fc.cpf.setValue(value, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.personalDataForm.invalid || this.userId == null) {
            this.personalDataForm.markAllAsTouched();
            return;
        }

        const formData = this.personalDataForm.getRawValue();
        const command = new UpdateRegisterCommand({
            name: formData.nome ?? '',
            period: Number(formData.periodo),
            cpf: String(formData.cpf ?? '').replace(/\D/g, ''),
            enrollment: formData.matricula ? Number(formData.matricula) : undefined,
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
                        matricula: res.enrollment != null ? String(res.enrollment) : formData.matricula,
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
        return digits
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
}
