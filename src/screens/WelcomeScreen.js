import {View, Text, Image,TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation= useNavigation()




  return (
    <View className="flex flex-1 justify-around bg-white">
      <View className="space-y-2">
        <Text style={{fontSize:wp(10)}} className="text-center  font-bold text-orange-500">
          ARNAB
        </Text>
        <Text style={{fontSize:wp(6)}} className="text-center  tracking-wider font-semibold text-gray-600">
          AI voice Assistance
        </Text>
      </View>
      <View className="flex-row justify-center">
        <Image
          source={require('../../assets/VoiceAssistance.png')}
          style={{width:wp(75), height:(wp(75))}}></Image>
      </View>
      <TouchableOpacity className="bg-orange-500 mx-5 p-4 rounded-2xl" onPress={()=>{navigation.navigate('Home')}}>
        <Text style={{fontSize:wp(6)}} className="text-center font-bold text-white">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
