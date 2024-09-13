import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import HabitScreen from '../screens/HabitScreen';
import LyricQuestionScreen from '../screens/LyricQuestionScreen';
import LyricSelectScreen from '../screens/LyricSelectScreen';
import MelodyScreen from '../screens/MelodyScreen';
import LodingScreen from '../screens/LodingScreen';
import PlayScreen from '../screens/PlayScreen';
import SongListScreen from '../screens/SongListScreen';

export declare module CommonType {
    /** 
     * StackNavigation 관리하는 화면들
    */
    export type RootStackPageList = {
        
    };
}

/** 
 * StackNavigator를 이용하여서 앱에 대한 페이지 이동을 관리합니다.
*/
const StackNavigation = () => {

    // RootStackPageList에서 페이지를 관리합니다
    const Stack = createStackNavigator<CommonType.RootStackPageList>();

    const customStackNavigationOptions: StackNavigationOptions = {
        gestureEnabled: false,
        title: '',
        headerShown: false,
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"SongListScreen"} screenOptions={customStackNavigationOptions}>
                {/* 메인 페이지 */}
                <Stack.Screen name="HomeScreen">
                    {(props) => <HomeScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="HabitScreen">
                    {(props) => <HabitScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="LyricSelectScreen">
                    {(props) => <LyricSelectScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="LyricQuestionScreen">
                    {(props) => <LyricQuestionScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="MelodyScreen">
                    {(props) => <MelodyScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="LodingScreen">
                    {(props) => <LodingScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="PlayScreen">
                    {(props) => <PlayScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="SongListScreen">
                    {(props) => <SongListScreen {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer >
    )

}
export default StackNavigation;