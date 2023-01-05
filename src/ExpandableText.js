/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const ExpandableText = ({
  defaultHeight = 40,
  topContentHeight,
  topContentOffset,
}) => {
  const [showMore, setShowMore] = useState(true);
  const [measuredHeight, setMeasuredHeight] = useState();
  const animationHeight = useSharedValue(defaultHeight);

  const textStyle = useAnimatedStyle(() => {
    return {
      height: animationHeight.value,
    };
  }, [animationHeight]);

  useAnimatedReaction(
    () => {
      return animationHeight.value;
    },
    height => {
      topContentHeight.value = topContentOffset + height - defaultHeight;
    },
  );

  return (
    <View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        style={[{height: 62}, textStyle]}>
        <View
          onLayout={evt => {
            const {height} = evt.nativeEvent.layout;
            setMeasuredHeight(height);
          }}>
          <Text variant="thin">
            Display your Chia Friend PFP on Twitter and more to help spread the
            news about building projects on our new NFT standard. There’s also a
            puzzle embedded in the collection for the community to
            discover…that’s your only hint for now! Display your Chia Friend PFP
            on Twitter and more to help spread the news about building projects
            on our new NFT standard. There’s also a puzzle embedded in the
            collection for the community to discover…that’s your only hint for
            now!
          </Text>
          <Pressable
            onPress={() => {
              setShowMore(true);
              animationHeight.value = withTiming(defaultHeight, {
                duration: 200,
              });
            }}>
            <Text style={{fontWeight: 'bold'}}>less</Text>
          </Pressable>
        </View>
      </Animated.ScrollView>
      {showMore && (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0.7, y: 0}}
            style={{width: 36}}
            colors={['transparent', 'white']}
          />
          <Pressable
            onPress={() => {
              setShowMore(false);
              animationHeight.value = withTiming(measuredHeight, {
                duration: 200,
              });
            }}>
            <View style={{backgroundColor: 'white'}}>
              <Text style={{fontWeight: 'bold'}}>...more</Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ExpandableText;
