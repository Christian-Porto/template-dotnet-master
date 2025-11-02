import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
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
import { Subject, debounceTime, distinctUntilChanged, finalize, takeUntil, filter } from 'rxjs';
import { PaginatedListOfUserResponse, UserStatusEnum } from '../models/user.model';
import { ProfileEnumPipe } from '../pipes/profile-enum.pipe';
import { UserStatusEnumPipe } from '../pipes/user-status-enum.pipe';

@Component({
  selector: 'app-user-list',
  imports: [
    CdkScrollable,
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
export class UserListComponent implements AfterViewInit {
  @ViewChild(CdkScrollable) scrollable!: CdkScrollable;

  pageIndex: number = 0; // zero-based for this API
  pageSize: number = 25;

  // loading: used for initial/reset loads; isLoadingMore: used for infinite scroll appends
  loading: boolean = false;
  isLoadingMore: boolean = false;
  hasMoreData: boolean = true;

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
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.resetAndLoadUsers();

    // Reload on filter changes with a small debounce
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.resetAndLoadUsers();
      });
  }

  ngAfterViewInit(): void {
    // Setup infinite scroll listener
    this.scrollable
      .elementScrolled()
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(200),
        filter(() => !this.isLoadingMore && this.hasMoreData && !this.loading)
      )
      .subscribe(() => this.checkScrollPosition());
  }

  private checkScrollPosition(): void {
    const element = this.scrollable.getElementRef().nativeElement as HTMLElement;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;

    // Load more when user is within 300px of the bottom
    if (scrollHeight - scrollPosition < 300) {
      this.loadMoreUsers();
    }
  }

  private resetAndLoadUsers(): void {
    this.pageIndex = 0;
    this.hasMoreData = true;
    this.users = {
      totalPages: 0,
      totalCount: 0,
      pageIndex: 0,
      hasNextPage: true,
      hasPreviousPage: false,
      items: []
    } as PaginatedListOfUserResponse;
    this.loading = true;
    this.loadMoreUsers();
  }

  private loadMoreUsers(): void {
    if (this.isLoadingMore || !this.hasMoreData) return;

    this.isLoadingMore = true;
    const formValue = this.form.value as any;

    const name: string | null = formValue?.name ?? null;
    const enrollment: number | null = formValue?.enrollment ? Number(formValue.enrollment) : null;
    const profile: ProfileEnum | null = formValue?.profile ?? null;
    const statusFilter: Status | null = this.mapUserStatusEnumToApiStatus(formValue?.status);

    this.authClient
      .listUsers(name, enrollment, profile, statusFilter, this.pageSize, this.pageIndex)
      .subscribe({
        next: (apiPage) => {
          const mapped = this.mapApiPageToLocal(apiPage);

          // Determine if there is more data
          if (!mapped?.items?.length || mapped.items.length < this.pageSize || !mapped.hasNextPage) {
            this.hasMoreData = false;
          }

          if (!this.users) {
            this.users = mapped;
          } else {
            this.users.items = [...(this.users.items || []), ...(mapped.items || [])];
            this.users.totalCount = mapped.totalCount ?? this.users.totalCount;
            this.users.totalPages = mapped.totalPages ?? this.users.totalPages;
            this.users.pageIndex = mapped.pageIndex ?? this.users.pageIndex;
            this.users.hasNextPage = mapped.hasNextPage;
            this.users.hasPreviousPage = mapped.hasPreviousPage;
          }

          this.pageIndex++;
          this.isLoadingMore = false;
          this.loading = false;
        },
        error: () => {
          this.isLoadingMore = false;
          this.loading = false;
          this.hasMoreData = false;
        }
      });
  }

  pageEvent(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    window.scrollTo(0, 0);

    // Deprecated by infinite scroll; keep for safety/no-op reload
    this.resetAndLoadUsers();
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
