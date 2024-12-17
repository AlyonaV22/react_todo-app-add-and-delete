import React from 'react';
import { TodoCard } from '../commponents/TodoCard';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  newTodo: Todo | null;
  deleteTodoItem: (todoId: number) => void;
  deleteItemTodo: number;
  loadedDelete: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  newTodo,
  deleteTodoItem,
  deleteItemTodo,
  loadedDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoCard
          key={todo.id}
          todo={todo}
          deleteTodoItem={deleteTodoItem}
          loadedDelete={loadedDelete}
          deleteItemTodo={deleteItemTodo}
          hasNewTodo={false}
        />
      ))}
      {newTodo && (
        <TodoCard
          todo={newTodo}
          hasNewTodo={true}
          deleteTodoItem={deleteTodoItem}
        />
      )}
    </section>
  );
};
