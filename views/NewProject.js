import React, { useState } from 'react'
import { View } from 'react-native'
import { Container, Content, Button, Text, H1, Form, Item, Input, Toast } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { gql, useMutation } from '@apollo/client'

import globalStyles from '../styles/global'

const NEW_PROJECT = gql`
    mutation newProject($input: ProjectInput) {
        newProject(input: $input) {
            name
            id
        }
    }
`;

const GET_PROJECTS = gql`
    query getProjects {
        getProjects {
            id
            name
        }
    }
`;

const NewProject = () => {

    const [projectName, setProjectName] = useState('')
    const [toastText, setToastText] = useState('')

    const navigation = useNavigation()

    // apollo
    const [newProject] = useMutation(NEW_PROJECT, {
        update(cache, { data: { newProject } }) {
            const { getProjects } = cache.readQuery({ query: GET_PROJECTS });
            cache.writeQuery({
                query: GET_PROJECTS,
                data: { getProjects: getProjects.concat([newProject]) }
            })
        }
    })

    const handleSubmit = async () => {
        // validate inputs
        if (projectName === '') {
            setToastText('All the fields are mandatory.')
            return
        }

        // store project in DB
        try {
            const { data } = await newProject({
                variables: {
                    input: {
                        name: projectName,
                    }
                }
            });
            setToastText('Project Created Propertly')
            navigation.navigate('Projects')
            setProjectName('')
        } catch (error) {
            setToastText(error.message.replace('GraphQL error:', ''))
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

                <H1 style={globalStyles.subTitle}>Add a new project</H1>

                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            onChangeText={txt => setProjectName(txt)}
                            value={projectName}
                            placeholder="project name"
                        />
                    </Item>
                </Form>

                <Button
                    disabled={!projectName}
                    style={[globalStyles.btn, !projectName ? {
                        backgroundColor: '#CCC'
                    } : '']}
                    square
                    block
                    onPress={() => handleSubmit()}
                >
                    <Text style={globalStyles.btnText}>Add project</Text>
                </Button>


                {toastText ? showAlert() : null}
            </View>
        </Container>
    )
}

export default NewProject