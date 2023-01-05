/* eslint-disable react-native/no-inline-styles */
import {FlashList} from '@shopify/flash-list';
import React, {useEffect, useState} from 'react';
import {Text, useWindowDimensions, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import ExpandableText from './ExpandableText';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const items = Array.from(Array(100).keys());
const Tab = createMaterialTopTabNavigator();

const Test3 = () => {
  const {width, height} = useWindowDimensions();
  const aref = useAnimatedRef();
  const [topContentOffset, setTopContentOffset] = useState(0);
  const pulldownDistance = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);
  const _refreshing = useSharedValue(false);
  const pulldownThresholdHeight = 100;
  const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

  const rHeight = useSharedValue(100);
  const rThresholdHeight = useSharedValue(20);
  const hHeight = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const listContentHeight = useSharedValue(1000);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      listContentHeight.value =
        event.contentSize.height - event.layoutMeasurement.height;
    },
  });

  // useEffect(() => {
  //   if (refreshing) {
  //     setTimeout(() => {
  //       _refreshing.value = false;
  //       pulldownDistance.value = withSpring(0, {overshootClamping: true});
  //       setRefreshing(false);
  //     }, 1000);
  //   }
  // }, [refreshing]);

  useDerivedValue(() => {
    scrollTo(aref, 0, Math.max(scrollY.value - hHeight.value, 0), false);
  });

  const updateRefreshing = () => {
    setRefreshing(true);
  };

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.y = scrollY.value;
      console.log(scrollY.value);
      //   console.log(scrollY.value);
    },
    onActive: (event, context) => {
      if (scrollY.value <= 0) {
        scrollY.value = context.y - event.translationY / 2;
      } else {
        scrollY.value = Math.min(
          listContentHeight.value,
          context.y - event.translationY,
        );
      }
    },
    onEnd: event => {
      if (scrollY.value < 0) {
        scrollY.value = withSpring(0, {
          overshootClamping: true,
        });
        console.log('refresh');
      } else {
        scrollY.value = withDecay({
          velocity: -event.velocityY,
          clamp: [0, listContentHeight.value],
        });
      }
    },
  });

  const headerStyleTab = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: Math.max(-scrollY.value, -hHeight.value),
        },
      ],
    };
  });

  const scrollViewStyle = useAnimatedStyle(() => {
    return {
      top: hHeight.value,
      transform: [
        {
          translateY: Math.max(-scrollY.value, -hHeight.value),
        },
      ],
    };
  });

  return (
    <View style={{flex: 1}}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View>
          {/* <Animated.View style={[{position: 'absolute'}, refreshStyle]}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text>Hello</Text>
            </View>
          </Animated.View> */}
          {/* <Animated.View style={pullDownRefresh}> */}
          <Animated.View
            onLayout={evt => {
              const {height} = evt.nativeEvent.layout;
              if (topContentOffset === 0) {
                hHeight.value = height;
                setTopContentOffset(height);
              }
              // setMeasuredHeight(height);
            }}
            style={[
              {
                position: 'absolute',
                width,
              },
              headerStyleTab,
            ]}>
            {/* <View style={{height: rHeight.value}} /> */}
            <View style={{padding: 10}}>
              <View style={{height: 30, backgroundColor: 'green'}} />
              <ExpandableText
                topContentHeight={hHeight}
                topContentOffset={topContentOffset}
              />
              <View style={{height: 50, backgroundColor: 'orange'}} />
            </View>
          </Animated.View>
          {topContentOffset !== 0 && (
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  height,
                  width,
                },
                scrollViewStyle,
              ]}>
              {/* <Tab.Navigator screenOptions={{swipeEnabled: false}}>
                <Tab.Screen name="List1" component={List} />
                <Tab.Screen name="List2" component={List} />
              </Tab.Navigator> */}
              <Animated.FlatList
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
          )}
          {/* </Animated.View> */}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Test3;
