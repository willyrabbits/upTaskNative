import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Container, Content, Button, Text, H2, List, Input, Form, Item, Toast, View, Spinner } from 'native-base'
import { gql, useMutation, useQuery } from '@apollo/client'

import Task from '../components/Task'
import globalStyles from '../styles/global'

const NEW_TASK = gql`
mutation newTask($input: TaskInput){
    newTask(input: $input) {
        name
        id
        project
        state
    }
}
`

const GET_TASKS = gql`
query getTasks($input: ProjectIDInput) {
    getTasks(input: $input) {
        name
        id
        state
    }
}
`

const Project = ({ route }) => {

    // info that we send from father component
    console.log(route.params)
    const { id, name } = route.params

    const [taskName, setTaskName] = useState('')
    const [toastText, setToastText] = useState('')

    const navigation = useNavigation()
    navigation.setOptions({ title: name })

    // apollo
    const { data, loading, error } = useQuery(GET_TASKS, {
        variables: {
            input: {
                project: id
            }
        }
    })
    const [newTask] = useMutation(NEW_TASK, {
        update(cache, { data: { newTask } }) {
            const { getTasks } = cache.readQuery({
                query: GET_TASKS,
                variables: {
                    input: {
                        project: id
                    }
                }
            })
            cache.writeQuery({
                query: GET_TASKS,
                variables: {
                    input: {
                        project: id
                    }
                },
                data: {
                    getTasks: [...getTasks, newTask]
                }
            })
        }
    })

    // validate and create tasks
    const handleSubmit = async () => {
        if (taskName === '') {
            setToastText('All the fields are mandatory.')
            return
        }

        // store in DB
        try {
            const { data } = await newTask({
                variables: {
                    input: { // "input" like in RESOLVER.js
                        name: taskName,
                        project: id
                    }
                }
            });
            setTaskName('')
            setToastText('Task created successfully')
        } catch (error) {
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
            <View style={{
                marginHorizontal: '2.5%',
                flex: 1,
                marginTop: 20
            }}>

                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            onChangeText={txt => setTaskName(txt)}
                            value={taskName}
                            placeholder="task name"
                        />
                    </Item>
                </Form>
                <Button square block style={globalStyles.btn} onPress={() => handleSubmit()}>
                    <Text style={globalStyles.btnText}>Create new task</Text>
                </Button>

                {loading && <Spinner />}
                <H2 style={globalStyles.subTitle}>Tasks: {name}</H2>
                {data &&
                    <Content>
                        <List style={styles.content}>
                            {data.getTasks.map(task => (
                                <Task key={task.id} task={task} projectId={id} />
                            ))}
                        </List>
                    </Content>
                }

                {toastText ? showAlert() : null}

            </View>
        </Container>
    )
}

export default Project

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#FFF',
        marginHorizontal: '2.5%'
    }
})