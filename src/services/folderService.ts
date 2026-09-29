import { supabase } from '../lib/supabase';
import type { Folder } from '../types';

function mapFolder(row: Record<string, unknown>): Folder {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    parentFolderId: row.parent_folder_id as string | null,
    createdAt: row.created_at as string,
  };
}

export async function getFolders(): Promise<Folder[]> {
  const { data, error } = await supabase.from('folders').select('*').order('name');
  if (error) throw new Error(error.message);
  return data.map(mapFolder);
}

export async function createFolder(name: string, parentFolderId: string | null = null): Promise<Folder> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
      .from('folders')
      .insert({ name, parent_folder_id: parentFolderId, user_id: user!.id })
      .select()
      .single();
  if (error) throw new Error(error.message);
  return mapFolder(data);
}

export async function updateFolder(id: string, name: string): Promise<Folder> {
  const { data, error } = await supabase
      .from('folders')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
  if (error) throw new Error(error.message);
  return mapFolder(data);
}

export async function moveFolder(id: string, parentFolderId: string | null): Promise<Folder> {
  const { data, error } = await supabase
      .from('folders')
      .update({ parent_folder_id: parentFolderId })
      .eq('id', id)
      .select()
      .single();
  if (error) throw new Error(error.message);
  return mapFolder(data);
}

export async function deleteFolder(id: string): Promise<void> {
  const { error } = await supabase.from('folders').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
