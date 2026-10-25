import { View, Text as RNText, StyleSheet } from 'react-native';
import { colors } from '@/theme';

interface AppLogoProps {
  size?: number;
  backgroundColor?: string;
  color?: string;
  character?: string;
  borderRadius?: number;
}

export function AppLogo({
  size = 64,
  backgroundColor = colors.primary,
  color = colors.white,
  character = '语',
  borderRadius,
}: AppLogoProps) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="YuNote logo"
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: borderRadius ?? size * 0.28,
          backgroundColor,
          borderColor: colors.border,
        },
      ]}
    >
      <RNText
        allowFontScaling={false}
        style={[
          styles.character,
          {
            fontSize: size * 0.52,
            color,
          },
        ]}
      >
        {character}
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  character: {
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
