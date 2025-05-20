// src/hooks/useApiRequest.ts

import { useState, useCallback } from 'react';

interface UseApiRequestReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  setSuccess: (message: string) => void;
  clearStatus: () => void;
}

/**
 * Hook personalizado para facilitar requisições à API
 * @param apiFunction - Função da API que será executada
 * @param initialData - Dados iniciais (opcional)
 * @param successMessage - Mensagem de sucesso para exibir após a execução (opcional)
 */
export function useApiRequest<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  initialData: T | null = null,
  successMessage: string = ''
): UseApiRequestReturn<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Função para limpar mensagens de status
  const clearStatus = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // Função para executar a requisição à API
  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setLoading(true);
      clearStatus();

      try {
        const result = await apiFunction(...args);
        setData(result);
        
        if (successMessage) {
          setSuccess(successMessage);
        }
        
        return result;
      } catch (err: any) {
        // Tratamento de erro
        const errorMessage = 
          err.response?.data?.message || 
          err.message || 
          'Ocorreu um erro na requisição';
        
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, successMessage, clearStatus]
  );

  return {
    data,
    loading,
    error,
    success,
    execute,
    setSuccess,
    clearStatus
  };
}