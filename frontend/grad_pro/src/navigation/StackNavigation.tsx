import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import Home from '../screens/Home';
import AdminScreen from '../screens/AdminScreen';
import HabitScreen from '../screens/HabitScreen';
import LyricCreation from '../screens/LyricCreation'; 
import RecordScreen from '../screens/RecordScreen'; 

//안지윤이 테스트로 만든 화면들
import SummaryScreen from '../screens/SummaryScreen';

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
            <Stack.Navigator initialRouteName={"home"} screenOptions={customStackNavigationOptions}>
                {/* 메인 페이지 */}
                <Stack.Screen name="home">
                    {(props) => <Home {...props} />}
                </Stack.Screen>
                {/* 관리자 페이지 */}
                <Stack.Screen name="AdminScreen">
                    {(props) => <AdminScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="HabitScreen">
                    {(props) => <HabitScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="LyricCreation">
                    {(props) => <LyricCreation {...props} />}
                </Stack.Screen>
                <Stack.Screen name="SummaryScreen">
                    {(props) => <SummaryScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="RecordScreen">
                    {(props) => <RecordScreen {...props} />}
                </Stack.Screen>
                
            </Stack.Navigator>
        </NavigationContainer >
    )

}
export default StackNavigation;