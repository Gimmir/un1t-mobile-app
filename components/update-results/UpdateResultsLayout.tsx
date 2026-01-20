import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UpdateResultsHeader } from './UpdateResultsHeader';
import { UpdateResultsHelpRow } from './UpdateResultsHelpRow';

type UpdateResultsLayoutProps = {
  headerTitle: string;
  onClose: () => void;
  children: React.ReactNode;
  helpText?: string;
  onHelpPress?: () => void;
};

export function UpdateResultsLayout({
  headerTitle,
  onClose,
  children,
  helpText,
  onHelpPress,
}: UpdateResultsLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <UpdateResultsHeader title={headerTitle} onClose={onClose} topInset={insets.top} />
          <View style={styles.main}>{children}</View>
          {helpText && onHelpPress ? (
            <UpdateResultsHelpRow text={helpText} onPress={onHelpPress} />
          ) : null}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  main: {
    marginTop: 4,
  },
});
