import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Linking } from 'react-native';
import { useFonts } from 'expo-font';
import { FontAwesome, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons'
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

export default function App() {


  const [quote, setQuote] = useState(null)
  const [author, setAuthor] = useState(null)
  const [isFetching, setisFetching] = useState(false)
  const [isSpeaking, setisSpeaking] = useState(false)
  const [onClipboard, setonClipboard] = useState(false)


  useEffect(() => {
    if (quote == null && author == null) {
      setisFetching(true)
      fetch('https://api.quotable.io/random', {
      method: 'get',
      headers: {
        'Allow': 'application/json',
        'Content-Type': 'application/json'
      },
      })
      .then((response) => response.json())
      .then((json) => {
        setQuote(json.content)
        setAuthor(json.author)
      })
      .catch((error) => console.log(error))
      .finally(() => setisFetching(false))
    }
  }, [])


  const getQuote = () => {
    setisFetching(true)
    fetch('https://api.quotable.io/random', {
      method: 'get',
      headers: {
        'Allow': 'application/json',
        'Content-Type': 'application/json'
      },
      })
      .then((response) => response.json())
      .then((json) => {
        setQuote(json.content)
        setAuthor(json.author)
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setisFetching(false)
        setisSpeaking(false)
        setonClipboard(false)
      })
  }

  const start = () => {
    //console.log('Speaking started')
    setisSpeaking(true)
  }

  const stop = () => {
    //console.log('Speaking complete')
    setisSpeaking(false)
  }

  const speak = () => {
    Speech.stop()
    Speech.speak(quote + ' by ' + author, {
      voice: 'en-gb-x-rjs-local',
      pitch: 0.9,
      rate: 0.9,
      onStart: start,
      onDone: stop,
    })
  }
  
  const copyToClipboard = () => {
    setonClipboard(true)
    Clipboard.setString(quote)
    Toast.show('Copied to clipboard!', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      animation: true,
      backgroundColor: 'white',
      textColor: 'blue'
    })
  }

  

  const tweet = () => {
    const url = "https://twitter.com/intent/tweet?text=" + quote
    Linking.openURL(url)
  }

  const renderCorrectVolumeDisplay = () => {
    if (isSpeaking) {
      return (
        <TouchableOpacity style={styles.iconWrapperSpeaking} activeOpacity={0.6} onPress={speak}>
          <Ionicons name='volume-high' size={25} color='white'/>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.iconWrapper} activeOpacity={0.6} onPress={speak}>
          <Ionicons name='volume-high' size={25} color='#3679ff'/>
        </TouchableOpacity>
      )
    }
  }

  const renderCorrectClipboardDisplay = () => {
    if (onClipboard) {
      return (
        <TouchableOpacity style={[styles.iconWrapper, {backgroundColor: '#3679ff'}]} activeOpacity={0.6} onPress={copyToClipboard}>
            <MaterialIcons name='content-copy' size={25} color='white'/>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.iconWrapper} activeOpacity={0.6} onPress={copyToClipboard}>
          <MaterialIcons name='content-copy' size={25} color='#3679ff'/>
        </TouchableOpacity>
      )
    }
  }
  
  //Speech.getAvailableVoicesAsync().then((response) => console.log(response))


  const [loaded] = useFonts({
    MontserratMedium: require('./assets/fonts/Montserrat-Medium.ttf'),
    MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf'),
    MontserratSemiBold: require('./assets/fonts/Montserrat-SemiBold.ttf'),
  })
  if (!loaded) {
      return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" barStyle="light-content" />

      <View style={styles.quoteContainer}>
        <View style={{alignItems: 'center', marginBottom: 30}}>
          <Text style={styles.quoteTitle}>Quote of the Day</Text>
        </View>


        <FontAwesome name='quote-left' size={20} style={{marginBottom: -12}}/>

        <View style={{alignItems: 'center', paddingHorizontal: 30}}>
          {
            isFetching && quote == null?
            <ActivityIndicator color='#3679ff' size='large'/> : 
            <Text style={styles.quoteText}>{quote}</Text>
          }
        </View>

        <FontAwesome name='quote-right' size={20} style={{textAlign: 'right', marginTop: -12}}/>

        {
          isFetching ?
          <Text style={styles.authorText}>-- Loading</Text> :
          <Text style={styles.authorText}>-- {author}</Text> 
        }

        

        <View style={{alignItems: 'center'}}>
          <TouchableOpacity 
          style={styles.quoteButton} 
          activeOpacity={0.6}
          onPress={getQuote}
          >
            {
              isFetching ? 
              <ActivityIndicator color='white' size='large'/> : 
              <Text style={styles.newquoteText}>New Quote</Text>
            }
            
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>

          {renderCorrectVolumeDisplay()}

          {renderCorrectClipboardDisplay()}

          <TouchableOpacity style={styles.iconWrapper} activeOpacity={0.6} onPress={tweet}>
            <Entypo name='twitter' size={25} color='#3679ff'/>
          </TouchableOpacity>

        </View>

      </View>


      {/* <View style={styles.madeWrapper}>
        <Text style={styles.madeText}>Made with ❤ by jellyCodes</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3679ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteContainer: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 20
  },
  quoteTitle: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 20,
  },
  quoteButton: {
    backgroundColor: '#3679ff',
    height: 50,
    width: '90%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30
  },
  iconWrapper: {
    borderWidth: 1.5,
    borderColor: '#3679ff',
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconWrapperSpeaking: {
    backgroundColor: '#3679ff',
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quoteText: {
    fontFamily: 'MontserratMedium',
    textAlign: 'center'
  },
  authorText: {
    textAlign: 'right',
    marginTop: 20,
    fontStyle: 'italic',
    fontFamily: 'MontserratRegular'
  },
  newquoteText: {
    fontFamily: 'MontserratSemiBold',
    color: '#fff'
  },
  // madeWrapper: {
  //   marginTop: 50,
  //   alignItems: 'center',
  // },
  // madeText: {
  //   fontFamily: 'MontserratMedium',
  //   color: 'white',
  // }
});
