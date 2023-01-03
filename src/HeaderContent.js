/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Image, ImageBackground, Pressable, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const HeaderContent = ({
  descDefaultHeight,
  contentStartHeight,
  onLayout,
  contentHeight,
  bannerImageHeight,
  collectionImageSize,
  width,
}) => {
  // const descDefaultHeight = 62;

  const animationHeight = useSharedValue(descDefaultHeight);

  const [showMore, setShowMore] = useState(true);
  const [measuredHeight, setMeasuredHeight] = useState();

  const [textHeight, setTextHeight] = useState(0);

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
      contentHeight.value = contentStartHeight + height - descDefaultHeight;
    },
  );

  return (
    <View
      onLayout={onLayout}
      style={{
        // backgroundColor: theme.colors.background,
        backgroundColor: 'white',
        // borderBottomColor: 'black',
        // borderBottomWidth: 1,
      }}>
      <ImageBackground
        source={{
          uri: 'https://www.chiafriends.xyz/_next/static/media/cf_tiled@2x.c7dd14f6.png',
        }}
        resizeMode="cover"
        style={{
          height: bannerImageHeight,
          width: '100%',
          resizeMode: 'cover',
        }}>
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.5)', '#fff']}
          style={{
            // flex: 1,
            justifyContent: 'center',
            height: bannerImageHeight + 1,
          }}
        />
      </ImageBackground>
      <View
        style={{
          height: collectionImageSize / 2,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      />
      <View
        style={{
          paddingHorizontal: 8,
          marginTop: 8,
          // height: descHeight,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text fontSize="large" style={{marginEnd: 4}}>
            ChiaFriends
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Text style={{marginEnd: 2}} fontSize="small" variant="thin">
            By
          </Text>
          <Image
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              marginEnd: 2,
            }}
            source={{
              uri: 'https://assets.mainnet.mintgarden.io/profiles/28131414fed2de3b03cb4b6d851f06492aaa905d9e7aa28ec227c072d839696e.webp',
            }}
          />
          <Text fontSize="small">Chia Network</Text>
        </View>
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
                Display your Chia Friend PFP on Twitter and more to help spread
                the news about building projects on our new NFT standard.
                There’s also a puzzle embedded in the collection for the
                community to discover…that’s your only hint for now!
              </Text>
              <Pressable
                onPress={() => {
                  setShowMore(true);
                  animationHeight.value = withTiming(descDefaultHeight, {
                    duration: 500,
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
                    duration: 500,
                  });
                }}>
                <View style={{backgroundColor: 'white'}}>
                  <Text style={{fontWeight: 'bold'}}>...more</Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
        {/* {!showMore && (
          <View>
            <Pressable
              onPress={() => {
                setShowMore(true);
                animationHeight.value = withTiming(62);
                contentHeight.value = withTiming(contentHeightDefault);
              }}
            >
              <Text>less</Text>
            </Pressable>
          </View>
        )} */}
      </View>
    </View>
  );
};

export default HeaderContent;
