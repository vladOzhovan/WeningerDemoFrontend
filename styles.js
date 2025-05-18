import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },

  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 4
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10
  },

  buttonWrapper: {
    marginBottom: 15,
    alignSelf: 'center',
    marginTop: 10
  },

  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#ed6e4e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },

  buttonAdmin: {
    width: '50%',
    backgroundColor: '',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },

  deleteButton: {
    backgroundColor: 'red',
    width: '50%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center'
  },

  homeButton: {
    width: '70%',
    height: 50,
    backgroundColor: '#ed6e4e',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12
  },

  addUserButton: {
    width: '60%',
    height: 50,
    backgroundColor: '#ed6e4e',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginVertical: 10
  },

  listWrapper: {
    flex: 1,
    width: '100%',
    marginVertical: 10
  },

  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: 'flex-start'
  },

  listContainer: {
    flex: 1,
    marginVertical: 10
  },

  footer: {
    paddingVertical: 10
  },

  footerButtons: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 60
  },

  newOrderWrapper: {
    width: '60%',
    alignSelf: 'center',
    marginBottom: 20
  },

  detailContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20
  },

  detailContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  detailTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700'
  },

  detailText: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center'
  }
})

export default styles
