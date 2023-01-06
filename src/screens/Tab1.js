import {useIsFocused} from '@react-navigation/native';
import React, {forwardRef, useEffect, useMemo} from 'react';
import {Text, View, useWindowDimensions} from 'react-native';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
} from 'react-native-reanimated';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';

// const Tab1 = ({listContentHeight, scrollY, hHeight, route}) => {
//   const isFocused = useIsFocused();
//   console.log(route.name, isFocused);

//   const aref = useAnimatedRef();

//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: event => {
//       listContentHeight.value =
//         event.contentSize.height - event.layoutMeasurement.height;
//     },
//   });

//   // useDerivedValue(() => {
//   //   scrollTo(aref, 0, Math.max(scrollY.value - hHeight.value, 0), false);
//   // }, [scrollY, hHeight]);

//   return (
//     <Animated.FlatList
//       contentOffset={{x: 0, y: Math.max(scrollY.value - hHeight.value, 0)}}
//       showsVerticalScrollIndicator={false}
//       scrollEnabled={false}
//       onScroll={scrollHandler}
//       // ref={aref}
//       data={items}
//       ItemSeparatorComponent={() => <View style={{height: 10}} />}
//       estimatedItemSize={20}
//       renderItem={({index}) => {
//         return (
//           <View>
//             <Text>Hello _ {index}</Text>
//           </View>
//         );
//       }}
//     />
//   );
// };

const AnimatedRecyclerList = Animated.createAnimatedComponent(RecyclerListView);

const _dataProvider = new DataProvider((r1, r2) => {
  return r1 !== r2;
});

const renderScrollComponent = React.forwardRef((props, ref) => (
  <Animated.ScrollView {...props} ref={ref} />
));

const Tab1 = forwardRef((props, ref) => {
  const {width, height} = useWindowDimensions();
  const {
    scrollHandler,
    listContentHeight,
    onEndReached,
    size,
    setEndHeight,
    scrollY,
    hHeight,
    inset,
    toolbarHeight,
    screen,
    currentScreen,
  } = props;

  const items = Array.from(Array(size).keys());
  // endHeight = 30 * items;
  const newDataProvider = useMemo(() => {
    return _dataProvider.cloneWithRows(items);
  }, []);

  useDerivedValue(() => {
    if (currentScreen.value !== screen) {
      return;
    }
    console.log(scrollY.value + height, '   ', 30 * size);
    if (scrollY.value + height >= 30 * size) {
      console.log('end reached');
      onEndReached.value = true;
    }
  }, [scrollY]);

  // useEffect(() => {
  //   setEndHeight(30 * size);
  // }, []);

  const _layoutProvider = useMemo(() => {
    return new LayoutProvider(
      index => {
        return 1;
      },
      (type, dim) => {
        switch (type) {
          case 1:
            dim.width = width;
            dim.height = 30;
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      },
    );
  }, [width]);

  return (
    <AnimatedRecyclerList
      ref={ref}
      rowRenderer={(item, i) => {
        return (
          <View>
            <Text>Hello _ {i + 1}</Text>
          </View>
        );
      }}
      // onEndReached={() => {
      //   onEndReached.value = true;
      // }}
      onScroll={scrollHandler}
      externalScrollView={renderScrollComponent}
      dataProvider={newDataProvider}
      layoutProvider={_layoutProvider}
    />
    // <Animated.FlatList
    //   onContentSizeChange={(w, h) => {
    //     if (listContentHeight.value === 0) {
    //       listContentHeight.value = h;
    //     }
    //   }}
    //   showsVerticalScrollIndicator={false}
    //   scrollEnabled={false}
    //   onScroll={scrollHandler}
    //   ref={ref}
    //   data={items}
    //   ItemSeparatorComponent={() => <View style={{height: 10}} />}
    //   estimatedItemSize={20}
    //   renderItem={({index}) => {
    // return (
    //   <View>
    //     <Text>Hello _ {index}</Text>
    //   </View>
    // );
    //   }}
    // />
  );
});

export default Tab1;
