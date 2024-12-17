import React from 'react';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

interface Props {
  filterType: Status;
  todos: Todo[];
  onFiltered: (filtStatus: Status) => void;
  countTodo: number;
  loadedDelete: boolean;
  loadedDeleteTodo: () => void;
}

export const Footer: React.FC<Props> = ({
  filterType,
  onFiltered,
  countTodo,
  todos,
  loadedDelete,
  loadedDeleteTodo,
}) => {
  const hasLoaded = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countTodo} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterType === Status.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => onFiltered(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filterType === Status.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => onFiltered(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filterType === Status.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => onFiltered(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={loadedDelete || !hasLoaded}
        style={{ visibility: !hasLoaded ? 'hidden' : 'visible' }}
        onClick={loadedDeleteTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
