/* eslint-disable react-native/no-inline-styles */
import {FlashList} from '@shopify/flash-list';
import React from 'react';
import {Text, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

const items = Array.from(Array(100).keys());

const Test1 = () => {
  const aref = useAnimatedRef();
  const scrollY = useSharedValue(0);
  const topContentHeight = 200;
  const contentHeight = useSharedValue(1000);
  const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

  //   const ScrollViewWithHeader = React.forwardRef(({children, ...props}, ref) => {
  //     return (
  //       <Animated.ScrollView ref={ref} {...props}>
  //         <View
  //           style={[
  //             {
  //               height: contentHeight.value + 56,
  //             },
  //             // scrollViewStyle,
  //           ]}
  //         />
  //         {children}
  //       </Animated.ScrollView>
  //     );
  //   });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      contentHeight.value =
        event.contentSize.height - event.layoutMeasurement.height;
      //   console.log(
      //     event.contentOffset.y + event.layoutMeasurement.height >=
      //       event.contentSize.height - 10,
      //   );
    },
  });

  useDerivedValue(() => {
    scrollTo(aref, 0, scrollY.value, false);
  });

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.y = scrollY.value;
      //   console.log(scrollY.value);
    },
    onActive: (event, context) => {
      scrollY.value = Math.min(
        contentHeight.value,
        Math.max(context.y - event.translationY, 0),
      );
      console.log(scrollY.value);
    },
    onEnd: event => {
      scrollY.value = withDecay({
        velocity: -event.velocityY,
        clamp: [0, contentHeight.value],
      });
    },
  });

  const headerStyleTab = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            // contentHeight.value,
            [0, topContentHeight],
            [0, -topContentHeight],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={{flex: 1}}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        {/* <AnimatedFlashList
          scrollEnabled={false}
          //   onScroll={scrollHandler}
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
        /> */}
        <Animated.View>
          <Animated.View
            style={[
              {
                position: 'absolute',
                height: 200,
                backgroundColor: 'blue',
                width: 200,
              },
              headerStyleTab,
            ]}
          />
          <Animated.FlatList
            onContentSizeChange={e => {
              console.log(e);
            }}
            renderScrollComponent={}
            // contentContainerStyle={{paddingTop: topContentHeight}}
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
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Test1;
