import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/state/useAuthStore';
import { Screen, Stack, Row, Text, EmptyState, Card, Icon } from '@/components/primitives';
import { StyledButton } from '@/components/StyledButton';
import { colors, spacing } from '@/theme';
import { AppLogo } from '@/components/AppLogo';
import { deleteNote, getNotes } from '@/services/noteService';
import type { Note } from '@/types';

export default function HomeScreen() {
  const { logout } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      setNotes(await getNotes());
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not load your notes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteNote = async (id: string) => {
    if (deletingNoteId) return;
    setDeletingNoteId(id);
    setDeleteError('');
    try {
      await deleteNote(id);
      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
      setNoteToDelete(null);
    } catch (caughtError) {
      setDeleteError(caughtError instanceof Error ? caughtError.message : 'Could not delete this note.');
    } finally {
      setDeletingNoteId(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void loadNotes();
    }, [loadNotes]),
  );

  return (
    <View style={styles.root}>
      <Screen padding="lg" backgroundColor={colors.background}>
        <Stack gap="lg">
          <Row justify="space-between">
            <AppLogo size={64} />
            <Text size="xxl" weight="bold" color={colors.text}>YuNote</Text>
            <StyledButton
              label="Log out"
              variant="primary"
              fullWidth={false}
              onPress={logout}
              testID="logout-button"
            />
          </Row>

          <Stack gap="md">
            <Row justify="space-between">
              <Text size="xl" weight="bold" color={colors.text}>Your notebook</Text>
              <Text color={colors.textSecondary}>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</Text>
            </Row>

            {isLoading ? (
              <View style={styles.state}>
                <ActivityIndicator color={colors.primary} />
                <Text color={colors.textSecondary}>Loading your notes…</Text>
              </View>
            ) : error ? (
              <EmptyState
                title="Could not load notes"
                description={error}
                action={<StyledButton label="Try again" onPress={loadNotes} fullWidth={false} variant="secondary" />}
              />
            ) : notes.length === 0 ? (
              <EmptyState
                title="Your notebook is empty"
                description="Notes you create will show up here."
              />
            ) : (
              <Stack gap="md">
                {notes.map((note) => (
                  <Card key={note.id} testID="note-card">
                    <Stack gap="sm" padding="md">
                      <Row justify="space-between" gap="sm">
                        <Text size="lg" weight="bold" color={colors.text} numberOfLines={1}>
                          {note.title || 'Untitled note'}
                        </Text>
                        <Pressable
                          onPress={() => {
                            setNoteToDelete(note.id);
                            setDeleteError('');
                          }}
                          accessibilityRole="button"
                          accessibilityLabel={`Delete ${note.title || 'Untitled note'}`}
                          testID="delete-note-button"
                          hitSlop={8}
                          style={styles.deleteButton}
                        >
                          <Icon name="trash-outline" size={20} color={colors.error} />
                        </Pressable>
                      </Row>
                      <Text color={colors.textSecondary} numberOfLines={3}>
                        {note.content || 'No content'}
                      </Text>

                      {noteToDelete === note.id ? (
                        <Stack gap="sm">
                          <Text size="sm" color={colors.text}>Delete this note?</Text>
                          {deleteError ? <Text size="sm" color={colors.error}>{deleteError}</Text> : null}
                          <Row justify="flex-end" gap="md">
                            <Pressable
                              onPress={() => {
                                setNoteToDelete(null);
                                setDeleteError('');
                              }}
                              disabled={deletingNoteId === note.id}
                              accessibilityRole="button"
                              testID="cancel-delete-note-button"
                            >
                              <Text color={colors.textSecondary}>Cancel</Text>
                            </Pressable>
                            <Pressable
                              onPress={() => void handleDeleteNote(note.id)}
                              disabled={deletingNoteId === note.id}
                              accessibilityRole="button"
                              testID="confirm-delete-note-button"
                            >
                              <Text weight="bold" color={colors.error}>
                                {deletingNoteId === note.id ? 'Deleting…' : 'Delete'}
                              </Text>
                            </Pressable>
                          </Row>
                        </Stack>
                      ) : null}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Screen>

      <Pressable
        onPress={() => router.push('/notes/new')}
        accessibilityRole="button"
        accessibilityLabel="Create a note"
        style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
        testID="new-note-button"
      >
        <Icon name="add" size={30} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  state: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    elevation: 6,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
  },
});

