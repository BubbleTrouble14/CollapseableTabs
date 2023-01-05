/* eslint-disable react-native/no-inline-styles */
import {FlashList} from '@shopify/flash-list';
import React, {useEffect, useState} from 'react';
import {Text, useWindowDimensions, View} from 'react-native';
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

const items = Array.from(Array(100).keys());
const Tab = createMaterialTopTabNavigator();

const Test4 = () => {
  const {width, height} = useWindowDimensions();
  const aref = useAnimatedRef();
  const aref1 = useAnimatedRef();

  const [topContentOffset, setTopContentOffset] = useState(0);
  const pulldownDistance = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);
  const _refreshing = useSharedValue(false);
  const pulldownThresholdHeight = 100;
  const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

  const toolbarHeight = 56;
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

  // useDerivedValue(() => {
  //   scrollTo(aref, 0, Math.max(scrollY.value - hHeight.value, 0), false);
  //   scrollTo(aref1, 0, Math.max(scrollY.value - hHeight.value, 0), false);
  // });

  const updateRefreshing = () => {
    setRefreshing(true);
  };

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.y = scrollY.value;
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
      } else {
        scrollY.value = withDecay({
          velocity: -event.velocityY,
          clamp: [0, listContentHeight.value],
        });
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
          translateY: Math.max(-scrollY.value, -hHeight.value),
        },
      ],
    };
  });

  // const contentOffsetStype = useAnimatedStyle(() => {
  //   return {
  //     top: hHeight.value,
  //   };
  // }, [hHeight]);

  // const scrollViewStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         translateY: Math.max(-scrollY.value, -hHeight.value),
  //       },
  //     ],
  //   };
  // }, [scrollY]);

  const TabBar = ({state, descriptors, navigation, position}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onTapNavigate = name => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // if (index === 0) {
              //   scrollRef1.current?.scrollToOffset({
              //     offset: scrollPos.value,
              //     animated: false,
              //   });
              // } else {
              //   scrollRef.current?.scrollToOffset({
              //     offset: scrollPos.value,
              //     animated: false,
              //   });
              // }
              navigation.navigate({name, merge: true});
            }
          };

          const tap = Gesture.Tap().onStart(() => {
            runOnJS(onTapNavigate)(route.name);
          });

          return (
            <GestureDetector key={index} gesture={Gesture.Race(tap)}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  height: 48,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    // backgroundColor: 'red',
                    // padding: 4,
                  }}>
                  {label}
                </Text>
                {/* <Animated.Text style={{ opacity }}>{label}</Animated.Text> */}
              </View>
            </GestureDetector>
          );
        })}
      </View>
    );
  };

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
                console.log(height);
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
              scrollViewStyle,
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
                contentOffsetStype,
              ]}>
              <Tab.Navigator
                screenOptions={{swipeEnabled: false}}
                tabBar={props => <TabBar {...props} />}>
                <Tab.Screen name="List1">
                  {props => {
                    return (
                      <Tab1
                        {...props}
                        listContentHeight={listContentHeight}
                        scrollY={scrollY}
                        hHeight={hHeight}
                      />
                    );
                  }}
                </Tab.Screen>
                <Tab.Screen name="List2">
                  {props => {
                    return (
                      <Tab1
                        {...props}
                        listContentHeight={listContentHeight}
                        scrollY={scrollY}
                        hHeight={hHeight}
                      />
                    );
                  }}
                </Tab.Screen>
              </Tab.Navigator>
            </Animated.View>
          )}
          {/* </Animated.View> */}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Test4;
