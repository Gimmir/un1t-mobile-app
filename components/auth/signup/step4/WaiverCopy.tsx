import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export function WaiverCopy() {
  return (
    <View className="flex-1 mb-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true} indicatorStyle="white">
        <Text className="text-zinc-400 text-sm leading-6 mb-4">
          Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web
          designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have
          scrambled parts of Cicero&apos;s De Finibus Bonorum et Malorum for use in a type specimen book. It usually
          begins with:
        </Text>
        <Text className="text-zinc-400 text-sm leading-6 mb-4 italic">
          &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua.&quot;
        </Text>
        <Text className="text-zinc-400 text-sm leading-6 mb-4">
          The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.)
          that doesn&apos;t distract from the layout. A practice not without controversy, laying out pages with
          meaningless filler text can be very useful when the focus is meant to be on design, not content.
        </Text>
        <Text className="text-zinc-400 text-sm leading-6 mb-4">
          Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web
          designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have
          scrambled parts of Cicero&apos;s De Finibus Bonorum et Malorum for use in a type specimen book.
        </Text>
        <Text className="text-zinc-400 text-sm leading-6 mb-10">
          By checking the box below, you acknowledge that you have read, understood, and agree to be bound by these
          terms.
        </Text>
      </ScrollView>

      <View
        className="h-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#191919] to-transparent"
        pointerEvents="none"
      />
    </View>
  );
}

