import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fafafa',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: 'Helvetica',
    position: 'relative'},

  // Artistic background elements
  backgroundCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e0f2fe',
    opacity: 0.6},

  backgroundCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#f3e8ff',
    opacity: 0.4},

  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 6,
    height: '100%',
    backgroundColor: '#3b82f6'},

  // Header styles
  header: {
    marginBottom: 35,
    marginTop: 20,
    position: 'relative',
    zIndex: 10},

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20},

  profileImageWrapper: {
    marginRight: 25,
    position: 'relative'},

  profileImageBorder: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    border: '3px solid #3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'},

  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 37.5},

  nameSection: {
    flex: 1},

  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: 1},

  title: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 2},

  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15},

  contactItem: {
    fontSize: 10,
    color: '#64748b',
    backgroundColor: '#ffffff',
    padding: '6 12',
    borderRadius: 15,
    border: '1px solid #e2e8f0'},

  // Demographics styles
  demographicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10},

  demographicItem: {
    fontSize: 9,
    color: '#94a3b8',
    backgroundColor: '#f8fafc',
    padding: '4 8',
    borderRadius: 10,
    border: '1px solid #e2e8f0'}})