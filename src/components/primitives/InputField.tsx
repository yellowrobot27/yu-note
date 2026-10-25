import { TextInput, View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '../../theme';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  testID?: string;
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  testID,
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
