import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  container: {
    flex: 1,
  },
  btleConnectionStatus: {
    // fontSize: 20,
    // paddingTop: 20
  },
  headline: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'column',
    padding: 8,
    paddingBottom: 16,
  },
  iconContainer: {
    flexDirection: 'column',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  majorMinorContainer: {
    flexDirection: 'row',
  },
  smallText: {
    fontSize: 11,
  },
  actionsContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 160,
    backgroundColor: '#A6A6A6',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  actionText: {
    alignSelf: 'center',
    fontSize: 11,
    color: '#F1F1F1',
  },
});
