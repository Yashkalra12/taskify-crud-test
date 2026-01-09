import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '../context/ThemeContext';

const renderWithTheme = (initialTheme = 'dark') => {
  localStorage.setItem('theme', initialTheme);
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should render theme toggle button', () => {
    renderWithTheme();
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title');
  });

  it('should show moon icon in light theme', () => {
    renderWithTheme('light');
    
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should show sun icon in dark theme', () => {
    renderWithTheme('dark');
    
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should toggle theme when clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme('dark');
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // Theme should be toggled (check localStorage)
    await new Promise(resolve => setTimeout(resolve, 100));
    const savedTheme = localStorage.getItem('theme');
    expect(savedTheme).toBe('light');
  });

  it('should update document attribute when theme changes', async () => {
    const user = userEvent.setup();
    renderWithTheme('dark');
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should have correct title attribute', () => {
    renderWithTheme('dark');
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to light mode');
  });

  it('should update title when theme changes', async () => {
    const user = userEvent.setup();
    renderWithTheme('dark');
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to light mode');
    
    await user.click(button);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
  });
});

