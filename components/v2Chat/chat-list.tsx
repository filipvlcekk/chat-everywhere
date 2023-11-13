import { useEffect } from 'react';

import { type MessageType } from '@/types/v2Chat/chat';

import { ChatMessage } from '@/components/v2Chat/chat-message';
import { ImageContainer } from '@/components/v2Chat/image-container';
import { ImageGenerationSpinner } from '@/components/v2Chat/image-generation-spinner';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/v2Chat/ui/alert';
import { Separator } from '@/components/v2Chat/ui/separator';

export interface ChatList {
  messages: MessageType[];
  scrollToButton: () => void;
  suggestions: string[];
  onMessageSent: (message: MessageType) => void;
  isChatResponseLoading: boolean;
}

export function ChatList({
  messages,
  scrollToButton,
  suggestions,
  onMessageSent,
  isChatResponseLoading,
}: ChatList) {
  useEffect(() => {
    scrollToButton();
  }, [messages]);

  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 h-full">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
          {message.metadata?.imageGenerationStatus === 'in progress' && (
            <ImageGenerationSpinner />
          )}
          {message.metadata?.imageGenerationStatus === 'completed' &&
            message.metadata?.imageUrl && (
              <ImageContainer url={message.metadata.imageUrl} />
            )}
          {message.metadata?.imageGenerationStatus === 'failed' && (
            <Alert variant="destructive" className="max-w-xs mb-6">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>
                Unable to generate image, please try again
              </AlertDescription>
            </Alert>
          )}
        </div>
      ))}
      <div>
        {suggestions.length > 0 && !isChatResponseLoading && (
          <div className="flex flex-wrap justify-center items-center">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md m-2"
                onClick={() =>
                  onMessageSent({
                    role: 'user',
                    content: suggestion,
                  })
                }
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
