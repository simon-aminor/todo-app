import { Component, Inject, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-todo-add-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogContent,
    MatDialogModule,
    MatDialogActions,
  ],
  templateUrl: './todo-add-form.component.html',
  styleUrl: './todo-add-form.component.scss',
})
export class TodoAddFormComponent {
  readonly dialogRef = inject(MatDialogRef<TodoAddFormComponent>);
  data = signal<any>({});

  constructor(@Inject(MAT_DIALOG_DATA) item: any) {
    if (item) {
      this.data.set(item);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
    console.log('canceled');
  }
  append() {
    this.dialogRef.close(this.data());
  }
}
