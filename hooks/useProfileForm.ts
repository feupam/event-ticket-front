import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { userProfileSchema } from '@/lib/schemas/user-profile';
import type { UserProfile } from '@/types/user';
import { useCallback, useState } from 'react';
import userService from '@/services/userService';
import { useRouter } from 'next/navigation';

interface UseProfileFormProps {
  initialData?: Partial<UserProfile>;
  redirectToEvent?: string;
  ticketKind?: string;
  alergiaExtra?: string;
  medicamentoExtra?: string;
}

export function useProfileForm({ initialData, redirectToEvent, ticketKind = 'full', alergiaExtra = '', medicamentoExtra = '' }: UseProfileFormProps = {}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Log para depuração dos dados iniciais
  console.log('Dados iniciais recebidos:', initialData);
  
  const form = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      ...initialData,
    },
    mode: 'onChange', // Validação em tempo real
  });

  const onSubmit = useCallback(async (e: React.FormEvent | UserProfile) => {
    // Verifica se o parâmetro é um evento de formulário
    if (e && 'preventDefault' in e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    // Se o argumento for um evento de formulário, pegamos os dados do form
    const data = e && 'preventDefault' in e ? form.getValues() : e as UserProfile;
    
    try {
      setIsSubmitting(true);
      
      // Garante que userType esteja definido e converte idade para número
      let dataToSubmit = {
        ...data,
        userType: data.userType || 'client',
        idade: typeof data.idade === 'string' 
          ? (/^\d+$/.test(String(data.idade).trim()) ? parseInt(String(data.idade).trim(), 10) : 0) 
          : data.idade || 0,
        ddd: data.ddd.replace(/\D/g, ''),
        cellphone: data.cellphone.replace(/\D/g, ''),
        cep: data.cep.replace(/\D/g, ''),
        cpf: data.cpf.replace(/\D/g, ''),
        documento_responsavel: data.documento_responsavel?.replace(/\D/g, '') || '',
        ddd_responsavel: data.ddd_responsavel?.replace(/\D/g, '') || '',
        cellphone_responsavel: data.cellphone_responsavel?.replace(/\D/g, '') || ''
      };
      // Formata data_nasc para dd/MM/yyyy se vier como 8 dígitos
      if (/^\d{8}$/.test(data.data_nasc)) {
        dataToSubmit.data_nasc = `${data.data_nasc.slice(0,2)}/${data.data_nasc.slice(2,4)}/${data.data_nasc.slice(4)}`;
      } else {
        dataToSubmit.data_nasc = data.data_nasc;
      }
      // Corrige alergia e medicamento
      if (data.alergia === 'Sim' && alergiaExtra) {
        dataToSubmit.alergia = `Sim - ${alergiaExtra}`;
      } else if (data.alergia === 'Sim') {
        dataToSubmit.alergia = 'Sim';
      }
      if (data.medicamento === 'Sim' && medicamentoExtra) {
        dataToSubmit.medicamento = `Sim - ${medicamentoExtra}`;
      } else if (data.medicamento === 'Sim') {
        dataToSubmit.medicamento = 'Sim';
      }
      
      // Log dados antes de enviar para a API
      console.log('Dados do formulário enviados:', dataToSubmit);
      
      // Determina se é um novo perfil verificando se tem campos essenciais preenchidos no initialData
      const isNewProfile = !initialData?.name || !initialData?.cpf;
      console.log('É um novo perfil?', isNewProfile);
      
      // Usa o método apropriado com base na existência do perfil
      let updatedProfile;
      if (isNewProfile) {
        console.log('Criando novo perfil...');
        updatedProfile = await userService.createProfile(dataToSubmit);
      } else {
        console.log('Atualizando perfil existente...');
        updatedProfile = await userService.updateProfile(dataToSubmit);
      }
      
      // Exibe toast de sucesso
      if (typeof window !== 'undefined') {
        // Forçar exibição do toast com setTimeout
        setTimeout(() => {
          toast({
            title: 'Perfil atualizado',
            description: 'Suas informações foram salvas com sucesso!',
            variant: 'default'
          });
        }, 100);
      }

      if (redirectToEvent) {
        // Redireciona para a página de reserva em vez de checkout
        setTimeout(() => {
          router.push(`/reserva/${redirectToEvent}/${ticketKind}`);
        }, 1000);
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      
      // Trata erros da API para exibir mensagens mais amigáveis
      let errorMessage = 'Ocorreu um erro ao salvar suas informações. Tente novamente.';
      
      // Tenta extrair a mensagem de erro
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Verifica o caso específico do CPF já existente
      if (errorMessage.includes('CPF already exists') || 
          errorMessage.includes('User with this CPF already exists')) {
        errorMessage = 'Já existe um usuário cadastrado com este CPF.';
      }
      
      // Exibe toast de erro com timeout para garantir que seja exibido
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          // Tenta exibir toast
          toast({
            title: 'Erro ao atualizar perfil',
            description: errorMessage,
            variant: 'destructive'
          });
          
          // Fallback com alert caso o toast falhe
          setTimeout(() => {
            if (document.querySelectorAll('[role="status"]').length === 0) {
              window.alert(`Erro ao atualizar perfil: ${errorMessage}`);
            }
          }, 500);
        }, 100);
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, redirectToEvent, router, ticketKind, initialData, alergiaExtra, medicamentoExtra, form]);

  // Função para exibir detalhes sobre erros de validação
  const handleValidationErrors = (errors: any) => {
    console.error('Erros de validação:', errors);
    
    // Lista de campos com erro para exibir ao usuário
    const errorFields = Object.keys(errors).map(field => {
      const fieldError = errors[field];
      return `${field}: ${fieldError.message}`;
    }).join('\n');
    
    // Exibe no console detalhes completos para debugging
    console.log('Valores atuais do formulário:', form.getValues());
    
    // Usa setTimeout para garantir que o toast seja exibido
    setTimeout(() => {
      toast({
        title: 'Erro de validação',
        description: `Verifique os seguintes campos: ${errorFields}`,
        variant: 'destructive',
      });
    }, 100);
  };

  return {
    form,
    onSubmit,
    isSubmitting,
  };
}