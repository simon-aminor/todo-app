import { ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { AppService } from './app.service';
import { TodoAddFormComponent } from './components/todo-add-form/todo-add-form.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';


// export interface DialogData {
//   animal: string;
//   name: string;
// }

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'todo-app';
  private appService = inject(AppService)
  data = signal<any[]>([]);

  Delete(){
    this.data.set([])
  }
  Add(){
   
  }
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(TodoAddFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.data.set(result);
      }
    });
  }

  ngOnInit(): void {
    this.appService.getPosts().subscribe({
      next:(res: any)=> {
       // this.data.set(res)
        console.log(this.data());
        
      },
      error:(error)=> {
        console.error = error
      }
    })
  
  }
  
}
