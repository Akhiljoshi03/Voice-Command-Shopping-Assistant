import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  window.localStorage.clear();
  window.history.pushState({}, '', '/');
});

describe('App smoke test', () => {
  it('renders the home dashboard without crashing', async () => {
    render(<App />);
    expect(await screen.findByText(/Sahayak/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add 2 bottles of milk/i)).toBeInTheDocument();
  });

  it('adds an item via the typed command fallback and shows it on the list page', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/add 2 bottles of milk/i);
    fireEvent.change(input, { target: { value: 'Add 3 packets of chips' } });
    fireEvent.submit(input.closest('form')!);

    // Wait for the async processing timeout in VoiceAssistantPanel
    await new Promise((r) => setTimeout(r, 700));

    expect(await screen.findByText(/Added 3 packets of chips to your list\./i)).toBeInTheDocument();

    // Navigate to the list page and confirm the item persisted
    const listLinks = screen.getAllByRole('link', { name: /^list$/i });
    fireEvent.click(listLinks[0]);

    expect((await screen.findAllByText(/^chips$/i)).length).toBeGreaterThan(0);
  });

  it('removes an item by voice-style text command', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/add 2 bottles of milk/i);
    fireEvent.change(input, { target: { value: 'Remove milk from my list' } });
    fireEvent.submit(input.closest('form')!);
    await new Promise((r) => setTimeout(r, 700));
    expect(await screen.findByText(/Removed Milk/i)).toBeInTheDocument();
  });

  it('handles an unrecognized command gracefully', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/add 2 bottles of milk/i);
    fireEvent.change(input, { target: { value: 'xyz gibberish nonsense' } });
    fireEvent.submit(input.closest('form')!);
    await new Promise((r) => setTimeout(r, 700));
    expect((await screen.findAllByText(/couldn't understand/i)).length).toBeGreaterThan(0);
  });
});
