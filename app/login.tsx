
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../src/state/useAuthStore';
import { InputField } from '../src/components/primitives/InputField';
import { StyledButton } from '../src/components/StyledButton';
import { Stack } from '../src/components/primitives/Stack';
import { colors, spacing } from '../src/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    setError('');

    try {
      await login(email, password);
      router.replace('/');
    } catch {
      setError('Invalid email or password.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.screen}>
        <View style={styles.content}>
          {/* Logo and branding */}
          <Stack gap="sm" align="center">
            <View style={styles.logo}>
              <Text style={styles.logoCharacter}>语</Text>
            </View>

            <Text style={styles.wordmark}>YuNote</Text>

            <Text style={styles.tagline}>
              Your thoughts, your next language.
            </Text>
          </Stack>

          {/* Welcome copy */}
          <View style={styles.welcome}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Pick up where your learning journey left off.
            </Text>
          </View>

          {/* Login form */}
          <Stack gap="lg">
            <InputField
              label="Email address"
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
              testID="password-input"
              error={error !== '' ? error : undefined}
            />

            <Pressable
              style={styles.forgotPassword}
              onPress={() => router.push('/forgot-password')}
              accessibilityRole="link"
            >
              <Text style={styles.accentText}>
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

          {/* Registration redirect */}
          <View style={styles.redirect}>
            <Text style={styles.redirectText}>
              New to YuNote?
            </Text>

            <Pressable
              onPress={() => router.push('/register')}
              accessibilityRole="link"
            >
              <Text style={styles.redirectAction}>
                Create an account
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Write. Discover. Remember.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    justifyContent: 'space-between',
  },
  content: {
    width: '100%',
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCharacter: {
    fontSize: 58,
    lineHeight: 68,
    fontWeight: '500',
    color: colors.white,
    textAlign: 'center',
  },
  wordmark: {
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  welcome: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: -spacing.sm,
    paddingVertical: spacing.xs,
  },
  accentText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.accent,
  },
  redirect: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  redirectText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  redirectAction: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  footer: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
