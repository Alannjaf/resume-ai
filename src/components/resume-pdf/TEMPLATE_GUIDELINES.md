# PDF Resume Template Development Guidelines

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture Best Practices](#architecture-best-practices)
3. [Page Break Management](#page-break-management)
4. [Content Grouping Strategies](#content-grouping-strategies)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [What to Avoid](#what-to-avoid)
7. [Testing Guidelines](#testing-guidelines)
8. [Code Examples](#code-examples)

## Overview

This guide provides best practices for creating PDF resume templates using @react-pdf/renderer that handle page breaks gracefully and maintain professional appearance across multiple pages.

## Architecture Best Practices

### 1. File Structure
```
resume-pdf/
├── EnhancedModernTemplate.tsx    # Main template component
├── components/
│   ├── PDFHeader.tsx             # Header with profile image
│   ├── LeftColumn.tsx            # Skills, education, etc.
│   └── RightColumn.tsx           # Experience, projects, etc.
├── styles/
│   ├── pdfStyles.ts              # Main layout styles
│   ├── experienceStyles.ts       # Experience & education styles
│   └── skillsStyles.ts           # Skills, projects, certs styles
└── utils/
    └── dateUtils.ts              # Date formatting utilities
```

### 2. Style Organization
- Keep files under 100 lines
- Group related styles together
- Use meaningful style names
- Maintain consistent spacing values

### 3. Component Design
- Single responsibility principle
- Conditional rendering for optional sections
- Props typing with TypeScript interfaces

## Page Break Management

### ✅ Best Practices

#### 1. **Use `wrap={false}` for Content Groups**
```tsx
<View wrap={false}>
  <Text style={styles.sectionTitle}>Education</Text>
  <View style={styles.educationItem}>
    {/* All education fields */}
  </View>
</View>
```

#### 2. **Apply Break Styles to Containers**
```tsx
experienceItem: {
  marginBottom: 18,
  paddingBottom: 16,
  breakInside: 'avoid',  // Prevents breaking inside
  keepTogether: true,    // Forces content to stay together
}
```

#### 3. **Group Section Titles with First Item**
```tsx
{data.education.map((edu, index) => (
  <View key={edu.id} wrap={false}>
    {index === 0 && (
      <Text style={styles.sectionTitle}>Education</Text>
    )}
    <View style={styles.educationItem}>
      {/* Content */}
    </View>
  </View>
))}
```

#### 4. **Handle Page Padding**
```tsx
page: {
  paddingTop: 30,     // Space for continued content
  paddingBottom: 30,
}

header: {
  position: 'absolute',
  top: 0,
  marginTop: -30,     // Compensate on first page
}
```

#### 5. **Fixed Elements for Repeated Content**
```tsx
{/* Background that appears on all pages */}
<View style={styles.leftBgOverlay} fixed />
```

## Content Grouping Strategies

### 1. **Experience Entries**
Each experience should include:
- Job title
- Company name
- Location
- Date range
- Description

All wrapped together with `wrap={false}`

### 2. **Education Entries**
Group together:
- Degree
- Field of study
- School name
- Location & dates
- GPA (optional)
- Achievements (optional)

### 3. **Projects**
Keep together:
- Project name
- Description
- Technologies
- Link

### 4. **Skills & Languages**
These can break naturally as they're smaller items, but consider grouping by category.

## Common Issues & Solutions

### Issue 1: Content Split Across Pages
**Solution:** Add `wrap={false}` to the container
```tsx
<View style={styles.item} wrap={false}>
  {/* Content that should stay together */}
</View>
```

### Issue 2: Section Title Orphaned at Bottom
**Solution:** Include title with first item
```tsx
{items.map((item, index) => (
  <View wrap={false}>
    {index === 0 && <Text style={styles.title}>Section</Text>}
    <View>{/* Item content */}</View>
  </View>
))}
```

### Issue 3: Background Not Extending on All Pages
**Solution:** Use fixed positioning
```tsx
<View style={styles.backgroundStyle} fixed />
```

### Issue 4: Content at Page Edges
**Solution:** Add page padding and compensate in fixed elements
```tsx
page: { paddingTop: 30 }
header: { position: 'absolute', top: 0 }
```

## What to Avoid

### ❌ **DON'T Use Manual Page Breaks**
```tsx
// AVOID
if (index === 3) {
  return <Page break />
}
```
Let the renderer handle pagination automatically.

### ❌ **DON'T Split Related Content**
```tsx
// AVOID
<View>
  <Text>Job Title</Text>
</View>
<View wrap={false}>
  <Text>Company</Text>
  <Text>Description</Text>
</View>
```

### ❌ **DON'T Use Complex Conditional Styling**
```tsx
// AVOID
style={[
  styles.base,
  isFirst && styles.first,
  isLast && styles.last,
  isEven && styles.even
]}
```
Keep styling simple and predictable.

### ❌ **DON'T Nest wrap={false} Unnecessarily**
```tsx
// AVOID
<View wrap={false}>
  <View wrap={false}>
    <View wrap={false}>
      {/* Content */}
    </View>
  </View>
</View>
```

### ❌ **DON'T Use Custom Fonts Without Fallbacks**
```tsx
// AVOID - This caused font loading errors
Font.register({
  family: 'Inter',
  src: 'https://fonts.com/inter.woff2'
})

// BETTER - Use built-in fonts
fontFamily: 'Helvetica'
```

## Testing Guidelines

### 1. **Test Different Content Lengths**
- Single item per section
- Multiple items filling multiple pages
- Very long descriptions
- Missing optional fields

### 2. **Verify Page Breaks**
- Ensure no content is split
- Check section titles stay with content
- Verify spacing on continuation pages

### 3. **Visual Consistency**
- Background colors extend properly
- Margins and padding are consistent
- Typography hierarchy is maintained

### 4. **Edge Cases**
- Empty sections
- Very long single entries
- All sections at maximum capacity

## Code Examples

### Complete Section with Proper Grouping
```tsx
{/* Education Section */}
{data.education && data.education.length > 0 && (
  <View style={styles.section}>
    {data.education.map((edu, index) => (
      <View key={edu.id} wrap={false}>
        {index === 0 && (
          <Text style={styles.sectionTitle}>Education</Text>
        )}
        <View style={styles.educationItem}>
          <Text style={styles.degree}>{edu.degree}</Text>
          {edu.field && <Text style={styles.field}>{edu.field}</Text>}
          <Text style={styles.school}>{edu.school}</Text>
          <View style={styles.meta}>
            <Text>{edu.location}</Text>
            <Text>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</Text>
          </View>
          {edu.gpa && <Text style={styles.gpa}>GPA: {edu.gpa}</Text>}
          {edu.achievements && (
            <Text style={styles.achievements}>{edu.achievements}</Text>
          )}
        </View>
      </View>
    ))}
  </View>
)}
```

### Style Definition with Break Control
```tsx
export const styles = StyleSheet.create({
  educationItem: {
    marginBottom: 14,
    padding: '12 16',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    border: '1px solid #e5e7eb',
    breakInside: 'avoid',    // Critical for grouping
    keepTogether: true,      // Ensures unity
  },
  
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3,
  },
  
  // ... more styles
})
```

### Fixed Background Implementation
```tsx
<Page size="A4" style={styles.page} wrap={true}>
  {/* This appears on all pages */}
  <View style={styles.leftColumnBg} fixed />
  
  {/* Regular content */}
  <PDFHeader personal={data.personal} />
  <View style={styles.body}>
    <LeftColumn data={data} />
    <RightColumn data={data} />
  </View>
</Page>
```

## Summary

Creating effective PDF resume templates requires:
1. **Thoughtful grouping** of related content
2. **Strategic use** of wrap={false} and break styles
3. **Clean architecture** with separated concerns
4. **Consistent styling** across all elements
5. **Testing** with various content scenarios

By following these guidelines, you can create professional PDF resumes that handle pagination gracefully and maintain visual consistency across all pages.