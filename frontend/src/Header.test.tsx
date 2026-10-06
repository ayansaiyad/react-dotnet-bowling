import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('renders title and description correctly', () => {
    render(
      <Header
        title="Test League Title"
        description="Test description text for bowling league."
      />
    );

    expect(screen.getByText('Test League Title')).toBeInTheDocument();
    expect(screen.getByText('Test description text for bowling league.')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });
});
