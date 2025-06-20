# Complete Guide to Creating Resume Templates

## 📋 Table of Contents
1. [Overview](#overview)
2. [Template Architecture](#template-architecture)
3. [Step-by-Step Creation Process](#step-by-step-creation-process)
4. [Group Method for Page Break Prevention](#group-method-for-page-break-prevention)
5. [Styling Guidelines](#styling-guidelines)
6. [Component Patterns](#component-patterns)
7. [Testing & Validation](#testing--validation)
8. [Integration Steps](#integration-steps)
9. [Common Pitfalls](#common-pitfalls)
10. [Examples](#examples)

## 🎯 Overview

This guide provides a comprehensive framework for creating new resume templates in the Resume-AI application. Each template is a self-contained React component that uses `@react-pdf/renderer` to generate professional PDF documents.

### Key Principles
- **Modular Design**: Each template is self-contained with its own components and styles
- **Group Method**: Sections are grouped to prevent unwanted page breaks
- **Consistent API**: All templates use the same `ResumeData` interface
- **Professional Output**: A4 size with print-ready formatting

## 🏗️ Template Architecture

### Directory Structure
```
src/components/resume-pdf/
├── [TemplateName]Template.tsx        # Main template component
├── components/
│   ├── [TemplateName]Header.tsx      # Header component
│   ├── [TemplateName]Content.tsx     # Main content component
│   └── [TemplateName]Sidebar.tsx     # Sidebar component (if needed)
├── styles/
│   ├── [templateName]Styles.ts       # Main styles
│   └── [templateName]SectionStyles.ts # Section-specific styles
└── utils/
    └── [templateName]Utils.ts        # Template-specific utilities
```

### Template Component Pattern
```typescript
interface TemplateProps {
  data: ResumeData
}

const [TemplateName]Template: React.FC<TemplateProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        {/* Fixed background elements */}
        <View style={styles.background} fixed />
        
        {/* Header section */}
        <TemplateHeader personal={data.personal} />
        
        {/* Main content */}
        <TemplateContent data={data} />
      </Page>
    </Document>
  )
}
```

## 📝 Step-by-Step Creation Process

### Step 1: Plan Your Template Design
1. **Choose a design approach** (modern, creative, executive, academic, etc.)
2. **Define layout structure** (single-column, two-column, multi-section)
3. **Plan color scheme** and visual elements
4. **Sketch section organization** and information hierarchy

### Step 2: Create the Main Template File
```bash
touch src/components/resume-pdf/[TemplateName]Template.tsx
```

### Step 3: Set Up Component Structure
```typescript
import React from 'react'
import { Document, Page, View, StyleSheet } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'

interface TemplateProps {
  data: ResumeData
}

const [TemplateName]Template: React.FC<TemplateProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        {/* Your template content here */}
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
})

export default [TemplateName]Template
```

### Step 4: Create Component Files
Create supporting components in the `components/` directory:
- Header component for personal information
- Content component for main sections
- Sidebar component (if using two-column layout)

### Step 5: Create Style Files
Create dedicated style files in the `styles/` directory:
- Main template styles
- Section-specific styles (experience, education, skills)

### Step 6: Create Thumbnail
Design an SVG thumbnail and save it as `public/thumbnails/[template-id].svg`

## 🔒 Group Method for Page Break Prevention

The **Group Method** is crucial for maintaining professional PDF layouts by preventing unwanted page breaks within logical content sections.

### Core Grouping Strategies

#### Strategy 1: Wrap Complete Sections
```typescript
// Group entire sections together
<View wrap={false} style={styles.section}>
  <Text style={styles.sectionTitle}>Work Experience</Text>
  {data.experience.map((exp, index) => (
    <View key={exp.id} style={styles.experienceItem}>
      {/* Experience content */}
    </View>
  ))}
</View>
```

#### Strategy 2: Group Title with First Item
```typescript
// Group section title with first content item
{data.experience.map((exp, index) => (
  <View key={exp.id} wrap={false}>
    {index === 0 && (
      <Text style={styles.sectionTitle}>Work Experience</Text>
    )}
    <View style={styles.experienceItem}>
      {/* Experience content */}
    </View>
  </View>
))}
```

#### Strategy 3: Individual Item Grouping
```typescript
// Group each item individually
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Work Experience</Text>
  {data.experience.map((exp) => (
    <View key={exp.id} wrap={false} style={styles.experienceGroup}>
      <Text style={styles.jobTitle}>{exp.position}</Text>
      <Text style={styles.company}>{exp.company}</Text>
      <Text style={styles.dates}>{formatDateRange(exp.startDate, exp.endDate)}</Text>
      <Text style={styles.description}>{exp.description}</Text>
    </View>
  ))}
</View>
```

### CSS Break Control Properties
```typescript
const styles = StyleSheet.create({
  experienceGroup: {
    breakInside: 'avoid',      // Prevents breaking inside element
    keepTogether: true,        // Forces content to stay together
    marginBottom: 12,
    paddingBottom: 8,
  },
  
  section: {
    marginBottom: 20,
    breakInside: 'avoid',      // Keep section title with content
  },
  
  sectionTitle: {
    breakAfter: 'avoid',       // Don't break after title
    marginBottom: 8,
  }
})
```

### Strategy Selection Guidelines

**Use Strategy 1 (Complete Section Wrapping) for:**
- **Languages Section** - Entire section should move as one unit
- **Short sections** with few items (2-4 items max)
- **Critical sections** that must never split
- **Sections where title loses meaning without content**

**Use Strategy 2 (Title with First Item) for:**
- **Work Experience** - Long sections with many entries
- **Education** - Multiple degrees/institutions  
- **Projects** - Multiple project entries
- **Large sections** where some splitting is acceptable

**Use Strategy 3 (Individual Item Grouping) for:**
- **Skills** - Each skill group stays together
- **Achievements** - Individual achievements as units
- **Any list** where items are independent

### Languages Section - Special Case

The Languages section requires **Strategy 1** because:
- It's typically short (2-5 languages)
- Section title is meaningless without language items
- Professional appearance requires complete section integrity

```typescript
// ✅ CORRECT: Languages Section Implementation
{data.languages && data.languages.length > 0 && (
  <View wrap={false} style={styles.section}>
    <Text style={styles.sectionTitle}>Languages</Text>
    {data.languages.map((language) => (
      <View key={language.id} style={styles.languageItem}>
        <Text style={styles.languageName}>{language.name}</Text>
        <Text style={styles.languageLevel}>{language.proficiency}</Text>
      </View>
    ))}
  </View>
)}

// ❌ INCORRECT: This will cause section splitting
{data.languages.map((language, index) => (
  <View key={language.id} wrap={false}>
    {index === 0 && <Text style={styles.sectionTitle}>Languages</Text>}
    <View style={styles.languageItem}>
      {/* Language content */}
    </View>
  </View>
))}
```

### Fixed Background Elements
```typescript
// Background elements that appear on all pages
<View style={styles.backgroundOverlay} fixed />
<View style={styles.sidebarBackground} fixed />
```

## 🎨 Styling Guidelines

### Color Palette Definition
```typescript
const colors = {
  primary: '#2563eb',      // Blue
  secondary: '#64748b',    // Gray
  accent: '#0f172a',      // Dark
  text: '#1e293b',        // Text
  light: '#f1f5f9',      // Light gray
  white: '#ffffff',       // White
}
```

### Typography Scale
```typescript
const typography = {
  // Headers
  h1: { fontSize: 24, fontWeight: 'bold' },
  h2: { fontSize: 18, fontWeight: 'bold' },
  h3: { fontSize: 14, fontWeight: 'bold' },
  
  // Body text
  body: { fontSize: 10, lineHeight: 1.4 },
  small: { fontSize: 8, lineHeight: 1.3 },
  
  // Special text
  caption: { fontSize: 9, color: colors.secondary },
}
```

### Layout Patterns
```typescript
// Two-column layout
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  
  body: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 600,
  },
  
  leftColumn: {
    width: '35%',
    paddingRight: 20,
    paddingTop: 20,
  },
  
  rightColumn: {
    width: '65%',
    paddingLeft: 20,
    paddingTop: 20,
  },
})
```

### Border Radius Best Practices
```typescript
// ❌ WRONG - Causes PDF generation errors
borderRadius: '50%'

// ✅ CORRECT - Use pixel values
borderRadius: 4,           // Small radius
borderRadius: 8,           // Medium radius
borderRadius: 37.5,        // Circle (half of width/height)
```

## 🧩 Component Patterns

### Header Component Pattern
```typescript
interface HeaderProps {
  personal: PersonalInfo
}

const TemplateHeader: React.FC<HeaderProps> = ({ personal }) => {
  return (
    <View wrap={false} style={styles.header}>
      <Text style={styles.name}>{personal.fullName}</Text>
      <Text style={styles.title}>{personal.jobTitle}</Text>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contact}>{personal.email}</Text>
        <Text style={styles.contact}>{personal.phone}</Text>
        <Text style={styles.contact}>{personal.location}</Text>
      </View>
    </View>
  )
}
```

### Section Component Pattern
```typescript
interface SectionProps {
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ title, children, icon }) => {
  return (
    <View wrap={false} style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon && <View style={styles.sectionIcon}>{icon}</View>}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  )
}
```

### Experience Item Pattern
```typescript
interface ExperienceItemProps {
  experience: WorkExperience
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ experience }) => {
  return (
    <View wrap={false} style={styles.experienceItem}>
      <View style={styles.experienceHeader}>
        <Text style={styles.position}>{experience.position}</Text>
        <Text style={styles.dates}>
          {formatDateRange(experience.startDate, experience.endDate)}
        </Text>
      </View>
      
      <Text style={styles.company}>{experience.company}</Text>
      {experience.location && (
        <Text style={styles.location}>{experience.location}</Text>
      )}
      
      {experience.description && (
        <Text style={styles.description}>{experience.description}</Text>
      )}
      
      {experience.achievements && experience.achievements.length > 0 && (
        <View style={styles.achievements}>
          {experience.achievements.map((achievement, index) => (
            <Text key={index} style={styles.achievement}>
              • {achievement}
            </Text>
          ))}
        </View>
      )}
    </View>
  )
}
```

## ✅ Testing & Validation

### Pre-Integration Testing Checklist
- [ ] Template renders without errors
- [ ] All sections display correctly
- [ ] Page breaks work as expected
- [ ] Fixed elements appear on all pages
- [ ] Text doesn't overflow or get cut off
- [ ] Colors and styling match design
- [ ] PDF exports successfully
- [ ] Mobile preview works correctly

### Test Data Requirements
Create comprehensive test data including:
- Long descriptions to test text wrapping
- Multiple experience/education entries
- All optional fields populated
- Edge cases (empty sections, special characters)

### Visual Testing
```typescript
// Test with different data scenarios
const testScenarios = [
  'minimal', // Only required fields
  'standard', // Typical resume data
  'comprehensive', // All fields populated
  'edge-cases', // Long text, special characters
]
```

## 🔗 Integration Steps

### Step 1: Register Template in Gallery
Add to `/src/components/resume-builder/TemplateGallery.tsx`:
```typescript
const templates: TemplateOption[] = [
  // ... existing templates
  {
    id: 'your-template-id',
    name: 'Your Template Name',
    description: 'Brief description of the template',
    category: 'professional', // or 'creative', 'academic', etc.
  }
]
```

### Step 2: Add to PDF Generator
Update `/src/lib/pdfGenerator.tsx`:
```typescript
const getTemplate = (template: string, data: ResumeData) => {
  switch (template) {
    // ... existing cases
    case 'your-template-id':
      return <YourTemplate data={data} />
    case 'modern':
    default:
      return <EnhancedModernTemplate data={data} />
  }
}
```

### Step 3: Add Thumbnail Support
Update `/src/components/resume-builder/TemplateThumbnail.tsx`:
```typescript
const getThumbnailSrc = () => {
  switch (templateId) {
    // ... existing cases
    case 'your-template-id':
      return '/thumbnails/your-template-id.svg'
    default:
      return '/thumbnails/modern.svg'
  }
}
```

### Step 4: Update Permission System
If creating a premium template, update `/src/lib/subscriptionLimits.ts`:
```typescript
export const getSubscriptionLimits = (plan: string) => {
  const limits = {
    free: {
      availableTemplates: ['modern'], // Don't include premium templates
    },
    pro: {
      availableTemplates: ['modern', 'creative', 'executive', 'your-premium-template'],
    },
  }
}
```

## ⚠️ Common Pitfalls

### 1. Border Radius Issues
```typescript
// ❌ This will cause PDF generation to fail
style={{
  borderRadius: '50%',
  width: 100,
  height: 100,
}}

// ✅ Use pixel values instead
style={{
  borderRadius: 50, // Half of width/height for circles
  width: 100,
  height: 100,
}}
```

### 2. Page Break Problems
```typescript
// ❌ This can cause sections to break awkwardly
<View>
  <Text style={styles.sectionTitle}>Work Experience</Text>
  {experiences.map(exp => (
    <View key={exp.id}>
      {/* Content might split across pages */}
    </View>
  ))}
</View>

// ✅ Use group method to control breaks
<View>
  {experiences.map((exp, index) => (
    <View key={exp.id} wrap={false}>
      {index === 0 && <Text style={styles.sectionTitle}>Work Experience</Text>}
      {/* Content stays together */}
    </View>
  ))}
</View>
```

### 3. Font Limitations
```typescript
// ❌ Custom fonts not supported
fontFamily: 'Inter'

// ✅ Use built-in fonts only
fontFamily: 'Helvetica' // or 'Times-Roman', 'Courier'
```

### 4. Wrong Grouping Strategy for Languages Section
```typescript
// ❌ This causes Languages section to split across pages
{data.languages.map((language, index) => (
  <View key={language.id} wrap={false}>
    {index === 0 && <Text style={styles.sectionTitle}>Languages</Text>}
    <View style={styles.languageItem}>
      <Text style={styles.languageName}>{language.name}</Text>
      <Text style={styles.languageLevel}>{language.proficiency}</Text>
    </View>
  </View>
))}

// ✅ Use Strategy 1 to keep entire Languages section together
<View wrap={false} style={styles.section}>
  <Text style={styles.sectionTitle}>Languages</Text>
  {data.languages.map((language) => (
    <View key={language.id} style={styles.languageItem}>
      <Text style={styles.languageName}>{language.name}</Text>
      <Text style={styles.languageLevel}>{language.proficiency}</Text>
    </View>
  ))}
</View>
```

### 5. Flexbox Limitations
```typescript
// ❌ Complex flexbox might not work
style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
}}

// ✅ Keep flexbox simple
style={{
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}}
```

## 📚 Examples

### Example 1: Academic Template Structure
```typescript
const AcademicTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        {/* Header */}
        <AcademicHeader personal={data.personal} />
        
        {/* Single column layout */}
        <View style={styles.content}>
          {/* Education first for academic focus */}
          <EducationSection education={data.education} />
          
          {/* Research & Publications */}
          <ResearchSection projects={data.projects} />
          
          {/* Experience */}
          <ExperienceSection experience={data.experience} />
          
          {/* Skills */}
          <SkillsSection skills={data.skills} />
        </View>
      </Page>
    </Document>
  )
}
```

### Example 2: Creative Template with Visual Elements
```typescript
const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        {/* Fixed decorative background */}
        <View style={styles.decorativeBackground} fixed />
        
        {/* Creative header with visual elements */}
        <CreativeHeader personal={data.personal} />
        
        {/* Two-column layout with visual sidebar */}
        <View style={styles.body}>
          <CreativeSidebar 
            skills={data.skills}
            languages={data.languages}
            education={data.education}
          />
          
          <CreativeMainContent 
            summary={data.summary}
            experience={data.experience}
            projects={data.projects}
          />
        </View>
      </Page>
    </Document>
  )
}
```

### Example 3: Minimalist Template
```typescript
const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        {/* Clean, minimal header */}
        <View wrap={false} style={styles.header}>
          <Text style={styles.name}>{data.personal.fullName}</Text>
          <Text style={styles.title}>{data.personal.jobTitle}</Text>
          <View style={styles.contactRow}>
            <Text>{data.personal.email}</Text>
            <Text>{data.personal.phone}</Text>
            <Text>{data.personal.location}</Text>
          </View>
        </View>
        
        {/* Single column, typography-focused */}
        <View style={styles.content}>
          {data.summary && (
            <Section title="Summary">
              <Text style={styles.summary}>{data.summary}</Text>
            </Section>
          )}
          
          <Section title="Experience">
            {data.experience.map(exp => (
              <MinimalExperienceItem key={exp.id} experience={exp} />
            ))}
          </Section>
          
          <Section title="Education">
            {data.education.map(edu => (
              <MinimalEducationItem key={edu.id} education={edu} />
            ))}
          </Section>
        </View>
      </Page>
    </Document>
  )
}
```

## 🎯 Summary

Creating a new resume template involves:

1. **Planning** the design and layout structure
2. **Creating** the main template component with proper TypeScript types
3. **Implementing** the group method for page break control
4. **Styling** with React-PDF limitations in mind
5. **Testing** thoroughly with various data scenarios
6. **Integrating** with the template selection system
7. **Adding** thumbnail and permission support

The group method is crucial for professional PDF output - always use `wrap={false}` for content that should stay together, and be mindful of how sections break across pages.

Remember to keep components under 100 lines of code, follow the established patterns, and test thoroughly before integration.