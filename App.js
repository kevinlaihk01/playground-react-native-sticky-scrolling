import { StatusBar } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  FlatList,
} from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";
import CustomScrollView from "./CustomScrollView";

const randomColor = () => {
  const color = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
  return `#${color}`;
};

const data = [...Array(60).keys()].map((i) => ({
  id: i,
  text: `Item ${i}`,
}));

const Item = ({ text /*, backgroundColor, */, isSticky }) => {
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setTicker((_ticker) => _ticker + 1),
      1000
    );

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={[styles.item, isSticky && styles.itemSticky]}>
      <Text style={styles.text}>
        {text} ({ticker})
      </Text>
    </View>
  );
};

const App = () => {
  const [stickyIndex, setStickyIndex] = useState(null);

  const [color, setColor] = useState(randomColor());

  const handleStickyIndex = (index) => {
    setStickyIndex(index);
    setColor(randomColor()); // reserved
  };

  const renderItem = useCallback(
    ({ item, index /*, separators */ }) => {
      return (
        <Item
          text={item.text}
          // backgroundColor={color}
          key={item.id}
          isSticky={stickyIndex === index}
        />
      );
    },
    [stickyIndex]
  );

  const keyExtractor = useCallback((item) => item.id, []);
  const renderScrollComponent = useCallback(
    (props) => (
      <CustomScrollView
        {...props}
        stickyHeaderIndices={[
          stickyIndex != null ? stickyIndex : Number.POSITIVE_INFINITY,
        ]}
      />
    ),
    [stickyIndex]
  );

  const flatListRef = useRef();

  const isStickyActive = stickyIndex != null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topControl}>
        <Button onPress={() => handleStickyIndex(null)} title="reset" />
        <Text>|</Text>
        <Button onPress={() => handleStickyIndex(0)} title="stick 0" />
        <Text>|</Text>
        <Button onPress={() => handleStickyIndex(1)} title="stick 1" />
        <Text>|</Text>
        <Button onPress={() => handleStickyIndex(5)} title="stick 5" />
        <Text>|</Text>
        <Button onPress={() => handleStickyIndex(9)} title="stick 9" />
      </View>
      <FlatList
        ref={flatListRef} // no use currently
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        automaticallyAdjustContentInsets={isStickyActive}
        renderScrollComponent={renderScrollComponent} // XXX HACK we hack the default ScrollView component used in FlatList > VirtualizedList
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  item: {
    backgroundColor: "#dddddd",
    padding: 20,
    marginVertical: 8,
  },
  itemSticky: {
    backgroundColor: "#ff0000",
  },
  topControl: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 20,
  },
});

export default App;
