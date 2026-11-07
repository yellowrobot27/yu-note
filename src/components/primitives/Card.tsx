import { colors } from '@/theme';
import { View, Pressable, StyleSheet } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  backgroundColor?: string;
  onPress?: () => void;
}

export function Card({
  children,
  onPress,
  backgroundColor = colors.cardBackground
}: CardProps) {
  if (onPress !== undefined) {
    return (
      <Pressable onPress={onPress} style={[
        styles.base,
        { backgroundColor }
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[
      styles.base,
      { backgroundColor }
      ]}
    >
      {children}
    </View>;
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'stretch',
    overflow: 'hidden',
    borderRadius: 14
  },
});


