/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Errors';
import { Status } from './types/Status';

import { Header } from './commponents/Header';
import { TodoList } from './commponents/TodoList';
import { Footer } from './commponents/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<Status>(Status.All);
  const [errorType, setErrorType] = useState<string>('');
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [deleteItemTodo, setDeleteItemTodo] = useState(NaN);
  const [loadedDelete, setLoadedDelete] = useState(false);
  const [todoTask, setTodoTask] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => setErrorType(''), 3000);
    const fetchTodo = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorType(ErrorType.UnableToLoad);
        clearTimeout(timeoutId);
      }
    };

    fetchTodo();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const countTodo = todos.filter(todo => !todo.completed).length;

  const todoFilter = todos.filter(todo => {
    if (filterType === Status.Active) {
      return !todo.completed;
    }

    if (filterType === Status.Completed) {
      return todo.completed;
    }

    return true;
  });

  const addNewTodo = useCallback(async (todoToAdd: Todo) => {
    setNewTodo(todoToAdd);

    try {
      const hasTodo = await addTodo(todoToAdd);

      setTodos(currentTodos => [...currentTodos, hasTodo]);
      setTodoTask('');
    } catch (error) {
      setErrorType(ErrorType.UnableToAdd);
    } finally {
      setNewTodo(null);
    }
  }, []);

  const deleteTodoItem = async (todoId: number) => {
    setDeleteItemTodo(todoId);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorType(ErrorType.UnableToDelete);
    } finally {
      setDeleteItemTodo(NaN);
    }
  };

  const loadedDeleteTodo = async () => {
    setLoadedDelete(true);

    const loadedTodos = todos.filter(todo => todo.completed);

    try {
      const results = await Promise.allSettled(
        loadedTodos.map(todo => deleteTodo(todo.id)),
      );

      const failedDeletes = results.filter(
        result => result.status === 'rejected',
      );

      if (failedDeletes.length > 0) {
        setErrorType(ErrorType.UnableToDelete);
      }

      setTodos(currentTodos =>
        currentTodos.filter(
          todo => !loadedTodos.some(item => item.id === todo.id),
        ),
      );
    } catch (error) {
      setErrorType(ErrorType.UnableToLoad);
    } finally {
      setLoadedDelete(false);
    }
  };

  useEffect(() => {
    const clearTimeOut = setTimeout(() => setErrorType(''), 3000);

    return () => clearTimeout(clearTimeOut);
  }, [errorType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorType={setErrorType}
          todoTask={todoTask}
          onChangeTodoTask={setTodoTask}
          newTodo={newTodo}
          deleteItemTodo={deleteItemTodo}
          loadedDelete={loadedDelete}
          addNewTodo={addNewTodo}
          lengthOfTodo={todos.length}
        />

        <TodoList
          todos={todoFilter}
          newTodo={newTodo}
          deleteTodoItem={deleteTodoItem}
          deleteItemTodo={deleteItemTodo}
          loadedDelete={loadedDelete}
        />

        {todos.length > 0 && (
          <Footer
            filterType={filterType}
            onFiltered={setFilterType}
            countTodo={countTodo}
            todos={todos}
            loadedDelete={loadedDelete}
            loadedDeleteTodo={loadedDeleteTodo}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorType },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorType('')}
        />
        {errorType}
      </div>
    </div>
  );
};
