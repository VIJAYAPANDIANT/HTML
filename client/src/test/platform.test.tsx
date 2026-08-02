import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../modules/auth/LoginPage';
import AiCenterPage from '../modules/ai-center/AiCenterPage';

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock echarts-for-react to avoid canvas mock errors in jsdom
vi.mock('echarts-for-react', () => {
  return {
    default: () => <div data-testid="mock-echart">Mock EChart</div>
  };
});

describe('IntelliSphere SPA Testing Suite', () => {
  
  it('renders LoginPage credentials form successfully', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Sign in to your IntelliSphere AI workspace/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
  });

  it('renders Flagship AI Command Center panel metrics', () => {
    render(
      <BrowserRouter>
        <AiCenterPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Global AI Decision Command Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Global Risk Index/i)).toBeInTheDocument();
    expect(screen.getByText(/Sustainability Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Decision AI Copilot Terminal/i)).toBeInTheDocument();
  });
});
