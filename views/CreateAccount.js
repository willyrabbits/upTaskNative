import React, { useState } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Container, Button, Text, H1, Input, Form, Item, Toast, Label } from 'native-base'

import globalStyles from '../styles/global'

import { gql, useMutation } from '@apollo/client'

const NEW_ACCOUNT = gql`
    mutation createUser($input: UserInput){
        createUser(input: $input)
    }
`;

const CreateAccount = () => {
    // form state
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [toastText, setToastText] = useState('')

    // react navigation
    const navigation = useNavigation()

    // apollo Mutation
    const [createUser] = useMutation(NEW_ACCOUNT)

    // submit form
    const handleSubmit = async () => {
        // validate inputs
        if (name === '' || email === '' || password === '') {
            setToastText('All the fields are mandatory.')
            return
        }
        // pasword 6 chars
        if (password.length < 6) {
            setToastText('Password should be at least 6 chars long')
            return
        }

        // save user
        try {
            const { data } = await createUser({
                variables: { // this is mandatory
                    input: {
                        name,
                        email,
                        password
                    }
                }
            })
            setToastText(data.createUser)
            navigation.navigate('Login')
            setName('')
            setEmail('')
            setPassword('')


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
                            onChangeText={txt => setName(txt)}
                            value={name}
                            autoCompleteType="name"
                            placeholder="name"
                        />
                    </Item>

                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            onChangeText={txt => setEmail(txt)}
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
                    <Text style={globalStyles.btnText}>Sign up</Text>
                </Button>

                {toastText ? showAlert() : null}
            </View>
        </Container>
    )
}

export default CreateAccount