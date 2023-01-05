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

const Test2 = () => {
  const {width, height} = useWindowDimensions();
  const aref = useAnimatedRef();
  const scrollY = useSharedValue(0);
  const topContentHeight = useSharedValue(0);
  const [topContentOffset, setTopContentOffset] = useState(0);
  const pulldownDistance = useSharedValue(0);
  const listContentHeight = useSharedValue(1000);
  const [refreshing, setRefreshing] = useState(false);
  const _refreshing = useSharedValue(false);
  const pulldownThresholdHeight = 100;
  const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

  const ScrollViewWithHeader = React.forwardRef(({children, ...props}, ref) => {
    return (
      <Animated.ScrollView ref={ref} {...props}>
        <View
          style={[
            {
              height: 56,
            },
            // scrollViewStyle,
          ]}
        />
        {children}
      </Animated.ScrollView>
    );
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      listContentHeight.value =
        event.contentSize.height - event.layoutMeasurement.height;
      //   console.log(
      //     event.contentOffset.y + event.layoutMeasurement.height >=
      //       event.contentSize.height - 10,
      //   );
    },
  });

  useEffect(() => {
    if (refreshing) {
      setTimeout(() => {
        _refreshing.value = false;
        pulldownDistance.value = withSpring(0, {overshootClamping: true});
        setRefreshing(false);
      }, 1000);
    }
  }, [refreshing]);

  useDerivedValue(() => {
    scrollTo(
      aref,
      0,
      Math.max(scrollY.value - topContentHeight.value, 0),
      false,
    );
  });

  const updateRefreshing = () => {
    setRefreshing(true);
  };

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.y = scrollY.value;
      //   console.log(scrollY.value);
    },
    onActive: (event, context) => {
      scrollY.value = Math.min(
        listContentHeight.value,
        Math.max(context.y - event.translationY, 0),
      );
      if (context.y - event.translationY < 0) {
        pulldownDistance.value = -(context.y - event.translationY / 4);
      }
      // console.log(scrollY.value);
    },
    onEnd: event => {
      scrollY.value = withDecay({
        velocity: -event.velocityY,
        clamp: [0, listContentHeight.value],
      });
      if (pulldownDistance.value > 0) {
        if (pulldownDistance.value >= pulldownThresholdHeight) {
          _refreshing.value = true;
          runOnJS(updateRefreshing)();
          pulldownDistance.value = withSpring(pulldownThresholdHeight, {
            overshootClamping: true,
          });
        } else {
          pulldownDistance.value = withSpring(0, {overshootClamping: true});
        }
      }
    },
  });

  const headerStyleTab = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            // contentHeight.value,
            [0, topContentHeight.value],
            [0, -topContentHeight.value],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const scrollViewStyle = useAnimatedStyle(() => {
    return {
      top: topContentHeight.value,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            // contentHeight.value,
            [0, topContentHeight.value],
            [0, -topContentHeight.value],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const pullDownRefresh = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: pulldownDistance.value,
        },
      ],
    };
  });

  const refreshStyle = useAnimatedStyle(() => {
    return {
      // display: _refreshing ? 'flex' : 'none',
      transform: [
        {
          translateY: interpolate(
            pulldownDistance.value,
            // contentHeight.value,
            [0, pulldownThresholdHeight],
            [-pulldownThresholdHeight, pulldownThresholdHeight],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  // const refreshBarHeight = Animated.interpolate(pulldownDistance, {
  //   inputRange: [0, 200],
  //   outputRange: [0, 200],
  //   extrapolate: 'clamp',
  // });

  return (
    <View style={{flex: 1}}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View>
          <Animated.View style={[{position: 'absolute'}, refreshStyle]}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text>Hello</Text>
            </View>
          </Animated.View>
          <Animated.View style={pullDownRefresh}>
            <Animated.View
              onLayout={evt => {
                const {height} = evt.nativeEvent.layout;
                if (topContentOffset === 0) {
                  topContentHeight.value = height;
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
              <View style={{padding: 10}}>
                <View style={{height: 30, backgroundColor: 'green'}} />
                <ExpandableText
                  topContentHeight={topContentHeight}
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
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Test2;
