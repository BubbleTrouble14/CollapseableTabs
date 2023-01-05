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

const Tab1 = ({listContentHeight, scrollY, hHeight, route}) => {
  const isFocused = useIsFocused();
  console.log(route.name, isFocused);

  const aref = useAnimatedRef();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      listContentHeight.value =
        event.contentSize.height - event.layoutMeasurement.height;
    },
  });

  useDerivedValue(() => {
    scrollTo(aref, 0, Math.max(scrollY.value - hHeight.value, 0), false);
  }, [scrollY, hHeight]);

  return (
    <Animated.FlatList
      contentOffset={{x: 0, y: Math.max(scrollY.value - hHeight.value, 0)}}
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

export default Tab1;
