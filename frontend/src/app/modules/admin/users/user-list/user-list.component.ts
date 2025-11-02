import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { AuthClient, ProfileEnum, Status } from '../../../../../../api-client';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { PaginatedListOfUserResponse, UserStatusEnum } from '../models/user.model';
import { ProfileEnumPipe } from '../pipes/profile-enum.pipe';
import { UserStatusEnumPipe } from '../pipes/user-status-enum.pipe';

@Component({
  selector: 'app-user-list',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatTableModule,
    MatSnackBarModule,
    MatDividerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatSidenavModule,
    MatDialogModule,
    MatLuxonDateModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    ProfileEnumPipe,
    UserStatusEnumPipe
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  pageIndex: number = 0;
  pageSize: number = 25;

  loading: boolean = false;

  users: PaginatedListOfUserResponse | null = null;

  displayedColumns: string[] = ['name', 'enrollment', 'profile', 'status', 'actions'];

  form: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    enrollment: new FormControl<string>(''),
    status: new FormControl<UserStatusEnum | null>(null),
    profile: new FormControl<ProfileEnum | null>(null),
  });

  UserStatusEnum = UserStatusEnum;
  ProfileEnum = ProfileEnum;

  private readonly authClient = inject(AuthClient);

  ngOnInit(): void {
    this.loadUsers();

    // Reload on filter changes with a small debounce
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pageIndex = 0; // reset pagination on filter change
        this.loadUsers();
      });
  }

  loadUsers(): void {
    this.loading = true;
    const formValue = this.form.value as any;

    const name: string | null = formValue?.name ?? null;
    const enrollment: number | null = formValue?.enrollment ? Number(formValue.enrollment) : null;
    const profile: ProfileEnum | null = formValue?.profile ?? null;
    const statusFilter: Status | null = this.mapUserStatusEnumToApiStatus(formValue?.status);

    this.authClient
      .listUsers(name, enrollment, profile, statusFilter, this.pageSize, this.pageIndex)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (apiPage) => {
          this.users = this.mapApiPageToLocal(apiPage);
        }
      });
  }

  pageEvent(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    window.scrollTo(0, 0);

    this.loadUsers();
  }

  makeMonitor(userId: number): void {

  }

  toggleStatus(userId: number, newStatus: UserStatusEnum): void {

  }

  private mapUserStatusEnumToApiStatus(status: UserStatusEnum | null): Status | null {
    if (status === null || status === undefined) return null;
    // Local enum: Active=1, Inactive=2; API enum: Inactive=0, Active=1
    switch (status) {
      case UserStatusEnum.Active:
        return Status.Active;
      case UserStatusEnum.Inactive:
        return Status.Inactive;
      default:
        return null;
    }
  }

  private mapApiPageToLocal(apiPage: any): PaginatedListOfUserResponse {
    return {
      totalPages: apiPage?.totalPages ?? 0,
      totalCount: apiPage?.totalCount ?? 0,
      pageIndex: apiPage?.pageIndex ?? this.pageIndex,
      hasNextPage: apiPage?.hasNextPage ?? false,
      hasPreviousPage: apiPage?.hasPreviousPage ?? false,
      items: (apiPage?.items ?? []).map((u: any) => ({
        // API does not provide id/email in list; keep placeholders
        id: 0,
        name: u?.name ?? '',
        enrollment: (u?.enrollment ?? '').toString(),
        email: undefined,
        profile: u?.profile as ProfileEnum,
        status: this.mapApiStatusToUserStatusEnum(u?.status as Status)
      }))
    } as PaginatedListOfUserResponse;
  }

  private mapApiStatusToUserStatusEnum(status: Status | null | undefined): UserStatusEnum {
    if (status === Status.Active) return UserStatusEnum.Active;
    if (status === Status.Inactive) return UserStatusEnum.Inactive;
    return UserStatusEnum.Active;
  }
}
