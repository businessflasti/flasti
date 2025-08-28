import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PremiumCardOverlay from '../PremiumCardOverlay';

describe('PremiumCardOverlay', () => {
  const mockOnUnlockClick = jest.fn();
  
  beforeEach(() => {
    mockOnUnlockClick.mockClear();
  });

  it('renders children when not locked', () => {
    render(
      <PremiumCardOverlay isLocked={false} onUnlockClick={mockOnUnlockClick}>
        <div data-testid="child-content">Test Content</div>
      </PremiumCardOverlay>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders overlay when locked', () => {
    render(
      <PremiumCardOverlay isLocked={true} onUnlockClick={mockOnUnlockClick}>
        <div data-testid="child-content">Test Content</div>
      </PremiumCardOverlay>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Disponible solo con acceso Premium')).toBeInTheDocument();
  });

  it('calls onUnlockClick when overlay is clicked', () => {
    render(
      <PremiumCardOverlay isLocked={true} onUnlockClick={mockOnUnlockClick}>
        <div>Test Content</div>
      </PremiumCardOverlay>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnUnlockClick).toHaveBeenCalledTimes(1);
  });

  it('displays custom message when provided', () => {
    const customMessage = 'Custom Premium Message';
    
    render(
      <PremiumCardOverlay 
        isLocked={true} 
        onUnlockClick={mockOnUnlockClick}
        lockReason="custom"
        customMessage={customMessage}
      >
        <div>Test Content</div>
      </PremiumCardOverlay>
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(
      <PremiumCardOverlay isLocked={true} onUnlockClick={mockOnUnlockClick}>
        <div>Test Content</div>
      </PremiumCardOverlay>
    );

    const overlay = screen.getByRole('button');
    fireEvent.keyDown(overlay, { key: 'Enter' });
    expect(mockOnUnlockClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(overlay, { key: ' ' });
    expect(mockOnUnlockClick).toHaveBeenCalledTimes(2);
  });
});