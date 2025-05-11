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
    marginBottom: 20,
  },

  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 4,
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },

  buttonWrapper: {
    width: '50%',
    marginBottom: 15,
    alignSelf: 'center',
    marginTop: 10
  },

  button: {
    width: '50%',
    backgroundColor: '#ed6e4e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonAdmin: {
    width: '50%',
    backgroundColor: '',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  listWrapper: {
    flex: 1,
    width: '100%',
    marginVertical: 10,
  },

})

export default styles
