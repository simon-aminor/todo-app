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
import { Todo } from './types/todo';
import { NgStyle } from '@angular/common';

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
  todos = signal<Todo[]>([]);
  filtredTodos = signal<Todo[]>([]);

  isChecked = signal<boolean>(false);
  searchedText = signal('');
  readonly dialog = inject(MatDialog);

  private appService = inject(AppService);
  ngOnInit(): void {
    this.fetchData(); //fetch data at first render
  }
  openDialog(item: any): void {
    const dialogRef = this.dialog.open(TodoAddFormComponent, { data: item });
    // open and after close dialog
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // when somthing writen in add dialog this scope addes
        this.todos.update((prev: any) =>
          prev.map((x: any) =>
            x.id === result.id
              ? { ...x, title: result.title, body: result.body }
              : x
          )
        );

        this.filtredTodos.set(this.todos());
      } else {
        return;
      }
      console.log('The dialog was closed');
      if (item) {
        this.editItem(item, result);
        this.updateField(this.searchedText());
      } else {
        this.add(result);
        this.updateField(this.searchedText());
      }
    });
  }
  add(result: any) {
    if (result !== undefined) {
      const random = Math.random();
      result.id = random;
      result.checked = false;
      this.todos.update((state: any) => [...state, result]);
      this.filtredTodos.set(this.todos());
    }
  }
  Delete() {
    this.todos.update((prev) => prev.filter((e) => !e.checked));
    this.filtredTodos.set(this.todos());
  }
  deleteItem(id: any) {
    this.filtredTodos().filter((state) => {
      if (state.id == id) {
        const index = this.filtredTodos().indexOf(state);
        this.filtredTodos().splice(index, 1);
        this.todos.set(this.filtredTodos());
      }
      return;
    });
  }
  editItem(item: any, result: any) {
    console.log(result);

    this.filtredTodos().filter((state) => {
      if (state.id == item.id) {
        const index = this.filtredTodos().indexOf(state);
        this.filtredTodos()[index];
      }
    });
  }
  updateField(text: string) {
    this.searchedText.set(text);
    const a = this.todos().filter((data) => {
      if (data.title.includes(text)) {
        return data;
      } else {
        return;
      }
    });
    this.freshData(a);
  }
  freshData(a?: any) {
    if (a) {
      const b = a;
      this.filtredTodos.set(b);
    } else {
      this.filtredTodos.set(this.todos());
    }
  }
  fetchData() {
    this.appService.getPosts().subscribe({
      next: async (res: any) => {
        await res?.forEach((el: any) => (el.checked = false));
        this.todos.set(res);
        this.filtredTodos.set(this.todos());
      },
      error: (error) => {
        console.error = error;
      },
    });
  }
  selectAll() {
    this.todos.update((prev: any) =>
      prev.map((x: any) => ({ ...x, checked: true }))
    );

    this.filtredTodos.set(this.todos());
  }

  handleCheckBoxChange(item: any) {
    this.isChecked.set(Boolean(this.todos().filter((c) => c.checked).length));
  }
}
