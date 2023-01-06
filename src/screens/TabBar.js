/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';

const TabBar = ({
  state,
  descriptors,
  navigation,
  currentScreen,
  arefActivity,
  arefItems,
  scrollY,
  hHeight,
  toolBarHeight,
}) => {
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
            if (currentScreen.value === 0) {
              arefActivity.current?.scrollToOffset({
                offset: Math.max(scrollY.value - hHeight.value, 0),
                animated: false,
              });
            } else {
              arefItems.current?.scrollToOffset({
                offset: Math.max(scrollY.value - hHeight.value, 0),
                animated: false,
              });
            }
            currentScreen.value = index;
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
                height: toolBarHeight,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
                {label}
              </Text>
            </View>
          </GestureDetector>
        );
      })}
    </View>
  );
};

export default TabBar;
