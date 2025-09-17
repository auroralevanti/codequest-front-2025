'use client';

import { NewPostForm } from './NewPostForm';
import { NewPostForm as NewPostFormType } from '@/types/forms';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewPostFormType) => void;
  currentUser: string;
}

export const PostModal = ({ isOpen, onClose, onSubmit }: PostModalProps) => {
  if (!isOpen) return null;

  return (
    <NewPostForm
      submitForm={onSubmit}
      onCancel={onClose}
    />
  );
};

