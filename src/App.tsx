/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
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

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorType(ErrorType.UnableToLoad);
        setTimeout(() => setErrorType(''), 3000);
      }
    };

    fetchTodo();
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

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <TodoList todos={todoFilter} />
        {todos.length > 0 && (
          <Footer
            filterType={filterType}
            onFiltered={setFilterType}
            countTodo={countTodo}
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
