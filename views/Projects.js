import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Content, Button, Text, H2, List, ListItem, Left, Right, Spinner } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { gql, useQuery } from '@apollo/client'

import globalStyles from '../styles/global'

const GET_PROJECTS = gql`
    query getProjects {
        getProjects {
            id
            name
        }
    }
`;

const Projects = () => {

    const navigation = useNavigation()

    // apollo
    const { data, loading, error } = useQuery(GET_PROJECTS)
    console.log('-------------------------------')
    console.log(data)
    console.log(loading)
    console.log(error)

    return (
        <Container style={[globalStyles.container, { backgroundColor: '#E84347' }]}>
            <View style={{
                marginHorizontal: '2.5%',
                flex: 1
            }}>

                <Button
                    square
                    block
                    style={[globalStyles.btn, { marginTop: 30 }]}
                    onPress={() => navigation.navigate('NewProject')}
                >
                    <Text style={globalStyles.btnText}>Add a project</Text>
                </Button>
                <H2 style={globalStyles.subTitle}>which project are you working with?</H2>

                {loading && <Spinner />}
                {data &&
                    <Content>
                        <List style={styles.content}>
                            {data.getProjects.map(project => (
                                <ListItem
                                    key={project.id}
                                    onPress={() => navigation.navigate('Project', project)}
                                >
                                    <Left>
                                        <Text>{project.name}</Text>
                                    </Left>
                                    <Right></Right>
                                </ListItem>
                            ))}

                        </List>
                    </Content>
                }
            </View>
        </Container>
    )
}

export default Projects

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#FFF',
    }
})