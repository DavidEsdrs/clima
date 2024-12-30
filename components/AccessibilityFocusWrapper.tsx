import { useRef, useCallback } from 'react';
import { View, AccessibilityInfo, findNodeHandle, ViewProps } from 'react-native';
import { ParamListBase, useFocusEffect } from '@react-navigation/native';

// Interface para as props do wrapper de acessibilidade
interface AccessibilityFocusWrapperProps extends ViewProps {
  children: React.ReactNode;
  shouldFocus: boolean;
  accessibilityLabel?: string;
}

// Componente wrapper para controlar o foco de acessibilidade
export const AccessibilityFocusWrapper: React.FC<AccessibilityFocusWrapperProps> = ({ 
  children, 
  shouldFocus, 
  accessibilityLabel = "Início do conteúdo principal",
  ...props 
}) => {
  const viewRef = useRef<View | null>(null);

  useFocusEffect(
    useCallback(() => {
      let timeout: NodeJS.Timeout;

      if (shouldFocus && viewRef.current) {
        const nodeHandle = findNodeHandle(viewRef.current);
        if (nodeHandle) {
          timeout = setTimeout(() => {
            AccessibilityInfo.setAccessibilityFocus(nodeHandle);
          }, 100);
        }
      }
      return () => {
        clearTimeout(timeout)
      };
    }, [shouldFocus])
  );

  return (
    <View
      ref={viewRef}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="header"
      {...props}
    >
      {children}
    </View>
  );
};