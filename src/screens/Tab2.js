import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
} from 'react-native-reanimated';

const items = Array.from(Array(100).keys());

const Tab2 = ({listContentHeight, scrollY, hHeight, route, navigation}) => {
  const isFocused = useIsFocused();
  console.log('Tab2 :', isFocused);

  const aref = useAnimatedRef();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      console.log('Scrolling Tab 2');

      listContentHeight.value =
        event.contentSize.height - event.layoutMeasurement.height;
    },
  });

  useDerivedValue(() => {
    console.log('Scroll to Tab 2');
    scrollTo(aref, 0, Math.max(scrollY.value - hHeight.value, 0), false);
  });

  return (
    <Animated.FlatList
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      onScroll={scrollHandler}
      ref={aref}
      data={items}
      ItemSeparatorComponent={() => <View style={{height: 10}} />}
      estimatedItemSize={20}
      renderItem={({index}) => {
        return (
          <View>
            <Text>Hello _ {index}</Text>
          </View>
        );
      }}
    />
  );
};

export default Tab2;
