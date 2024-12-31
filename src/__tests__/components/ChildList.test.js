import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import ChildList from '../../components/children/ChildList';
import * as childService from '../../services/childService';

// Mock the child service
jest.mock('../../services/childService');

const mockChildren = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: '2020-01-01',
    gender: 'M',
    photoUrl: 'https://example.com/photo1.jpg'
  },
  {
    id: 2,
    firstName: 'Marie',
    lastName: 'Dupont',
    dateOfBirth: '2018-05-15',
    gender: 'F',
    photoUrl: 'https://example.com/photo2.jpg'
  }
];

describe('ChildList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    childService.getChildren.mockResolvedValue(mockChildren);
  });

  it('renders children list', async () => {
    render(<ChildList />);

    await waitFor(() => {
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    render(<ChildList />);
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    childService.getChildren.mockRejectedValue(new Error('Failed to fetch'));

    render(<ChildList />);

    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });

  it('handles empty children list', async () => {
    childService.getChildren.mockResolvedValue([]);

    render(<ChildList />);

    await waitFor(() => {
      expect(screen.getByText(/aucun enfant/i)).toBeInTheDocument();
    });
  });

  it('handles child deletion', async () => {
    childService.deleteChild.mockResolvedValue({ success: true });
    render(<ChildList />);

    await waitFor(() => {
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    });

    // Find and click delete button for first child
    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion in dialog
    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(childService.deleteChild).toHaveBeenCalledWith(1);
    });
  });

  it('displays error when deletion fails', async () => {
    childService.getChildren.mockResolvedValue(mockChildren);
    childService.deleteChild.mockRejectedValue(new Error('Failed to delete'));

    render(<ChildList />);

    await waitFor(() => {
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteButtons[0]);

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/erreur lors de la suppression/i)).toBeInTheDocument();
    });
  });
});
