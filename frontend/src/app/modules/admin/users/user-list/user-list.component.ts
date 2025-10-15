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
import { ProfileEnum } from '../../../../../../api-client';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { UsersService } from '../services/users.service';
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
    UserStatusEnumPipe,
    RouterLink
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

  private readonly usersService = inject(UsersService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.listUsers(this.pageIndex, this.pageSize, this.form.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (users) => {
          this.users = users;
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
}
