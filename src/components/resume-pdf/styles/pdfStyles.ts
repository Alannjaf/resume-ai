import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    color: '#1a1a1a',
    paddingTop: 30,    // Padding for all pages
    paddingHorizontal: 0,
  },
  
  // Header Section
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: '32 40',
    flexDirection: 'row',
    alignItems: 'center',
    height: 140,
  },
  
  profileImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    marginRight: 24,
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #ffffff',
  },
  
  profileImage: {
    width: 90,
    height: 90,
    objectFit: 'cover',
  },
  
  profileImagePlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: '#94a3b8',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerText: {
    flex: 1,
  },
  
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#ffffff',
  },
  
  title: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 12,
    fontWeight: 'normal',
  },
  
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  
  contactItem: {
    fontSize: 10,
    color: '#cbd5e1',
  },
  
  // Body Layout
  body: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 600,
    marginTop: 140, // Space for the absolute header
  },
  
  pageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
  
  leftBgOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '38%',
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
  },
  
  leftColumnBg: {
    position: 'absolute',
    left: 0,
    top: 140, // Start after header
    bottom: 0,
    width: '38%',
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
  },
  
  leftColumn: {
    width: '38%',
    padding: '24 20',
  },
  
  rightColumn: {
    width: '62%',
    padding: '24 28',
  },
  
  // Section Styling
  section: {
    marginBottom: 24,
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textTransform: 'uppercase',
    borderBottom: '3px solid #3b82f6',
    paddingBottom: 4,
    paddingLeft: 2,
  },
  
  leftSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    textTransform: 'uppercase',
    borderBottom: '2px solid #6366f1',
    paddingBottom: 3,
  },
  
  // Summary Section
  summary: {
    fontSize: 11,
    lineHeight: 1.6,
    textAlign: 'justify',
    color: '#374151',
    padding: '16 20',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderLeft: '4px solid #3b82f6',
  },
})