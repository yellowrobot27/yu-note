import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  Container,
  Divider,
  InputField,
  Screen,
  Stack,
  Text,
} from '@/components/primitives';
import { StyledButton } from '@/components/StyledButton';
import { AppLogo } from '@/components/AppLogo';
import { router } from 'expo-router';
import { useAuthStore } from '@/state/useAuthStore';
import { colors } from '@/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const passwordInput = useRef<TextInput>(null);
  const confirmPasswordInput = useRef<TextInput>(null);

  const {
    isPasswordRecovery,
    isLoading,
    requestPasswordReset,
    updatePassword,
  } = useAuthStore();

  const handleSendResetLink = async () => {
    setMessage('');
    setError('');

    try {
      await requestPasswordReset(email.trim());
      setMessage('If an account exists for this email, a password reset link has been sent. CHECK SPAM!');
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not send a password reset link. Please try again.',
      );
    }
  };

  const handleUpdatePassword = async () => {
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await updatePassword(password);
      router.replace('/');
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not update your password. Please try again.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen padding="lg">
        <Container flex={1} maxWidth={440} align="center">
          <Stack gap="lg" flex={1} justify="center">
            {/* Brand header */}
            <Stack align="center" gap="sm">
              <AppLogo size={64} />
              <Text size="xl" weight="bold" color={colors.text}>YuNote</Text>
              <Text color={colors.textSecondary} align="center">
                Your thoughts, your next language.
              </Text>
            </Stack>

            <Divider spacing="lg" />

            {/* Recovery heading */}
            <Stack gap="sm">
              <Text size="xl" weight="bold" color={colors.text}>
                {isPasswordRecovery ? 'Choose a new password' : 'Reset your password'}
              </Text>
              <Text color={colors.textSecondary}>
                {isPasswordRecovery
                  ? 'Enter and confirm your new password.'
                  : 'We will email you a secure link to reset your password.'}
              </Text>
            </Stack>

            {/* Recovery form */}
            <Stack gap="md">
              {!isPasswordRecovery ? (
                <>
                  <InputField
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    returnKeyType="done"
                    onSubmitEditing={handleSendResetLink}
                    error={error || undefined}
                    testID="email-input"
                  />
                  {message ? (
                    <Text color={colors.textSecondary}>{message}</Text>
                  ) : null}
                  <StyledButton
                    label="Send reset link"
                    onPress={handleSendResetLink}
                    isLoading={isLoading}
                    testID="send-reset-link-button"
                  />
                </>
              ) : (
                <>
                  <InputField
                    label="New password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your new password"
                    secureTextEntry
                    inputRef={passwordInput}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordInput.current?.focus()}
                    error={error || undefined}
                    testID="new-password-input"
                  />
                  <InputField
                    label="Confirm new password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Enter your new password again"
                    secureTextEntry
                    inputRef={confirmPasswordInput}
                    returnKeyType="done"
                    onSubmitEditing={handleUpdatePassword}
                    testID="confirm-new-password-input"
                  />
                  <StyledButton
                    label="Update password"
                    onPress={handleUpdatePassword}
                    isLoading={isLoading}
                    testID="update-password-button"
                  />
                </>
              )}
            </Stack>

            <Pressable
              onPress={() => router.replace('/login')}
              accessibilityRole="link"
            >
              <Text color={colors.textSecondary} align="center">
                Remembered your password?{' '}
                <Text color={colors.emphasis} weight="bold">Log in</Text>
              </Text>
            </Pressable>

            {/* Footer */}
            <Text color={colors.textSecondary} size="sm" align="center">
              Write. Discover. Remember.
            </Text>
          </Stack>
        </Container>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: colors.background,
  },
});


