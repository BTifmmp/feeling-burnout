import React from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MySafeAreaViewProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  edges?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
}

export default function SafeAreaView({
  children,
  className,
  edges = { top: false, bottom: false, left: false, right: false },
  ...rest
}: MySafeAreaViewProps) {
  const insets = useSafeAreaInsets();

  const paddingStyle = {
    paddingTop: edges.top ? insets.top : 0,
    paddingBottom: edges.bottom ? insets.bottom : 0,
    paddingLeft: edges.left ? insets.left : 0,
    paddingRight: edges.right ? insets.right : 0,
  };

  return (
    <View className={className} style={paddingStyle} {...rest}>
      {children}
    </View>
  );
}
