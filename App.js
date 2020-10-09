import 'react-native-gesture-handler';
import React from 'react';
import { Root } from 'native-base'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import Login from './views/Login'
import CreateAccount from './views/CreateAccount'
import NewProject from './views/NewProject'
import Projects from './views/Projects'
import Project from './views/Project'

const App = () => {
    return (
        <>
            <Root>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Projects"
                        screenOptions={{
                            headerStyle: {
                                backgroundColor: '#28303B'
                            },
                            headerTintColor: 'white',
                            headerTitleStyle: {
                                fontWeight: 'bold'
                            }
                        }}
                    >
                        <Stack.Screen
                            name="Login"
                            component={Login}
                            options={{
                                title: 'Log in',
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name="CreateAccount"
                            component={CreateAccount}
                            options={{
                                title: 'Sing up',
                            }}
                        />
                        <Stack.Screen
                            name="Projects"
                            component={Projects}
                            options={{
                                title: 'Your Projects',
                                headerLeft: () => <></>
                            }}
                        />
                        <Stack.Screen
                            name="NewProject"
                            component={NewProject}
                            options={{
                                title: 'Add a project',
                            }}
                        />
                        <Stack.Screen
                            name="Project"
                            component={Project}
                            options={{
                                title: 'project detail',
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </Root>
        </>
    );
};

export default App;
