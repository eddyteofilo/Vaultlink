import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { cryptoService } from '@/services/cryptoService';
import { toast } from 'sonner';

export const useSecrets = (projectId: string | undefined) => {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['secrets', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('secrets')
        .select('*')
        .eq('project_id', projectId!)
        .order('position', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!projectId,
  });
};

export const useCreateSecret = () => {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (secret: {
      project_id: string;
      label: string;
      type: string;
      value: string;
      notes?: string;
    }) => {
      const { value, ...rest } = secret;
      const { data, error } = await supabase
        .from('secrets')
        .insert({
          ...rest,
          user_id: user!.id,
          value_encrypted: cryptoService.encrypt(value),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['secrets', data.project_id] });
      toast.success('Credencial salva!');
    },
    onError: () => toast.error('Erro ao salvar credencial'),
  });
};

export const useUpdateSecret = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value, project_id, ...updates }: {
      id: string;
      project_id: string;
      label?: string;
      type?: string;
      value?: string;
      notes?: string;
    }) => {
      const updateData: Record<string, unknown> = { ...updates };
      if (value) {
        updateData.value_encrypted = cryptoService.encrypt(value);
      }
      const { data, error } = await supabase
        .from('secrets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return { ...data, project_id };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['secrets', data.project_id] });
      toast.success('Credencial atualizada!');
    },
    onError: () => toast.error('Erro ao atualizar credencial'),
  });
};

export const useDeleteSecret = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from('secrets').delete().eq('id', id);
      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      qc.invalidateQueries({ queryKey: ['secrets', projectId] });
      toast.success('Credencial excluída!');
    },
    onError: () => toast.error('Erro ao excluir credencial'),
  });
};
