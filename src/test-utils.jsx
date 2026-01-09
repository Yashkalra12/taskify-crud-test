import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './store/taskSlice';
import { ThemeProvider } from './context/ThemeContext';

// Helper function to render components with Redux and Theme providers
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { tasks: taskReducer },
      preloadedState,
    }),
    theme = 'dark',
    ...renderOptions
  } = {}
) {
  // Set initial theme in localStorage
  if (theme) {
    localStorage.setItem('theme', theme);
  }

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

