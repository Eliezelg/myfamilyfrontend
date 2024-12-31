import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChildForm from '../../components/children/ChildForm';
import * as childService from '../../services/childService';
import * as fileService from '../../services/fileService';

// Mock the services
jest.mock('../../services/childService');
jest.mock('../../services/fileService');

describe('ChildForm Component', () => {
  const mockChild = {
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: '2020-01-01',
    gender: 'M',
    photoUrl: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders child form', () => {
    render(<ChildForm />);

    expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date de naissance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/genre/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();
  });

  it('handles successful child creation', async () => {
    const mockAddChild = jest.fn().mockResolvedValue({ id: 1, ...mockChild });
    childService.addChild.mockImplementation(mockAddChild);

    render(<ChildForm onSuccess={jest.fn()} />);

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/prénom/i), mockChild.firstName);
    await userEvent.type(screen.getByLabelText(/nom/i), mockChild.lastName);
    await userEvent.type(screen.getByLabelText(/date de naissance/i), mockChild.dateOfBirth);
    await userEvent.selectOptions(screen.getByLabelText(/genre/i), mockChild.gender);

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(mockAddChild).toHaveBeenCalledWith(mockChild);
    });
  });

  it('handles photo upload', async () => {
    const mockUploadFile = jest.fn().mockResolvedValue('https://example.com/photo.jpg');
    fileService.uploadFile.mockImplementation(mockUploadFile);

    render(<ChildForm />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/photo/i);
    
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalled();
    });
  });

  it('displays validation errors', async () => {
    render(<ChildForm />);

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText(/le prénom est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/le nom est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/la date de naissance est requise/i)).toBeInTheDocument();
      expect(screen.getByText(/le genre est requis/i)).toBeInTheDocument();
    });
  });

  it('handles error during child creation', async () => {
    const mockError = new Error('Failed to create child');
    childService.addChild.mockRejectedValue(mockError);

    render(<ChildForm />);

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/prénom/i), mockChild.firstName);
    await userEvent.type(screen.getByLabelText(/nom/i), mockChild.lastName);
    await userEvent.type(screen.getByLabelText(/date de naissance/i), mockChild.dateOfBirth);
    await userEvent.selectOptions(screen.getByLabelText(/genre/i), mockChild.gender);

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText(/erreur lors de la création/i)).toBeInTheDocument();
    });
  });

  it('handles edit mode', () => {
    render(<ChildForm initialData={mockChild} isEdit={true} />);

    expect(screen.getByLabelText(/prénom/i)).toHaveValue(mockChild.firstName);
    expect(screen.getByLabelText(/nom/i)).toHaveValue(mockChild.lastName);
    expect(screen.getByLabelText(/date de naissance/i)).toHaveValue(mockChild.dateOfBirth);
    expect(screen.getByLabelText(/genre/i)).toHaveValue(mockChild.gender);
  });

  it('handles successful child update', async () => {
    const mockUpdateChild = jest.fn().mockResolvedValue({ id: 1, ...mockChild });
    childService.updateChild.mockImplementation(mockUpdateChild);

    render(<ChildForm initialData={mockChild} isEdit={true} childId={1} onSuccess={jest.fn()} />);

    // Modify some data
    await userEvent.clear(screen.getByLabelText(/prénom/i));
    await userEvent.type(screen.getByLabelText(/prénom/i), 'Pierre');

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(mockUpdateChild).toHaveBeenCalledWith(1, {
        ...mockChild,
        firstName: 'Pierre'
      });
    });
  });
});
