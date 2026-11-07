import { getCurrentUser } from '@/services/authService';
import { supabase } from '@/lib/supabase';
import type { Note } from '@/types';

function mapNote(row: Record<string, unknown>): Note {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    content: (row.content as string | null) ?? '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getNotes(): Promise<Note[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('notes')
    .select('id, user_id, title, content, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data.map(mapNote);
}
