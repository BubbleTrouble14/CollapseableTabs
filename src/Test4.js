/* eslint-disable no-const-assign */
/* eslint-disable react-native/no-inline-styles */
import {FlashList} from '@shopify/flash-list';
import React, {useEffect, useRef, useState} from 'react';
import {StatusBar, Text, useWindowDimensions, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from 'react-native-gesture-handler';
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
import Tab1 from './screens/Tab1';
import Tab2 from './screens/Tab2';
import TabBar from './screens/TabBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const Test4 = () => {
  const {width, height} = useWindowDimensions();

  const inset = useSafeAreaInsets();

  const arefItems = useAnimatedRef();
  const arefActivity = useAnimatedRef();

  const [topContentOffset, setTopContentOffset] = useState(0);

  const toolBarHeight = 56;

  const onEndReached = useSharedValue(false);
  const hHeight = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const listContentHeight = useSharedValue(0);
  const currentScreen = useSharedValue(0);
  const [endHeight, setEndHeight] = useState(0);

  const scrollPosY = useDerivedValue(() => {
    const yPos = Math.max(scrollY.value - hHeight.value + inset.top, 0);
    // scrollTo(arefActivity, yPos, false);
    scrollTo(arefItems, 0, yPos, false);
    return yPos;
  }, [scrollY, hHeight, currentScreen]);

  // useDerivedValue(() => {
  //   if (currentScreen.value === 0) {
  // scrollTo(
  //   arefItems,
  //   0,
  //   Math.max(scrollY.value - hHeight.value + inset.top, 0),
  //   false,
  // );
  //   } else {
  // scrollTo(
  //   arefActivity,
  //   0,
  //   Math.max(scrollY.value - hHeight.value + inset.top, 0),
  //   false,
  // );
  //   }
  // }, [scrollY, hHeight, currentScreen]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      // console.log(event);
      // const percentageScrolled =
      //   contentOffset.y / (contentSize.height - contentSize.height);
      // console.log(
      //   event.layoutMeasurement.height,
      //   '    ',
      //   event.contentSize.height,
      // );

      // if (percentageScrolled >= 1) {
      //   console.log('End of list reached');
      // }
      // console.log(
      //   event.contentSize.height +
      //     hHeight.value -
      //     event.layoutMeasurement.height,
      // );
      // console.log(event.contentOffset.y);
      listContentHeight.value = event.contentOffset.y;
    },
  });

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.y = scrollY.value;
    },
    onActive: (event, context) => {
      if (scrollY.value <= 0) {
        scrollY.value = context.y - event.translationY / 2;
      } else {
        if (onEndReached.value) {
          scrollY.value = context.y - event.translationY / 2;
        } else {
          scrollY.value = context.y - event.translationY;
        }
        // scrollY.value = context.y - event.translationY;
      }
    },
    onEnd: event => {
      if (scrollY.value < 0) {
        scrollY.value = withSpring(0, {
          overshootClamping: true,
        });
      } else {
        // scrollY.value = withDecay({
        //   velocity: -event.velocityY,
        //   // clamp: [0, listContentHeight.value],
        // });
        if (onEndReached.value) {
          scrollY.value = withSpring(listContentHeight.value, {
            overshootClamping: true,
          });
          onEndReached.value = false;
        } else {
          scrollY.value = withDecay({
            velocity: -event.velocityY,
            // clamp: [0, listContentHeight.value],
          });
        }
      }
    },
  });

  const contentOffsetStype = useAnimatedStyle(() => {
    return {
      top: hHeight.value,
    };
  });

  const scrollViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: Math.max(-scrollY.value, -hHeight.value + inset.top),
        },
      ],
    };
  });

  return (
    <View style={{flex: 1, backgroundColor: 'blue'}}>
      <StatusBar backgroundColor="transparent" translucent />
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View>
          <Animated.View
            onLayout={evt => {
              const {height} = evt.nativeEvent.layout;
              if (topContentOffset === 0) {
                console.log(height);
                hHeight.value = height;
                setTopContentOffset(height);
              }
            }}
            style={[
              {
                position: 'absolute',
                width,
              },
              scrollViewStyle,
            ]}>
            <View style={{padding: 10}}>
              <View style={{height: 300, backgroundColor: 'green'}} />
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
                  height: height - inset.top,
                  width,
                },
                scrollViewStyle,
                contentOffsetStype,
              ]}>
              <Tab.Navigator
                screenOptions={{swipeEnabled: false}}
                tabBar={props => (
                  <TabBar
                    currentScreen={currentScreen}
                    arefActivity={arefActivity}
                    arefItems={arefItems}
                    scrollY={scrollY}
                    hHeight={hHeight}
                    toolBarHeight={toolBarHeight}
                    {...props}
                  />
                )}>
                <Tab.Screen name="List1">
                  {props => {
                    return (
                      <Tab1
                        size={500}
                        currentScreen={currentScreen}
                        screen={0}
                        ref={arefItems}
                        scrollHandler={scrollHandler}
                        listContentHeight={listContentHeight}
                        scrollY={scrollPosY}
                        onEndReached={onEndReached}
                        setEndHeight={setEndHeight}
                        hHeight={hHeight}
                        toolbarHeight={toolBarHeight}
                        inset={inset}
                        {...props}
                      />
                    );
                  }}
                </Tab.Screen>
                <Tab.Screen name="List2">
                  {props => {
                    return (
                      <Tab1
                        size={200}
                        screen={1}
                        currentScreen={currentScreen}
                        ref={arefActivity}
                        scrollHandler={scrollHandler}
                        listContentHeight={listContentHeight}
                        onEndReached={onEndReached}
                        scrollY={scrollY}
                        toolbarHeight={toolBarHeight}
                        setEndHeight={setEndHeight}
                        hHeight={hHeight}
                        inset={inset}
                        {...props}
                      />
                    );
                  }}
                </Tab.Screen>
              </Tab.Navigator>
            </Animated.View>
          )}
        </Animated.View>
      </PanGestureHandler>
      {/* <View
        style={{
          top: inset.top,
          left: 0,
          // position: 'absolute',
          backgroundColor: 'red',
          height: height - toolBarHeight - inset.top,
          wdith: 200,
        }}
      /> */}
    </View>
  );
};

export default Test4;
