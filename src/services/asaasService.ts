
import { supabase } from '@/integrations/supabase/client';

const API_KEY = import.meta.env.VITE_ASAAS_API_KEY;
const API_URL = import.meta.env.VITE_ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';

export const asaasService = {
  /**
   * Note: Direct client-side calls to Asaas API will likely fail due to CORS.
   * In a production SaaS, these calls should be routed through Supabase Edge Functions.
   */
  
  createCustomer: async (name: string, email: string, cpfCnpj: string) => {
    // This is a placeholder for the logic that will eventually live in an Edge Function
    console.log('Creating Asaas customer...', { name, email, cpfCnpj });
    return { id: 'cus_placeholder' };
  },

  createSubscription: async (customerId: string, planId: string) => {
    console.log('Creating Asaas subscription...', { customerId, planId });
    return { id: 'sub_placeholder', status: 'active' };
  },

  getPaymentLink: async (value: number, name: string) => {
    const returnUrl = `${window.location.origin}/obrigado`;
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('asaas-payment-checkout', {
        body: { name, value, returnUrl }
      });

      if (error) {
        console.error('Invoke Error:', error);
        throw new Error('Falha na comunicação com o servidor de pagamento');
      }

      if (!data || !data.success) {
        console.error('Asaas Error Detail:', data);
        const asaasError = data?.data?.errors?.[0]?.description || 
                           data?.error || 
                           'Erro ao gerar link de pagamento no Asaas';
        throw new Error(asaasError);
      }

      const paymentUrl = data.data?.url || data.data?.invoiceUrl;
      if (!paymentUrl) {
        throw new Error('URL de pagamento não encontrada na resposta');
      }

      return paymentUrl; 
    } catch (error) {
      console.error('Error in getPaymentLink:', error);
      throw error;
    }
  }
};
