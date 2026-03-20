import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { cryptoService } from '@/services/cryptoService';
import { toast } from 'sonner';

export const useEntries = (projectId: string | undefined) => {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['entries', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('project_id', projectId!)
        .order('position', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!projectId,
  });
};

export const useCreateEntry = () => {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (entry: {
      project_id: string;
      app_name: string;
      url?: string;
      login?: string;
      password: string;
      notes?: string;
    }) => {
      const { password, ...rest } = entry;
      const { data, error } = await supabase
        .from('entries')
        .insert({
          ...rest,
          user_id: user!.id,
          password_encrypted: cryptoService.encrypt(password),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['entries', data.project_id] });
      toast.success('Acesso adicionado!');
    },
    onError: () => toast.error('Erro ao adicionar acesso'),
  });
};

export const useUpdateEntry = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, password, ...updates }: {
      id: string;
      project_id: string;
      app_name?: string;
      url?: string;
      login?: string;
      password?: string;
      notes?: string;
    }) => {
      const updateData: Record<string, unknown> = { ...updates };
      if (password) {
        updateData.password_encrypted = cryptoService.encrypt(password);
      }
      delete updateData.project_id;
      const { data, error } = await supabase
        .from('entries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['entries', data.project_id] });
      toast.success('Acesso atualizado!');
    },
    onError: () => toast.error('Erro ao atualizar acesso'),
  });
};

export const useDeleteEntry = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from('entries').delete().eq('id', id);
      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      qc.invalidateQueries({ queryKey: ['entries', projectId] });
      toast.success('Acesso excluído!');
    },
    onError: () => toast.error('Erro ao excluir acesso'),
  });
};
