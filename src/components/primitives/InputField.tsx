import { TextInput, View, StyleSheet } from 'react-native';
import type { Ref } from 'react';
import { Text } from './Text';
import { colors, spacing } from '@/theme';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  testID?: string;
  inputRef?: Ref<TextInput>;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  testID,
  inputRef,
  returnKeyType,
  onSubmitEditing,
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      <Text size="sm" weight="medium" color={colors.text}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        secureTextEntry={secureTextEntry}
        ref={inputRef}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          error !== undefined && styles.inputError,
        ]}
        testID={testID}
      />

      {error !== undefined && (
        <Text size="sm" color={colors.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  input: {
    minHeight: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
});
