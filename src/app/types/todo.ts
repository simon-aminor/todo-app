export interface Todo {
  userId: number;
  id: number;
  title: string;
  body:string
  completed: boolean;
  checked?: boolean;
}
