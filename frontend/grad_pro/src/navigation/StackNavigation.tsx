import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import Home from '../screens/Home';
import AdminScreen from '../screens/AdminScreen';
import ViewDataScreen from '../screens/ViewDataScreen'; 

export declare module CommonType {
    /** 
     * StackNavigation 관리하는 화면들
    */
    export type RootStackPageList = {
        default: undefined;
        home: undefined;
        adminScreen: undefined;
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
        headerStyle: {
            backgroundColor: '#209bec',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        }
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"home"} screenOptions={customStackNavigationOptions}>
                {/* 메인 페이지 */}
                <Stack.Screen name="home">
                    {(props) => <Home {...props} />}
                </Stack.Screen>
                {/* 관리자 페이지 */}
                <Stack.Screen name="adminScreen">
                    {(props) => <AdminScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="viewDataScreen">
                    {(props) => <ViewDataScreen {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer >
    )

}
export default StackNavigation;