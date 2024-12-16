import React from 'react';
import { Status } from '../types/Status';
import cn from 'classnames';

interface Props {
  filterType: Status;
  onFiltered: (status: Status) => void;
  countTodo: number;
}

export const Footer: React.FC<Props> = ({
  filterType,
  onFiltered,
  countTodo,
}) => {
  const filterStatus = Object.values(Status);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countTodo} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterStatus.map(filtStatus => (
          <a
            key={filtStatus}
            href={`#/${filtStatus !== Status.All ? filtStatus.toLowerCase() : ''}`} //className="filter__link selected"
            className={cn('filter__link', {
              selected: filtStatus === filterType,
            })}
            data-cy={`FilterLink${filtStatus}`}
            onClick={() => onFiltered(filtStatus)}
          >
            {filtStatus}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
