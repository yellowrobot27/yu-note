import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Row, Stack, Text } from '@/components/primitives';
import { colors, spacing } from '@/theme';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISSED_KEY = 'yunote-install-prompt-dismissed-v1';

export function InstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const iosDevice =
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    setIsIos(iosDevice);

    if (isStandalone || window.localStorage.getItem(DISMISSED_KEY) === 'true') return;

    if (iosDevice) setIsVisible(true);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
      setIsVisible(true);
    };
    const handleAppInstalled = () => {
      setIsVisible(false);
      window.localStorage.setItem(DISMISSED_KEY, 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  const handleInstall = async () => {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }

    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    if (choice.outcome === 'accepted') {
      dismiss();
    } else {
      dismiss();
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Row justify="space-between" gap="md">
          <Stack gap="sm" flex={1}>
            <Text weight="bold" color={colors.text}>Install YuNote</Text>
            <Text size="sm" color={colors.textSecondary}>
              Add YuNote to your home screen for quick access to your notes.
            </Text>
          </Stack>
          <Pressable
            onPress={dismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss install prompt"
            hitSlop={8}
            style={styles.closeButton}
          >
            <Icon name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        </Row>

        {showIosInstructions ? (
          <Text size="sm" color={colors.textSecondary}>
            In Safari, tap Share, then choose “Add to Home Screen.”
          </Text>
        ) : null}

        <Row justify="flex-end" gap="md">
          {showIosInstructions ? (
            <Pressable onPress={dismiss} accessibilityRole="button">
              <Text weight="bold" color={colors.primary}>Got it</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => void handleInstall()}
              accessibilityRole="button"
              style={styles.installButton}
            >
              <Text weight="bold" color={colors.white}>Install</Text>
            </Pressable>
          )}
        </Row>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    zIndex: 1000,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.16)',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  installButton: {
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
});

