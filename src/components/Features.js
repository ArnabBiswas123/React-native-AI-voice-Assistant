import {View, Text, Image} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default function Features() {
  return (
    <View className="space-y-4 flex-1">
      <Text style={{fontSize: wp(6.5)}} className="font-bold text-gray-600">
        Features
      </Text>
      <View className=" bg-emerald-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-2">
          <Image
            source={require('../../assets/chatgpt.png')}
            style={{height: hp(6), width: wp(10)}}></Image>
          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-gray-700">
            ChatGPT
          </Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className="text-gray-700 font-medium">
          ChatGPT is an advanced conversational AI model designed to engage
          users in natural language conversations and provide insightful
          responses across various topics.
        </Text>
      </View>
      <View className=" bg-purple-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-2">
          <Image
            source={require('../../assets/dall-e.png')}
            style={{height: hp(6), width: wp(10)}}></Image>
          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-gray-700">
            DALL-E
          </Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className="text-gray-700 font-medium">
          DALL·E is an innovative AI model capable of generating diverse and
          imaginative images from textual descriptions, pushing the boundaries
          of creative visual synthesis.
        </Text>
      </View>
      <View className=" bg-cyan-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-2">
          <Image
            source={require('../../assets/smart-ai.png')}
            style={{height: hp(6), width: wp(10)}}></Image>
          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-gray-700">
            Smart AI
          </Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className="text-gray-700 font-medium">
          Smart AI combining ChatGPT and DALL·E integrates natural language
          understanding and creative visual synthesis, enabling engaging and
          visually enriched conversations.
        </Text>
      </View>
    </View>
  );
}
