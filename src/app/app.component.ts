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
  event !: Event  // ! => doesn't have first value

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.fetchData();  //fetch data at first render
  }
  openDialog(item: any): void {
    const dialogRef = this.dialog.open(TodoAddFormComponent, { data: item });
      // open and after close dialog 
    dialogRef.afterClosed().subscribe((result) => {
      if (result) { // when somthing writen in add dialog this scope addes
        this.data.update((prev: any) =>
          prev.map((x: any) =>
            x.id === result.id
              ? { ...x, title: result.title, body: result.body }
              : x
          )
        );
        
        this.newData.set(this.data());
        
      } else {
        return;
      }
      console.log('The dialog was closed');
      if (item) {
        this.editItem(item, result);
        this.updateField(this.event);
      } else {
        this.add(result);
        this.updateField(this.event);
      }
    });
  }
  add(result: any) {
    if (result !== undefined) {
      const random = Math.random();
      result.id = random;
      result.checked = false;
      this.data.update((state: any) => [...state, result]);
      this.newData.set(this.data());
    }
  }
  Delete() {
    this.data.update((prev) => prev.filter((e) => !e.checked));
    this.newData.set(this.data());
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
  editItem(item: any, result: any) {
    console.log(result);

    this.newData().filter((state) => {
      if (state.id == item.id) {
        const index = this.newData().indexOf(state);
        this.newData()[index];
      }
    });
  }
  updateField(e: Event) {
     this.event = e
    const a = this.data().filter((data) => {
      if (data.title.includes(e)) {
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
      this.newData.set(b);
    } else {
      this.newData.set(this.data());
    }
  }
  fetchData() {
    this.appService.getPosts().subscribe({
      next: async (res: any) => {
        await res?.forEach((el: any) => (el.checked = false));
        this.data.set(res);
        this.newData.set(this.data());
      },
      error: (error) => {
        console.error = error;
      },
    });
  }
  selectAll() {
    this.data.update((prev: any) =>
      prev.map((x: any) => ({ ...x, checked: true }))
    );
    this.newData.set(this.data());
    //this.Delete();
  }
}
