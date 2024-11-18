import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { EmptyBoxComponent } from './components/empty-box/empty-box.component';
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
import { Todo } from './types/todo';
import { DeleteWarningPopupComponent } from './components/delete-warning-popup/delete-warning-popup.component';

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
    MatCheckboxModule,
    EmptyBoxComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  todos = signal<Todo[]>([]);
  filtredTodos = signal<Todo[]>([]);
  deleteConfrimation = signal<boolean>(false);
  isChecked = signal<boolean>(false);
  searchedText = signal('');

  readonly dialog = inject(MatDialog);
  private appService = inject(AppService);

  ngOnInit(): void {
    this.fetchData(); //fetch data at first render
  }
  ngDoCheck(): void {
    this.updateField(this.searchedText()); // when s.t changes it rerenders filters
    this.handleCheckBoxChange(); // selectAll button check when change detected
  }

  openDialog(item: any): void {
    const dialogRef = this.dialog.open(TodoAddFormComponent, { data: item });
    // open and after close dialog
    dialogRef.afterClosed().subscribe((result) => {
      // choose to edit or add result
      if (item && result) {
        this.editItem(result);
      } else if (result) {
        this.add(result);
      }
    });
  }
  add(result: any) {
    // add new todo with dialog results
    if (result.title && result.body) {
      const random = Math.random();
      result.id = random;
      result.checked = false;
      this.todos.update((state: any) => [...state, result]);
      this.filtredTodos.set(this.todos());
    }
  }
  async openWarningDialog() {
    // open confrimation dialog
    const dialogRef = this.dialog.open(DeleteWarningPopupComponent);

    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe((result) => {
        this.deleteConfrimation.set(false);
        if (result) {
          this.deleteConfrimation.set(true);
          resolve(true);
        } else {
          this.deleteConfrimation.set(false);
          resolve(false);
        }
      });
    });
  }
  async deleteAll() {
    // delete all checked Todos
    await this.openWarningDialog();
    if (this.deleteConfrimation()) {
      console.log('deleted');
      this.todos.update((prev) => prev.filter((e) => !e.checked));
      this.filtredTodos.set(this.todos());
      this.ngDoCheck();
    }
  }
  async deleteItem(id: any) {
    // delete targeted Todo from data
    await this.openWarningDialog();
    if (this.deleteConfrimation()) {
      this.todos.update((prev) => prev.filter((e) => e.id !== id));
      this.filtredTodos.set(this.todos());
      this.ngDoCheck();
    }
  }
  editItem(result: any) {
    // edit selected todo with changes writen in dialog

    this.todos.update((prev: any) =>
      prev.map((x: any) =>
        x.id === result.id
          ? { ...x, title: result.title, body: result.body }
          : x
      )
    );

    this.filtredTodos.set(this.todos());
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
    // get todo data from api
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
    // turns all todos checked to true
    this.todos.update((prev: any) =>
      prev.map((x: any) => ({ ...x, checked: true }))
    );

    this.filtredTodos.set(this.todos());
  }
  handleCheckBoxChange(item?: any) {
    // if a card is checked it shows select all button
    this.isChecked.set(Boolean(this.todos().filter((c) => c.checked).length));
  }
}
