"use client";

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Event } from '@/lib/types';
import { usePaymentForm } from '@/hooks/use-payment-form';

interface PaymentFormProps {
  event: Event;
  onSubmit: (data: PaymentData) => void;
}

interface PaymentData {
  name: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export default function PaymentForm({ event, onSubmit }: PaymentFormProps) {
  const {
    formData,
    errors,
    handleChange,
    validateForm
  } = usePaymentForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Seu nome completo"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="seu@email.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <Label htmlFor="cardNumber">Número do Cartão</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              placeholder="0000 0000 0000 0000"
              className={errors.cardNumber ? 'border-red-500' : ''}
            />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.cardNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry">Validade</Label>
            <Input
              id="expiry"
              value={formData.expiry}
              onChange={(e) => handleChange('expiry', e.target.value)}
              placeholder="MM/AA"
              className={errors.expiry ? 'border-red-500' : ''}
            />
            {errors.expiry && (
              <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>
            )}
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              value={formData.cvv}
              onChange={(e) => handleChange('cvv', e.target.value)}
              placeholder="000"
              className={errors.cvv ? 'border-red-500' : ''}
            />
            {errors.cvv && (
              <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Finalizar Compra
      </Button>
    </form>
  );
} 