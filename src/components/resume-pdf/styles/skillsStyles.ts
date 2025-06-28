import { StyleSheet } from '@react-pdf/renderer'

export const skillsStyles = StyleSheet.create({
  // Skills Section
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6},
  
  skillItem: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '6 12',
    borderRadius: 12,
    fontSize: 9,
    marginBottom: 6},
  
  // Languages Section
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: '8 12',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    border: '1px solid #e5e7eb'},
  
  languageName: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: 'bold'},
  
  languageLevel: {
    fontSize: 9,
    color: '#059669',
    backgroundColor: '#ecfdf5',
    padding: '3 8',
    borderRadius: 10},
  
  // Projects Section
  projectItem: {
    marginBottom: 16,
    padding: '14 16',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderLeft: '4px solid #6366f1',
    breakInside: 'avoid', // Keep project group together
  },
  
  projectName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4},
  
  projectDescription: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.4,
    marginBottom: 4},
  
  projectTech: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2},
  
  projectLink: {
    fontSize: 9,
    color: '#3b82f6',
    textDecoration: 'none'},
  
  // Certifications Section
  certificationItem: {
    marginBottom: 12,
    padding: '10 14',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    border: '1px solid #e5e7eb',
    borderLeft: '3px solid #f59e0b',
    breakInside: 'avoid', // Keep certification group together
  },
  
  certificationName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3},
  
  certificationIssuer: {
    fontSize: 10,
    color: '#3b82f6',
    marginBottom: 2},
  
  certificationDate: {
    fontSize: 9,
    color: '#6b7280'}})