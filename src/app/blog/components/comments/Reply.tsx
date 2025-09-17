'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaTimes } from 'react-icons/fa';
import { ReplyForm } from '@/types/forms';

interface ReplyProps {
  parentId: string;
  onReply: (content: string, author: string) => void;
  onCancel: () => void;
  currentUser: string;
}

export const Reply = ({ parentId, onReply, onCancel, currentUser }: ReplyProps) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(currentUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onReply(content.trim(), author);
      setContent('');
    }
  };

  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="text"
              placeholder="Tu nombre"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mb-2"
              required
            />
            <Input
              type="text"
              placeholder="Escribe tu respuesta..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center space-x-2">
            <Button
              type="submit"
              size="sm"
              className="bg-accent-background hover:bg-darker-purple text-white">
              Responder
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={12} />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
