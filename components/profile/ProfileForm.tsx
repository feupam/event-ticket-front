'use client';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProfileForm } from '@/hooks/useProfileForm';
import { formSections, UserProfile } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputMask } from '@/components/ui/input-mask';
import type { ControllerRenderProps, UseFormStateReturn, ControllerFieldState } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FormFieldProps {
  field: ControllerRenderProps<UserProfile, keyof UserProfile>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<UserProfile>;
}

export interface ProfileFormProps {
  initialData?: UserProfile | null;
  redirectToEvent?: string;
  ticketKind?: string;
}

export function ProfileForm({ initialData, redirectToEvent, ticketKind = 'full' }: ProfileFormProps) {
  const { theme } = useTheme();
  const [alergiaExtra, setAlergiaExtra] = useState('');
  const [medicamentoExtra, setMedicamentoExtra] = useState('');
  const { toast } = useToast();
  const [formError, setFormError] = useState<string | null>(null);
  const { form, onSubmit: originalOnSubmit, isSubmitting } = useProfileForm({ 
    initialData: initialData || undefined,
    redirectToEvent,
    ticketKind,
    alergiaExtra,
    medicamentoExtra
  });

  useEffect(() => {
    if (initialData?.alergia?.startsWith('Sim - ')) {
      setAlergiaExtra(initialData.alergia.replace('Sim - ', ''));
    }
    if (initialData?.medicamento?.startsWith('Sim - ')) {
      setMedicamentoExtra(initialData.medicamento.replace('Sim - ', ''));
    }
  }, [initialData]);

  // Wrapper para capturar erros
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      // Configura os valores de alergia e medicamento antes de enviar
      if (form.getValues('alergia') === 'Sim') {
        form.setValue('alergia', alergiaExtra ? `Sim - ${alergiaExtra}` : 'Sim');
      }
      if (form.getValues('medicamento') === 'Sim') {
        form.setValue('medicamento', medicamentoExtra ? `Sim - ${medicamentoExtra}` : 'Sim');
      }
      
      await originalOnSubmit(e);
      
      // Exibe toast de sucesso como fallback (caso não tenha sido exibido pelo hook)
      setTimeout(() => {
        toast({
          title: 'Perfil atualizado',
          description: 'Suas informações foram salvas com sucesso!',
        });
      }, 300);
      
    } catch (error: any) {
      console.error('Erro capturado no ProfileForm:', error);
      
      // Detecta erro de CPF duplicado
      if (error.message && 
         (error.message.includes('CPF already exists') || 
          error.message.includes('User with this CPF already exists'))) {
        setFormError('Já existe um usuário cadastrado com este CPF.');
        
        // Também exibe como toast para garantir que seja visto
        setTimeout(() => {
          toast({
            title: 'Erro no cadastro',
            description: 'Já existe um usuário cadastrado com este CPF.',
            variant: 'destructive'
          });
        }, 300);
      } else {
        setFormError(error.message || 'Ocorreu um erro ao salvar seu perfil. Tente novamente.');
        
        // Exibe erro também como toast
        setTimeout(() => {
          toast({
            title: 'Erro ao atualizar perfil',
            description: error.message || 'Ocorreu um erro ao salvar seu perfil. Tente novamente.',
            variant: 'destructive'
          });
        }, 300);
      }
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
              {formSections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <Separator />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => {
                      const showField = field.name.startsWith('responsavel') || field.name.startsWith('documento_responsavel') || field.name.startsWith('ddd_responsavel') || field.name.startsWith('cellphone_responsavel') ? true : (!field.dependsOn || field.dependsOn.value(form.getValues(field.dependsOn.field)));
                      if (!showField) return null;
                      return (
                        <div key={field.name} className="space-y-2">
                          <FormField
                            control={form.control}
                            name={field.name}
                            render={({ field: formField, fieldState, formState }: FormFieldProps) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1">
                                  {field.label}
                                  {field.required && <span className="text-red-500">*</span>}
                                </FormLabel>
                                <FormControl>
                                  {field.type === 'select' ? (
                                    <Select
                                      value={String(formField.value || '')}
                                      onValueChange={formField.onChange}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {field.options?.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : field.type === 'textarea' ? (
                                    <Textarea {...formField} />
                                  ) : field.mask ? (
                                    <InputMask
                                      mask={field.mask}
                                      name={field.name}
                                      value={String(formField.value || '')}
                                      onChange={(maskedValue) => {
                                        const rawValue = maskedValue.replace(/\D/g, '');
                                        formField.onChange(rawValue);
                                      }}
                                    />
                                  ) : field.name === 'idade' ? (
                                    <Input 
                                      {...formField} 
                                      type="number" 
                                      min="0"
                                      max="120"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const numValue = value ? parseInt(value, 10) : 0;
                                        formField.onChange(numValue);
                                      }}
                                    />
                                  ) : (
                                    <Input {...formField} type={field.type} />
                                  )}
                                </FormControl>
                                {field.required && (
                                  <FormDescription className="text-xs text-muted-foreground">
                                    Campo obrigatório
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {field.name === 'alergia' && form.getValues('alergia') === 'Sim' && (
                            <div className="space-y-1">
                              <FormLabel className="flex items-center gap-1">Qual alergia? <span className="text-red-500">*</span></FormLabel>
                              <Input
                                value={alergiaExtra}
                                onChange={e => setAlergiaExtra(e.target.value)}
                                required
                              />
                            </div>
                          )}
                          {field.name === 'medicamento' && form.getValues('medicamento') === 'Sim' && (
                            <div className="space-y-1">
                              <FormLabel className="flex items-center gap-1">Qual medicamento? <span className="text-red-500">*</span></FormLabel>
                              <Input
                                value={medicamentoExtra}
                                onChange={e => setMedicamentoExtra(e.target.value)}
                                required
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
} 