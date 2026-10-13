import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App.jsx';

afterEach(() => {
  cleanup();
});

describe('Todo App task lifecycle', () => {
  it('shows the exact empty state and an accessible task input', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Todo App' })).toBeInTheDocument();
    expect(screen.getByLabelText('Task title')).toHaveAttribute('data-testid', 'todo-input');
    expect(screen.getByTestId('empty-state')).toHaveTextContent(/^No tasks yet\.$/);
    expect(screen.getByTestId('todo-list')).toBeEmptyDOMElement();
  });

  it('adds trimmed tasks by button and Enter with sequential IDs and clears input', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input');

    fireEvent.change(input, { target: { value: '  Buy milk  ' } });
    fireEvent.click(screen.getByTestId('add-button'));

    expect(screen.getByTestId('todo-item-1')).toHaveTextContent('Buy milk');
    expect(input).toHaveValue('');
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Walk dog' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByTestId('todo-item-2')).toHaveTextContent('Walk dog');
    expect(input).toHaveValue('');
    expect(within(screen.getByTestId('todo-list')).getAllByRole('listitem').map((item) => item.dataset.testid))
      .toEqual(['todo-item-1', 'todo-item-2']);
  });

  it('ignores empty and whitespace-only input without showing an error', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input');

    fireEvent.click(screen.getByTestId('add-button'));
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: '   \t ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('todo-list')).toBeEmptyDOMElement();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('toggles only the selected task and reflects completion with strikethrough', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input');

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.click(screen.getByTestId('add-button'));
    fireEvent.change(input, { target: { value: 'Walk dog' } });
    fireEvent.click(screen.getByTestId('add-button'));

    const firstCheckbox = screen.getByTestId('todo-checkbox-1');
    const secondCheckbox = screen.getByTestId('todo-checkbox-2');
    fireEvent.click(firstCheckbox);

    expect(firstCheckbox).toBeChecked();
    expect(screen.getByTestId('todo-title-1')).toHaveStyle({ textDecoration: 'line-through' });
    expect(secondCheckbox).not.toBeChecked();
    expect(screen.getByTestId('todo-title-2')).toHaveStyle({ textDecoration: 'none' });

    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).not.toBeChecked();
    expect(screen.getByTestId('todo-title-1')).toHaveStyle({ textDecoration: 'none' });
  });

  it('deletes only the selected task and restores the empty state after the last deletion', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input');

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.click(screen.getByTestId('add-button'));
    fireEvent.change(input, { target: { value: 'Walk dog' } });
    fireEvent.click(screen.getByTestId('add-button'));

    fireEvent.click(screen.getByTestId('todo-delete-1'));
    expect(screen.queryByTestId('todo-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toHaveTextContent('Walk dog');
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('todo-delete-2'));
    expect(screen.getByTestId('empty-state')).toHaveTextContent(/^No tasks yet\.$/);
    expect(screen.getByTestId('todo-list')).toBeEmptyDOMElement();
  });
});
