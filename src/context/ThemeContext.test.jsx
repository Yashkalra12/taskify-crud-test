import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';

// Test component that uses the theme
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should provide default dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('should load theme from localStorage', () => {
    localStorage.setItem('theme', 'light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('should toggle theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    
    const toggleButton = screen.getByRole('button', { name: 'Toggle' });
    await user.click(toggleButton);
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('should persist theme to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const toggleButton = screen.getByRole('button', { name: 'Toggle' });
    await user.click(toggleButton);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should update document attribute', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    const toggleButton = screen.getByRole('button', { name: 'Toggle' });
    await user.click(toggleButton);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    console.error = originalError;
  });
});

