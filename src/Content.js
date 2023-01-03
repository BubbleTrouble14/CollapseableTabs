/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {FlashList} from '@shopify/flash-list';
import React, {useCallback, useRef, useState} from 'react';
import {
  Button,
  Image,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import data from './data';
import HeaderContent from './HeaderContent';

const Tab = createMaterialTopTabNavigator();
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const RowItem = ({item}) => {
  return (
    <View style={{paddingHorizontal: 4, height: 30}}>
      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          // width: width / numColumns - 8,
          borderColor: '#CACACA',
          borderWidth: 0.5,
          borderRadius: 8,
          flex: 1,
          // marginHorizontal: 4,
        }}>
        {/* <View
          style={{
            // backgroundColor: '#FFFFFF',
            borderRadius: 8,
            borderColor: 'grey',
            overflow: 'hidden',
            padding: 10,
          }}> */}
        <Text style={{marginLeft: 10}}>Hello</Text>
        {/* </View> */}
      </View>
    </View>
  );
};

// const RowItem = ({item}) => {
//   return (
//     <View style={{paddingHorizontal: 4}}>
//       <View
//         style={{
//           justifyContent: 'center',
//           alignContent: 'center',
//           // width: width / numColumns - 8,
//           borderColor: '#CACACA',
//           borderWidth: 0.5,
//           borderRadius: 8,
//           // marginHorizontal: 4,
//         }}>
//         <View
//           style={{
//             // backgroundColor: '#FFFFFF',
//             borderRadius: 8,
//             borderColor: 'grey',
//             overflow: 'hidden',
//           }}>
//           <Image
//             style={{
//               width: '100%',
//               aspectRatio: 1,
//               borderTopLeftRadius: 8,
//               borderTopRightRadius: 8,
//               //   overlayColor: theme.colors.background,
//             }}
//             source={{
//               uri: 'https://assets.mainnet.mintgarden.io/thumbnails/6be24489fded87fe62a35667e456201786ddda429df7f42527c4d86009a99b5e.png',
//             }}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };

const Content = () => {
  const scrollRef = useRef();
  const scrollRef1 = useRef();

  const {width} = useWindowDimensions();
  const scrollPos = useSharedValue(0);
  const contentHeight = useSharedValue(400);
  const inset = useSafeAreaInsets();

  const [estimatedItemsSize, setEstimatedItemSize] = useState(width);
  const [contentStartHeight, setStartContentHeight] = useState(0);

  const collectionImageSize = 120;
  const bannerImageHeight = 200;
  const yOffset = bannerImageHeight - collectionImageSize / 2;
  const descDefaultHeight = 54;
  const toolbarHeight = 56;
  const spacing = 4;

  const start = useSharedValue(0);

  const updateScrollOffset = val => {
    scrollRef.current?.scrollToOffset({
      offset: val,
      animated: false,
    });
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      start.value = scrollPos.value;
    })
    .onUpdate(e => {
      scrollPos.value = Math.max(
        Math.min(
          start.value - e.translationY,
          contentHeight.value - toolbarHeight - inset.top,
        ),
        0,
      );
      // runOnJS(updateScrollOffset)(20);
    })
    .onEnd(e => {
      // scrollPos.value = withDecay({velocity: e.velocityY});
    });

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: {height},
      },
    }) => {
      if (contentHeight.value === 0) {
        contentHeight.value = height;
        setStartContentHeight(height);
      }
    },
    [],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollPos.value = event.contentOffset.y;
    },
  });

  const headerStyleTab = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            Math.min(
              scrollPos.value,
              contentHeight.value - toolbarHeight - inset.top,
            ),
            // contentHeight.value,
            [0, contentHeight.value],
            [contentHeight.value, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  // const iconStyle = useAnimatedStyle(() => {
  //   return {
  //     borderWidth:
  //       Math.ceil(scrollPos.value, yOffset) >= yOffset + inset.top ? 0 : 0.6,
  //   };
  // });

  const toolbarStyle = useAnimatedStyle(() => {
    return {
      borderBottomColor: 'grey',
      borderBottomWidth:
        Math.ceil(scrollPos.value, yOffset) >= yOffset + inset.top ? 0.8 : 0,
      backgroundColor:
        Math.ceil(scrollPos.value, yOffset) >= yOffset + inset.top
          ? 'white'
          : 'transparent',
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollPos.value,
            [0, contentHeight.value],
            [0, -contentHeight.value],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: 'white',
      transform: [
        {
          translateY: interpolate(
            scrollPos.value,
            [0, yOffset + inset.top],
            [yOffset, -2],
            Extrapolation.CLAMP,
          ),
        },
        {
          translateX: interpolate(
            scrollPos.value,
            [0, yOffset + inset.top],
            [16 - 4, width / 2 - collectionImageSize / 2],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollPos.value,
            [0, yOffset + inset.top],
            [1, 0.35],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const renderItem = ({item}) => <RowItem item={item} />;

  const List = () => {
    return (
      <AnimatedFlashList
        ref={scrollRef}
        // numColumns={1}
        contentContainerStyle={{
          paddingTop: contentHeight.value + toolbarHeight + spacing * 2,
          paddingHorizontal: spacing,
        }}
        // contentContainerStyle={scrollViewContainerStyle}
        // renderScrollComponent={ScrollViewWithHeader}
        onScroll={scrollHandler}
        showscrollPoserticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{margin: spacing}} />}
        data={data}
        renderItem={renderItem}
        // onEndReached={loadMore}
        // onEndReachedThreshold={5}
        estimatedItemSize={30}
      />
    );
  };

  function MyTabBar({state, descriptors, navigation, position}) {
    return (
      <Animated.View
        style={[
          {
            top: 0,
            zIndex: 1,
            position: 'absolute',
            width: '100%',
            flexDirection: 'row',
          },
          headerStyleTab,
        ]}>
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
              if (index === 0) {
                scrollRef1.current?.scrollToOffset({
                  offset: scrollPos.value,
                  animated: false,
                });
              } else {
                scrollRef.current?.scrollToOffset({
                  offset: scrollPos.value,
                  animated: false,
                });
              }
              navigation.navigate({name, merge: true});
            }
          };

          const tap = Gesture.Tap().onStart(() => {
            runOnJS(onTapNavigate)(route.name);
          });

          return (
            <GestureDetector key={index} gesture={Gesture.Race(pan, tap)}>
              <View
                style={{
                  flex: 1,
                  // backgroundColor: theme.colors.background,
                  backgroundColor: 'white',
                  height: toolbarHeight,
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
      </Animated.View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="transparent" translucent />
      <Tab.Navigator
        screenOptions={{swipeEnabled: false}}
        tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen name="List1" component={List} />
        <Tab.Screen name="List2" component={List} />
      </Tab.Navigator>
      <View style={{position: 'absolute'}}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              backgroundColor: 'white',
              width: width,
              height: toolbarHeight + inset.top,
            },
            headerStyle,
          ]}>
          <HeaderContent
            bannerImageHeight={bannerImageHeight}
            collectionImageSize={collectionImageSize}
            width={width}
            contentStartHeight={contentStartHeight}
            contentHeight={contentHeight}
            descDefaultHeight={descDefaultHeight}
            onLayout={onLayout}
          />
        </Animated.View>
        <Animated.View
          style={[
            {
              position: 'absolute',
              height: toolbarHeight + inset.top,
              width: width,
              paddingTop: inset.top,
              justifyContent: 'center',
              paddingHorizontal: spacing,
            },
            toolbarStyle,
          ]}>
          <View style={{flexDirection: 'row'}}>
            <Button title="Back" />
            {/* <IconButton
              icon="chevron-back"
              color={theme.colors.background}
              animatedStyle={iconStyle}
              onPress={() => navigation.goBack()}
            /> */}
            <View style={{flex: 1}} />
            <Button title="Filter" />
          </View>
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              backgroundColor: 'white',
              borderRadius: 10,
              width: collectionImageSize,
              height: collectionImageSize,
            },
            imageStyle,
          ]}>
          <Image
            style={{flex: 1, margin: 4, borderRadius: 6}}
            source={{
              uri: 'https://assets.mainnet.mintgarden.io/thumbnails/34f03d6d638d7a88ee4ef22241a65cf4fbad6a9cc9273bb18927cfba95d46ead_512.png',
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default Content;
