import { api, endpoints } from './api';
import type { UserProfile } from '@/types/user';

/**
 * Converte o formato de resposta do servidor para o formato usado na aplicação
 */
const processUserResponse = (data: any): UserProfile => {
  // Se tiver no formato enviado pelo servidor com _fieldsProto
  if (data.userId && data.userId._fieldsProto) {
    const userData = data.userId._fieldsProto;
    const processedData: Record<string, any> = {};
    
    // Processa cada campo convertendo para o tipo apropriado
    Object.keys(userData).forEach(key => {
      const field = userData[key];
      if (field.integerValue) {
        processedData[key] = parseInt(field.integerValue, 10);
      } else if (field.stringValue) {
        processedData[key] = field.stringValue;
      } else if (field.booleanValue !== undefined) {
        processedData[key] = field.booleanValue;
      }
    });
    
    return processedData as UserProfile;
  }
  
  // Se já estiver no formato esperado, retorna diretamente
  return data as UserProfile;
};

/**
 * Serviço para gerenciar operações relacionadas ao usuário
 */
const userService = {
  /**
   * Busca o perfil do usuário atual
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get(endpoints.users.profile);
      return processUserResponse(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // Retorna um perfil vazio se o usuário não existir
        throw error; // Propaga o erro para ser tratado pelo caller
      }
      throw error;
    }
  },

  /**
   * Verifica se o perfil do usuário existe
   */
  checkProfileExists: async (): Promise<boolean> => {
    try {
      await api.get(endpoints.users.profile);
      return true;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      throw error;
    }
  },

  /**
   * Cria um novo perfil de usuário
   */
  createProfile: async (profileData: UserProfile): Promise<UserProfile> => {
    try {
      console.log('Criando novo perfil com método POST');
      const response = await api.post(endpoints.users.profile, profileData);
      return processUserResponse(response.data);
    } catch (error: any) {
      console.error('Erro ao criar perfil:', error);
      
      // Captura a mensagem de erro da API para melhor tratamento
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        // Repassamos o erro com a mensagem original da API
        if (responseData.message) {
          const customError = new Error(responseData.message);
          // Preservamos os dados originais para análise
          customError.name = 'ApiError';
          // @ts-ignore
          customError.statusCode = responseData.statusCode || error.response.status;
          // @ts-ignore
          customError.originalError = error;
          // @ts-ignore
          customError.apiResponse = responseData;
          
          throw customError;
        }
      }
      
      // Se não conseguimos extrair uma mensagem específica, propagamos o erro original
      throw error;
    }
  },

  /**
   * Atualiza o perfil do usuário ou cria se não existir
   */
  updateProfile: async (profileData: UserProfile): Promise<UserProfile> => {
    try {
      // Verifica se o perfil existe
      const profileExists = await userService.checkProfileExists();
      
      // Se o perfil não existe, usa POST (criar), senão usa PATCH (atualizar)
      if (!profileExists) {
        console.log('Perfil não existe, redirecionando para createProfile');
        return await userService.createProfile(profileData);
      }
      
      console.log('Atualizando perfil existente com PATCH');
      try {
        const response = await api.patch(endpoints.users.update, profileData);
        return processUserResponse(response.data);
      } catch (error: any) {
        console.error('Erro ao atualizar perfil com PATCH:', error);
        
        // Captura a mensagem de erro da API para melhor tratamento
        if (error.response && error.response.data) {
          const responseData = error.response.data;
          
          // Repassamos o erro com a mensagem original da API
          if (responseData.message) {
            const customError = new Error(responseData.message);
            // Preservamos os dados originais para análise
            customError.name = 'ApiError';
            // @ts-ignore
            customError.statusCode = responseData.statusCode || error.response.status;
            // @ts-ignore
            customError.originalError = error;
            // @ts-ignore
            customError.apiResponse = responseData;
            
            throw customError;
          }
        }
        
        // Se não conseguimos extrair uma mensagem específica, propagamos o erro original
        throw error;
      }
    } catch (error: any) {
      console.error('Erro ao processar operação de perfil:', error);
      throw error;
    }
  }
};

export default userService;