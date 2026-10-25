import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView
} from 'react-native';
import {
  Text,
  Stack,
  InputField,
  Screen,
  Container,
  Divider
} from '@/components/primitives'
import { StyledButton } from '@/components/StyledButton';
import { AppLogo } from '@/components/AppLogo';
import { router } from 'expo-router';
import { useAuthStore } from '@/state/useAuthStore';
import { colors } from '@/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    setError('');

    try {
      await login(email.trim(), password);
      router.replace('/');
    } catch {
      setError('Invalid email or password.');
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

              <Text size="xl" weight="bold" color={colors.text}>
                YuNote
              </Text>

              <Text color={colors.textSecondary} align="center">
                Your thoughts, your next language.
              </Text>
            </Stack>

            <Divider spacing='lg' />

            {/* Login heading */}
            <Stack gap="sm">
              <Text size="xl" weight="bold" color={colors.text}>
                Welcome back
              </Text>

              <Text color={colors.textSecondary}>
                Pick up where your learning journey left off.
              </Text>
            </Stack>

            {/* Login form */}
            <Stack gap="md">
              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                testID="email-input"
              />

              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={error || undefined}
                testID="password-input"
              />

              <Pressable
                onPress={() => router.push('/forgot-password')}
                accessibilityRole="link"
              >
                <Text
                  color={colors.emphasis}
                  weight="medium"
                  align="right"
                >
                  Forgot password?
                </Text>
              </Pressable>

              <StyledButton
                label="Log in"
                onPress={handleLogin}
                isLoading={isLoading}
                testID="login-button"
              />
            </Stack>

            {/* Registration link */}
            <Pressable
              onPress={() => router.push('/register')}
              accessibilityRole="link"
            >
              <Text color={colors.textSecondary} align="center">
                New to YuNote?{' '}
                <Text color={colors.emphasis} weight="bold">
                  Create an account
                </Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
    backgroundColor: colors.background,
  }
});
