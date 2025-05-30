import { StyleSheet } from 'react-native'
import { colors } from '../theme/colors'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfbf9',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#282c0d',
    textAlign: 'center',
    marginBottom: 20,
  },

  text: {
    fontSize: 16,
    color: '#3b3e24',
  },

  customerList: {
    padding: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#6d9c38',
    backgroundColor: 'white',
  },

  orderList: {
    padding: 10,
    marginBottom: 5,
    borderBottomWidth: 2,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#6d9c38',
    backgroundColor: 'white',
  },

  inputLogginEditCreate: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 4,
  },

  inputSearch: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    textAlign: 'justify',
    borderColor: '#ccc',
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  button: {
    flex: 1,
    margin: 3,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#ed6e4e',
  },

  homeButton: {
    width: '70%',
    height: 50,
    backgroundColor: colors.buttonNavi,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },

  buttonSelectionCancel: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#827f89',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonSelectionSelectAll: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#176bc6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonSelectionDelete: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  deleteButton: {
    backgroundColor: 'red',
    width: '50%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  addUserButton: {
    width: '60%',
    height: 50,
    backgroundColor: '#ed6e4e',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginVertical: 10,
  },

  footerButton: {
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 30,
    marginBottom: 30,
  },

  customerFooterButton: {
    gap: 1,
    paddingTop: 10,
    paddingBottom: 50,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderBlockColor: 'red',
    backgroundColor: '#dfcdda',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  buttonOrderDetails: {
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 70,
  },

  detailContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  detailContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '700',
  },

  detailText: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },

  customerDetailText: {
    fontSize: 18,
    marginBottom: 1,
    textAlign: 'center',
  },

  customerAddressText: {
    fontSize: 16,
    marginBottom: 1,
    paddingLeft: 10,
    textAlign: 'center',
  },

  customerAddressBlock: { 
    marginVertical: 1,
    borderTopWidth: 1,
    paddingTop: 7,
    alignSelf: 'center',
  },




})

export default styles
