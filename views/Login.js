import React, { useState } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Container, Button, Text, H1, Input, Form, Item, Toast } from 'native-base'

import AsyncStorage from '@react-native-community/async-storage'

import globalStyles from '../styles/global'

import { gql, useMutation } from '@apollo/client'

const AUTH_USER = gql`
    mutation authUser($input: AuthInput){
        authUser(input: $input){
            token
        }
    }
`;

const Login = () => {

    // form state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [toastText, setToastText] = useState('')

    // react navigation
    const navigation = useNavigation()

    // apollo Mutation
    const [authUser] = useMutation(AUTH_USER)

    const handleSubmit = async () => {

        // validate inputs
        if (email === '' || password === '') {
            setToastText('All the fields are mandatory.')
            return
        }
        // pasword 6 chars
        if (password.length < 6) {
            setToastText('Password should be at least 6 chars long')
            return
        }

        try {
            const { data } = await authUser({
                variables: { // this is mandatory
                    input: {
                        email,
                        password
                    }
                }
            })
            const { token } = data.authUser
            setEmail('')
            setPassword('')

            // store TOKEN in LocalStorage
            await AsyncStorage.setItem('token', token)

                / navigation.navigate('Projects')
        } catch (error) {
            setToastText(error.message.replace('GraphQL error: ', ''))
            console.log(error)
        }

    }

    // show toast alert
    const showAlert = () => {
        Toast.show({
            text: toastText,
            buttonText: 'OK',
            duration: 3000
        })
        setToastText('')
    }

    return (
        <Container style={[globalStyles.container, { backgroundColor: '#E84347' }]}>
            <View style={globalStyles.content}>

                <H1 style={globalStyles.title}>UpTask</H1>

                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            onChangeText={txt => setEmail(txt.toLowerCase())}
                            value={email}
                            autoCompleteType="email"
                            placeholder="email"
                        />
                    </Item>

                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            onChangeText={txt => setPassword(txt)}
                            value={password}
                            placeholder="password"
                            secureTextEntry={true}
                        />
                    </Item>
                </Form>

                <Button square block style={globalStyles.btn} onPress={() => handleSubmit()}>
                    <Text style={globalStyles.btnText}>Log in</Text>
                </Button>

                <Text onPress={() => navigation.navigate("CreateAccount")} style={globalStyles.link}>Sing up</Text>

                {toastText ? showAlert() : null}
            </View>
        </Container>
    )
}

export default Login

