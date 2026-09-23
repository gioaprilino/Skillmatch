'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface VoiceInputProps {
  onResult: (text: string) => void;
  className?: string;
  placeholder?: string;
}

export function VoiceInput({ onResult, className }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
    }
  }, []);

  const toggleListening = () => {
    if (!isSupported) {
      toast.error('Perangkat/browser Anda tidak mendukung input suara Web Speech API.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast('Mendengarkan suara Anda...', { icon: '🎙️' });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onResult(transcript);
          toast.success(`Terdengar: "${transcript}"`);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error('Izin mikrofon ditolak.');
        } else if (event.error !== 'no-speech') {
          toast.error('Gagal mengenali suara, silakan coba lagi.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
      toast.error('Terjadi kesalahan saat memulai input suara.');
    }
  };

  return (
    <Button
      type="button"
      variant={isListening ? 'destructive' : 'outline'}
      size="icon"
      onClick={toggleListening}
      className={`relative transition-all duration-200 ${
        isListening ? 'animate-pulse ring-2 ring-red-400' : ''
      } ${className || ''}`}
      title={isListening ? 'Berhenti mendengarkan' : 'Bicara untuk mengisi (Voice Input)'}
      aria-label="Input Suara"
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4 text-primary" />
      )}
    </Button>
  );
}
