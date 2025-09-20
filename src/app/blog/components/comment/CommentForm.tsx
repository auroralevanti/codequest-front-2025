'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommentForm as CommentFormType } from '@/types/forms';

interface CommentFormProps {
  onSubmit: (data: CommentFormType) => void;
  currentUser: string;
}

export const CommentForm = ({ onSubmit, currentUser }: CommentFormProps) => {
  const [formData, setFormData] = useState<CommentFormType>({
    content: '',
    author: currentUser
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.content.trim()) {
      // ensure author is currentUser when submitting
      onSubmit({ ...formData, author: currentUser });
      setFormData({ ...formData, content: '' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Deja un comentario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              name="content"
              placeholder="Escribe tu comentario..."
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="justify-center items-center text-white bg-background hover:bg-accent-background hover:text-black">
            Comentar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
