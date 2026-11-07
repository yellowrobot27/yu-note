import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuthStore } from '@/state/useAuthStore';
import { Screen, Stack, Row, Text, EmptyState, Card } from '@/components/primitives';
import { StyledButton } from '@/components/StyledButton';
import { colors } from '@/theme';
import { AppLogo } from '@/components/AppLogo';
import { getNotes } from '@/services/noteService';
import type { Note } from '@/types';

export default function HomeScreen() {
  const { logout } = useAuthStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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


  useFocusEffect(
    useCallback(() => {
      void loadNotes();
    }, [loadNotes]),
  );

  return (
    <Screen padding="lg" backgroundColor={colors.background}>
      <Stack gap="lg">
        <Row justify="space-between">
          <AppLogo size={64} />
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
                <Card key={note.id} onPress={() => router.push(`/details/${note.id}`)}>
                  <Stack gap="sm" padding="md">
                    <Text size="lg" weight="bold" color={colors.text} numberOfLines={1}>
                      {note.title || 'Untitled note'}
                    </Text>
                    <Text color={colors.textSecondary} numberOfLines={3}>
                      {note.content || 'No content'}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  state: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
  },
});