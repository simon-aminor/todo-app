import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  Signal,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AppService } from './app.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodoAddFormComponent } from './components/todo-add-form/todo-add-form.component';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    TodoAddFormComponent,
    MatCheckboxModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'todo-app';
  private appService = inject(AppService);
  data = signal<any[]>([]);
  newData = signal<any[]>([]);

  readonly dialog = inject(MatDialog);

  Delete() {
    this.data.set([]);
    this.newData.set(this.data());
  }

  openDialog(id: any): void {
    const dialogRef = this.dialog.open(TodoAddFormComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      console.log('The dialog was closed');

      if (id) {
        this.editItem(id, result);
      } else {
        this.add(result);
      }
    });
  }

  add(result: any) {
    if (result !== undefined) {
      const random = Math.random();
      result.id = random;
      this.data.update((state) => [...state, result]);
      this.newData.set(this.data());
    }
  }

  ngOnInit(): void {
    this.appService.getPosts().subscribe({
      next: (res: any) => {
        this.data.set(res);
        this.newData.set(this.data());
      },
      error: (error) => {
        console.error = error;
      },
    });
  }

  updateField(e: Event) {
    const a = this.data().filter((data) => {
      if (data.title.includes(e)) {
        return data;
      } else {
        return;
      }
    });
    this.giveData(a);
  }

  giveData(a?: any) {
    if (a) {
      //  console.log(a.slice().reverse());
      const b = a;
      this.newData.set(b);
    } else {
      //   console.log(this.newData.set(this.data()));
      this.newData.set(this.data());
    }
  }

  deleteItem(id: any) {
    this.newData().filter((state) => {
      if (state.id == id) {
        const index = this.newData().indexOf(state);
        this.newData().splice(index, 1);
        this.data.set(this.newData());
      }
      return;
    });
  }

  editItem(id: any, result: any) {
    this.newData().filter((state) => {
      if (state.id == id) {
        const index = this.newData().indexOf(state);
        this.newData()[index];
      }
    });
  }
}
