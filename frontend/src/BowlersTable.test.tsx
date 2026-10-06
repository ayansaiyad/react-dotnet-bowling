import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BowlersTable, { buildBowlerCardInfo, buildBowlerCardInfoDuplicate } from './BowlersTable';
import type { Bowler } from './types/Bowler';

const mockBowlers: Bowler[] = [
  {
    bowlerId: 1,
    bowlerLastName: 'Doe',
    bowlerFirstName: 'John',
    bowlerMiddleInit: 'A',
    bowlerAddress: '123 Main St',
    bowlerCity: 'Springfield',
    bowlerState: 'IL',
    bowlerZip: '62701',
    bowlerPhoneNumber: '555-1234',
    team: { teamId: 10, teamName: 'Marlins' },
  },
  {
    bowlerId: 2,
    bowlerLastName: 'Smith',
    bowlerFirstName: 'Jane',
    bowlerMiddleInit: null,
    bowlerAddress: '456 Oak Rd',
    bowlerCity: 'Springfield',
    bowlerState: 'IL',
    bowlerZip: '62702',
    bowlerPhoneNumber: '555-5678',
    team: { teamId: 20, teamName: 'Sharks' },
  },
  {
    bowlerId: 3,
    bowlerLastName: 'Taylor',
    bowlerFirstName: 'Bob',
    bowlerMiddleInit: 'B',
    bowlerAddress: '789 Pine Ave',
    bowlerCity: 'Springfield',
    bowlerState: 'IL',
    bowlerZip: '62703',
    bowlerPhoneNumber: '555-9012',
    team: { teamId: 30, teamName: 'Eagles' },
  },
];

describe('BowlersTable Component', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockBowlers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders bowler data filtered by displayTeams', async () => {
    render(<BowlersTable displayTeams={['Marlins', 'Sharks']} />);

    await waitFor(() => {
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
      expect(screen.queryByText('Taylor')).not.toBeInTheDocument();
    });
  });

  it('renders all bowlers if no filter is supplied', async () => {
    render(<BowlersTable displayTeams={[]} />);

    await waitFor(() => {
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
      expect(screen.getByText('Taylor')).toBeInTheDocument();
    });
  });

  it('handles fetch network error gracefully', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    render(<BowlersTable displayTeams={['Marlins']} />);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('handles non-200 HTTP response gracefully', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(null, { status: 500 })
    );

    render(<BowlersTable displayTeams={['Marlins']} />);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('formats bowler card info correctly with empty fields', () => {
    const cardInfo = buildBowlerCardInfo(mockBowlers[0]);
    const duplicateCardInfo = buildBowlerCardInfoDuplicate(mockBowlers[0]);

    expect(cardInfo).toContain('John A. Doe');
    expect(duplicateCardInfo).toContain('John A. Doe');

    const emptyBowler: Bowler = {
      bowlerId: 0,
      bowlerLastName: '',
      bowlerFirstName: '',
      bowlerMiddleInit: null,
      bowlerAddress: '',
      bowlerCity: '',
      bowlerState: '',
      bowlerZip: '',
      bowlerPhoneNumber: '',
      team: { teamId: 0, teamName: '' }
    };
    expect(buildBowlerCardInfo(emptyBowler)).toBeDefined();
    expect(buildBowlerCardInfoDuplicate(emptyBowler)).toBeDefined();
  });
});
