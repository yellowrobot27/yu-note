import { Pressable, StyleSheet } from 'react-native';
import { Spinner } from './primitives/Spinner';
import { Text } from './primitives/Text';
import { colors, spacing } from '../theme';

interface StyledButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  testID?: string;
}

export function StyledButton({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  testID,
}: StyledButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isLoading && styles.pressed,
        isLoading && styles.disabled,
      ]}
      testID={testID}
    >
      {isLoading ? (
        <Spinner size="small" />
      ) : (
        <Text
          weight="medium"
          color={variant === 'primary'
            ? styles.primaryText.color
            : styles.secondaryText.color}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    width: '100%',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.65,
  },
});
