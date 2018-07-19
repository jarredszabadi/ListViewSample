import React, { Component } from 'react';
import {sampleDataList} from './SampleData';
import Header from './Header'
import {
  AppRegistry,
  StyleSheet,
  Platform,
  View,
  ActivityIndicator,
  FlatList,
  Text,
  Image,
  Alert,
  YellowBox,
  StatusBar, } from 'react-native';
import Expo from 'expo';

export default class FlatListBasics extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <FlatList
//           data={sampleDataList}
//           renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
//         />
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//    flex: 1,
//    paddingTop: 22
//   },
//   item: {
//     padding: 10,
//     fontSize: 18,
//     height: 44,
//   },
// })

constructor(props) {
  super(props);
  this.state = {
    isLoading: true,
    page: 1
  }

  this.getIem = this.getItem.bind(this);

  YellowBox.ignoreWarnings([
   'Warning: componentWillMount is deprecated',
   'Warning: componentWillReceiveProps is deprecated',
 ]);

}

getItem (flower_name) {
    Alert.alert(flower_name);
}

FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: .5,
        width: "100%",
        backgroundColor: "#000",
      }}
    />
  );
}

remoteFetchData=()=>{
 this.setState({isLoading: true})
 const page = this.state.page
 return fetch(`http://food2fork.com/api/search?key=c8f48c08f338354d7d921317af9391c1&page=${page}`)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("ayy")
          this.setState({
            isLoading: false,
            dataSource: page === 1 ? responseJson.recipes  : [...this.state.dataSource, ...responseJson.recipes ],

          }, function() {
            // In this block you can do something with new state.
          });
        })
        .catch((error) => {
          console.error(error);
        });

}

handleLoadMore = () => {
  this.setState({page: this.state.page + 1});
  this.remoteFetchData()
}

handlePullToRefresh = () => {
  this.remoteFetchData()
}

componentDidMount(){
 this.remoteFetchData();
}

renderRow = ({item}) => {
  return (
    <View style={{flex:1, flexDirection: 'row'}}>
      <Image source = {{ uri: item.image_url }} style={styles.imageView} />
      <Text onPress={()=>this.getItem(item.title)} style={styles.textView} >{item.title}</Text>
    </View>
  )
}

shouldShowLoader() {
  return (this.state.isLoading && !this.state.dataSource == undefined);
}

render() {
  if (this.shouldShowLoader()) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.MainContainer}>
      <FlatList
       data={ this.state.dataSource }
       ItemSeparatorComponent = {this.FlatListItemSeparator}
       renderItem={this.renderRow}
       keyExtractor={(item, index) => index.toString()}
       onRefresh = {() => this.remoteFetchData()}
       refreshing = {this.state.isLoading}
       onEndReached = {() => this.handleLoadMore()}
       />
    </View>
  );
}
}

const styles = StyleSheet.create({

MainContainer :{

   justifyContent: 'center',
   flex:1,
   margin: 5,
   marginTop: (Platform.OS === 'ios') ? 20 : StatusBar.currentHeight,

},

imageView: {

   width: '50%',
   height: 100 ,
   margin: 7,
   borderRadius : 7

},

textView: {

   width:'50%',
   textAlignVertical:'center',
   padding:10,
   color: '#000'

}

});

Expo.registerRootComponent(FlatListBasics);
