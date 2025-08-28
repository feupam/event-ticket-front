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
import { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Verifica se há campos obrigatórios vazios
    const requiredFields = ['name', 'church', 'pastor', 'ddd', 'cellphone', 'cep', 'cpf', 'data_nasc'] as const;
    const emptyFields = requiredFields.filter(field => !form.getValues(field));
    
    if (emptyFields.length > 0) {
      setFormError('Por favor, preencha todos os campos obrigatórios antes de salvar.');
      toast({
        title: 'Campos obrigatórios',
        description: 'Alguns campos obrigatórios estão vazios. Verifique o formulário.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Configura os valores de alergia e medicamento
      if (form.getValues('alergia') === 'Sim') {
        form.setValue('alergia', alergiaExtra ? `Sim - ${alergiaExtra}` : 'Sim');
      }
      if (form.getValues('medicamento') === 'Sim') {
        form.setValue('medicamento', medicamentoExtra ? `Sim - ${medicamentoExtra}` : 'Sim');
      }
      
      await originalOnSubmit(e);
      
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro capturado no ProfileForm:', error);
      
      // Erros de autenticação serão tratados pelo interceptor do axios
      if (error.response?.status === 401) {
        return;
      }
      
      if (error.message?.includes('CPF already exists') || 
          error.message?.includes('User with this CPF already exists')) {
        const msg = 'Já existe um usuário cadastrado com este CPF.';
        setFormError(msg);
        toast({
          title: 'Erro no cadastro',
          description: msg,
          variant: 'destructive'
        });
      } else {
        const msg = error.message || 'Ocorreu um erro ao salvar seu perfil. Tente novamente.';
        setFormError(msg);
        toast({
          title: 'Erro no cadastro',
          description: msg,
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg flex items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg font-medium">Processando...</span>
          </div>
        </div>
      )}
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
            <form onSubmit={handleSubmit} className="space-y-8">
              {formSections.map((section, index) => (
                <div key={section.title}>
                  {index > 0 && <Separator className="my-8" />}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    {section.fields.map((field) => {
                      const showField = field.name.startsWith('responsavel') || 
                                      field.name.startsWith('documento_responsavel') || 
                                      field.name.startsWith('ddd_responsavel') || 
                                      field.name.startsWith('cellphone_responsavel') 
                                        ? form.getValues('idade') < 18 
                                        : true;

                      if (!showField) return null;

                      return (
                        <div key={field.name}>
                          <FormField
                            control={form.control}
                            name={field.name as keyof UserProfile}
                            render={({ field: formField }) => (
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
                                        <SelectValue placeholder={field.placeholder} />
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
                                    <Textarea {...formField} placeholder={field.placeholder} />
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
                              <FormLabel className="flex items-center gap-1">
                                Qual alergia? <span className="text-red-500">*</span>
                              </FormLabel>
                              <Input
                                value={alergiaExtra}
                                onChange={e => setAlergiaExtra(e.target.value)}
                                required
                              />
                            </div>
                          )}
                          {field.name === 'medicamento' && form.getValues('medicamento') === 'Sim' && (
                            <div className="space-y-1">
                              <FormLabel className="flex items-center gap-1">
                                Qual medicamento? <span className="text-red-500">*</span>
                              </FormLabel>
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