import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@/theme';
import { createNote } from '@/services/noteService';
import { Icon, InputField, Row, Screen, Stack, Text } from '@/components/primitives';
import { StyledButton } from '@/components/StyledButton';

export default function NewNoteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const titleInput = useRef<TextInput>(null);
  const contentInput = useRef<TextInput>(null);

  const handleSave = async () => {
    if (isSaving) return;
    setSaveError('');
    setIsSaving(true);
    try {
      await createNote(title, content);
      router.replace('/');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen padding="lg" backgroundColor={colors.background}>
        <Stack gap="lg" flex={1}>
          <Row justify="space-between">
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={10}
              style={styles.backButton}
            >
              <Icon name="arrow-back" color={colors.primary} />
            </Pressable>

            <Text size="lg" weight="bold" color={colors.text}>New note</Text>

            <StyledButton
              label="Save"
              onPress={handleSave}
              isLoading={isSaving}
              fullWidth={false}
              testID="save-note-button"
            />
          </Row>

          {saveError ? <Text color={colors.error}>{saveError}</Text> : null}

          <Stack gap="md" flex={1}>
            <InputField
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Give your note a title"
              inputRef={titleInput}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => contentInput.current?.focus()}
              testID="note-title-input"
            />
            <InputField
              label="Content"
              value={content}
              onChangeText={setContent}
              placeholder="Start writing…"
              inputRef={contentInput}
              multiline
              containerStyle={styles.contentField}
              inputStyle={styles.contentInput}
              testID="note-content-input"
            />
          </Stack>
        </Stack>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 44,
    height: 52,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  contentField: {
    flex: 1,
  },
  contentInput: {
    flex: 1,
    padding: spacing.md,
  },
});



