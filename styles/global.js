import { StyleSheet } from "react-native"

const globalStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: '2.5%',
        flex: 1
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF'
    },
    subTitle: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 22,
        color: '#FFF',
        marginTop: 20
    },
    input: {
        backgroundColor: '#FFF',
        marginBottom: 20
    },
    btn: {
        backgroundColor: '#28303B',
        marginTop: 10
    },
    btnText: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#FFF'
    },
    link: {
        color: 'white',
        marginTop: 80,
        textAlign: 'center',
        fontSize: 18,
        textTransform: 'uppercase',
        textDecorationLine: 'underline'
    }
})

export default globalStyles;