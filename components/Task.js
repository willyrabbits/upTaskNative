import React from 'react'
import { StyleSheet, Alert } from 'react-native'
import { Text, ListItem, Icon, Left, Right } from 'native-base'
import { gql, useMutation } from '@apollo/client'

const UPDATE_TASK = gql`
    mutation updateTask($id: ID!, $input: TaskInput, $state: Boolean) {
        updateTask(id: $id, input: $input, state: $state) {
            name
            id
            project
            state
        }
    }
`

const DELETE_TASK = gql`
    mutation deleteTask($id: ID!) {
        deleteTask(id: $id)
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

const Task = ({ task, projectId }) => {

    const { name, id, state } = task

    // apollo
    const [updateTask] = useMutation(UPDATE_TASK)
    const [deleteTask] = useMutation(DELETE_TASK, {
        update(cache) {
            const { getTasks } = cache.readQuery({
                query: GET_TASKS,
                variables: {
                    input: {
                        project: projectId
                    }
                }
            })

            cache.writeQuery({
                query: GET_TASKS,
                variables: {
                    input: {
                        project: projectId
                    }
                },
                data: {
                    getTasks: getTasks.filter(taskItem => taskItem.id !== task.id)
                }
            })
        }
    })

    // toggle state of the task
    const changeState = async () => {
        try {
            const { data } = await updateTask({
                variables: {
                    id,
                    input: {
                        name
                    },
                    state: !state
                }
            })
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    // allow the user to delete a task
    const showDelete = () => {
        Alert.alert(
            'Delete task',
            'This action cannot be undone',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => deleteTaskDB()
                }
            ]

        )
    }

    const deleteTaskDB = async () => {
        try {
            const { data } = await deleteTask({
                variables: {
                    id
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <ListItem
                onPress={() => changeState()}
                onLongPress={() => showDelete()}
            >
                <Left>
                    <Text>{task.name}</Text>
                </Left>
                <Right>
                    <Icon
                        style={[styles.icon, (task.state) ? styles.complete : {}]}
                        name="ios-checkmark-circle"
                    />
                </Right>
            </ListItem>
        </>
    )
}

export default Task

const styles = StyleSheet.create({
    icon: {
        fontSize: 32,
        color: '#E1E1E1'
    },
    complete: {
        color: 'green'
    }
})