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

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const passwordInput = useRef<TextInput>(null);
  const confirmPasswordInput = useRef<TextInput>(null);

  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    setPasswordError('');
    setConfirmPasswordError('');
    setConfirmationMessage('');

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    try {
      const authenticated = await register(email.trim(), password);
      if (authenticated) {
        router.replace('/');
      } else {
        setConfirmationMessage(
          'Check your email for a confirmation link. You can log in after confirming your address.'
        );
      }
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : 'Could not create your account. Please check your details and try again.'
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

            {/* Registration heading */}
            <Stack gap="sm">
              <Text size="xl" weight="bold" color={colors.text}>
                Create your account
              </Text>
              <Text color={colors.textSecondary}>
                Start turning your notes into Mandarin learning.
              </Text>
            </Stack>

            {/* Registration form */}
            <Stack gap="md">
              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                returnKeyType="next"
                onSubmitEditing={() => passwordInput.current?.focus()}
                testID="email-input"
              />
              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                inputRef={passwordInput}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInput.current?.focus()}
                error={passwordError || undefined}
                testID="password-input"
              />
              <InputField
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Enter password again"
                secureTextEntry
                inputRef={confirmPasswordInput}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                error={confirmPasswordError || undefined}
                testID="confirm-password-input"
              />
              <StyledButton
                label="Create account"
                onPress={handleRegister}
                isLoading={isLoading}
                testID="register-button"
              />
              {confirmationMessage ? (
                <Text color={colors.textSecondary} align="center">
                  {confirmationMessage}
                </Text>
              ) : null}
            </Stack>

            {/* Login link */}
            <Pressable
              onPress={() => router.push('/login')}
              accessibilityRole="link"
            >
              <Text color={colors.textSecondary} align="center">
                Already have an account?{' '}
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
