import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../src/state/useAuthStore';
import { colors, spacing } from '../src/theme';
import { StyledButton } from '@/components/StyledButton';

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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screen}>
          {/* Brand */}
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoCharacter}>语</Text>
            </View>

            <Text style={styles.wordmark}>YuNote</Text>

            <Text style={styles.tagline}>
              Your thoughts, your next language.
            </Text>
          </View>

          {/* Welcome */}
          <View style={styles.welcome}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.description}>
              Pick up where your learning journey left off.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                accessibilityLabel="Email address"
                testID="email-input"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textPlaceholder}
                secureTextEntry
                autoComplete="current-password"
                accessibilityLabel="Password"
                testID="password-input"
                onSubmitEditing={handleLogin}
                returnKeyType="go"
              />
            </View>

            <Pressable
              style={styles.forgotPassword}
              onPress={() => router.push('/forgot-password')}
              accessibilityRole="link"
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            {error !== '' && (
              <Text style={styles.error}>{error}</Text>
            )}

			<StyledButton
				label="Log in"
				onPress={handleLogin}
				isLoading={isLoading}
				testID="login-button"
			/>
          </View>

          {/* Register redirect */}
          <View style={styles.redirect}>
            <Text style={styles.redirectText}>New to YuNote?</Text>

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

        <Text style={styles.footer}>
          Write. Discover. Remember.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 24,
    paddingBottom: 16,
  },
  screen: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    flexGrow: 1,
  },

  // Branding
  brand: {
    alignItems: 'center',
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
    marginTop: 16,
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Welcome copy
  welcome: {
    marginTop: 48,
    marginBottom: 32,
  },
  heading: {
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  // Inputs
  form: {
    width: '100%',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    marginLeft: 2,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.text,
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 0,
    fontSize: 13,
    color: colors.text,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 28,
    paddingVertical: 2,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.emphasis,
  },
  error: {
    marginBottom: 12,
    fontSize: 12,
    color: '#B42318',
  },

  // Primary button
  loginButton: {
    height: 52,
    width: '100%',
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },

  // Registration
  redirect: {
    alignItems: 'center',
    marginTop: 40,
    gap: 8,
  },
  redirectText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  redirectAction: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.emphasis,
  },

  // Footer
  footer: {
    marginTop: 32,
    fontSize: 10,
    lineHeight: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
