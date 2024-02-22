import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useEffect, useRef} from 'react';
import {useState} from 'react';
import Features from '../components/Features';

import Voice from '@react-native-community/voice';
import {apiCall} from '../api/openAI';
import Tts from 'react-native-tts';

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [results, setResults] = useState('');
  const [speaking,setSpeaking]=useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchAgain,setFetchAgain]=useState(false)
  const [load,setLoad]=useState(false);
  const isInitialRender = useRef(true); // Ref to track initial render

  const scroolViewRef = useRef();

  const onSpeechStartHandler = e => {
    console.log('speech start');
    // console.log(e);
  };
  const onSpeechEndHandler = e => {
    setRecording(false);
    console.log('speech End');
    // console.log(e);
  };

  useEffect(()=>{
    console.log('hey')
    fetchResponse();
  },[fetchAgain])



  const onSpeechResultsHandler = e => {
    console.log(e);
    setResults(e.value[0]);
    console.log(fetchAgain);
    setFetchAgain(prevFetchAgain => !prevFetchAgain)
    console.log(fetchAgain);

  };
  const onSpeechErrorHandler = e => {

    console.log(e);
  };

  const removeAllListeners = async () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechErrorHandler;

    setLoading(false)

    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-progress', event =>
      console.log('progress', event),
    );
    Tts.addEventListener('tts-finish', event => console.log('finish', event));
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
    return () => {
      removeAllListeners();
    };
  }, []);

  const clear = () => {
    setMessages([]);
    setSpeaking(false)
    setLoad(newload=>!newload)
  };

  const startRecording = async () => {
    setRecording(true);
    console.log('start recording');
    try {
      await Voice.start('en-GB');
    } catch (error) {
      console.log('no');
      console.log(error);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResponse =() => {
    console.log('running');
   console.log(results);
    if (results?.trim().length > 0) {
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: results?.trim()});
      
      setMessages([...newMessages]);

      setLoading(true)
      
 
      apiCall(results?.trim(), newMessages).then(res => {
  
      
        if (res.success) {
          setMessages([...res.data]);
          setLoading(false);
          setResults('');
          startTextToSpeech(res.data[res.data.length-1]);
        } else {
          Alert.alert('Error', res.msg);
        }
      }).finally(()=>setLoading(false))
    }
  };


  const startTextToSpeech=messages=>{
    if(!messages.content?.includes('https')){
        setSpeaking(true)
      Tts.speak(messages.content, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    }
  }

  const stopSpeaking=()=>{
    Tts.stop();
    setSpeaking(false)
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 flex mx-5 space-y-3">
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/bot.png')}
            style={{width: wp(30), height: hp(15)}}></Image>
        </View>
        {messages.length > 0 ? (
          <View className="space-y-2 flex-1">
            <Text
              style={{fontSize: wp(5)}}
              className="text-gray-700 font-semibold ml-1">
              Assistant
            </Text>
            <View
              style={{height: hp(65)}}
              className="bg-neutral-200 rounded-3xl p-4">
              <ScrollView
                onContentSizeChange={() => {
                  scroolViewRef.current?.scrollToEnd({animated: true});
                }}
                bounces={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}>
                {messages.map((messages, index) => {
                  if (messages.role == 'assistant') {
                    if (messages.content.includes('https')) {
                      //it's an image
                      return (
                        <View key={index} className="flex-row justify-start">
                          <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tr-none">
                            <Image
                              source={{uri: messages.content}}
                              className="rounded-2xl"
                              resizeMode="contain"
                              style={{height: wp(60), width: wp(60)}}></Image>
                          </View>
                        </View>
                      );
                    } else {
                      //text response
                      return (
                        <View
                          key={index}
                          style={{width: wp(70)}}
                          className=" bg-emerald-100 rounded-xl p-2 rounded-tr-none">
                          <Text>{messages.content}</Text>
                        </View>
                      );
                    }
                  } else {
                    //use input
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View
                          style={{width: wp(70)}}
                          className="bg-white rounded-xl p-2 rounded-tr-none">
                          <Text>{messages.content}</Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}
        <View className="flex justify-center items-center">
          {loading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : recording ? (
            <TouchableOpacity onPress={stopRecording}>
              <Image
                className="rounded-full mb-2"
                source={require('../../assets/ellipsis.png')}
                style={{width: hp(5), height: hp(5)}}></Image>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              {/* recording start button */}
              <Image
                className="rounded-full"
                source={require('../../assets/mike.png')}
                style={{width: hp(6), height: hp(6)}}></Image>
            </TouchableOpacity>
          )}

          {messages.length > 0 && (
            <TouchableOpacity
              onPress={clear}
              className="bg-neutral-400 rounded-3xl py-2 px-3 absolute right-10 mb-4">
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
          )}
          {/* recording stop button */}
          {speaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              className="bg-red-400 rounded-3xl py-2 px-3 absolute left-10 mb-4">
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
