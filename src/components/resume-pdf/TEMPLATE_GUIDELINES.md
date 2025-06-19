# PDF Resume Template Development Guidelines

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture Best Practices](#architecture-best-practices)
3. [Page Break Management](#page-break-management)
4. [Content Grouping Strategies](#content-grouping-strategies)
5. [Template Selection System](#template-selection-system)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [What to Avoid](#what-to-avoid)
8. [Testing Guidelines](#testing-guidelines)
9. [Code Examples](#code-examples)

## Overview

This guide provides best practices for creating PDF resume templates using @react-pdf/renderer that handle page breaks gracefully and maintain professional appearance across multiple pages.

## Architecture Best Practices

### 1. File Structure
```
resume-pdf/
├── EnhancedModernTemplate.tsx    # Modern professional template
├── CreativeTemplate.tsx          # Creative artistic template
├── components/
│   ├── PDFHeader.tsx             # Header with profile image
│   ├── LeftColumn.tsx            # Skills, education, etc.
│   ├── RightColumn.tsx           # Experience, projects, etc.
│   ├── CreativeHeader.tsx        # Creative template header
│   ├── CreativeContent.tsx       # Creative template content
│   ├── CreativeSidebar.tsx       # Creative template sidebar
│   └── CreativeMainSection.tsx   # Creative template main content
├── styles/
│   ├── pdfStyles.ts              # Modern template layout styles
│   ├── experienceStyles.ts       # Experience & education styles
│   ├── skillsStyles.ts           # Skills, projects, certs styles
│   ├── creativeStyles.ts         # Creative template main styles
│   ├── creativeSectionStyles.ts  # Creative template sections
│   └── creativeSidebarStyles.ts  # Creative template sidebar
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
For sections with multiple small items, wrap the entire section to prevent title separation:
```tsx
{/* Skills Section - Wrap entire section */}
<View style={styles.section} wrap={false}>
  <Text style={styles.sectionTitle}>Skills</Text>
  <View style={styles.skillsGrid}>
    {/* All skill items */}
  </View>
</View>

{/* Languages Section - Group title with first item */}
{data.languages.map((language, index) => (
  <View key={language.id} wrap={false}>
    {index === 0 && <Text style={styles.sectionTitle}>Languages</Text>}
    <View style={styles.languageItem}>{/* Language content */}</View>
  </View>
))}
```

## Template Selection System

### 1. **Template Gallery Architecture**
Implement a visual template selection system instead of dropdown menus:

```tsx
// TemplateGallery.tsx - Visual template picker
interface TemplateOption {
  id: string
  name: string
  description: string
  category: 'professional' | 'creative' | 'minimal'
}

export function TemplateGallery({ selectedTemplate, onTemplateSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className={`cursor-pointer rounded-lg border-2 ${
            selectedTemplate === template.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onTemplateSelect(template.id)}
        >
          <TemplateThumbnail templateId={template.id} />
          <div className="p-4">
            <h4>{template.name}</h4>
            <p>{template.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 2. **Template Thumbnail System**
**IMPORTANT**: Every new template MUST have a corresponding thumbnail for the template gallery.

#### 2.1 **Creating SVG Thumbnails**
Create static SVG thumbnails that accurately represent your template design:

**File Structure:**
```
public/thumbnails/
├── modern.svg     # Modern template thumbnail
├── creative.svg   # Creative template thumbnail
└── [template-id].svg  # New template thumbnail
```

**SVG Template Guidelines:**
- **Dimensions**: 300x400 (3:4 aspect ratio matching A4 proportions)
- **ViewBox**: `viewBox="0 0 300 400"`
- **Colors**: Use actual template colors and styling
- **Layout**: Mirror the template's layout structure
- **Elements**: Include key visual elements (sidebars, sections, decorative elements)

**Example SVG Structure:**
```svg
<svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Page background -->
  <rect width="300" height="400" fill="white" stroke="#e5e7eb" stroke-width="1"/>
  
  <!-- Template-specific layout elements -->
  <!-- Sidebar, header, content sections, etc. -->
  
  <!-- Use template's actual colors and proportions -->
</svg>
```

#### 2.2 **Thumbnail Component Implementation**
The TemplateThumbnail component uses Next.js Image for optimal performance:

```tsx
// TemplateThumbnail.tsx - Static SVG thumbnails
export function TemplateThumbnail({ templateId, className = '' }) {
  const getThumbnailSrc = () => {
    switch (templateId) {
      case 'modern':
        return '/thumbnails/modern.svg'
      case 'creative':
        return '/thumbnails/creative.svg'
      case 'your-new-template':  // Add new template here
        return '/thumbnails/your-new-template.svg'
      default:
        return '/thumbnails/modern.svg'
    }
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={getThumbnailSrc()}
        alt={`${templateId} template preview`}
        width={300}
        height={400}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  )
}
```

#### 2.3 **Adding New Template Thumbnails**

**Step 1: Create SVG Thumbnail**
1. Analyze your template's key visual elements
2. Create `/public/thumbnails/[template-id].svg`
3. Use template's actual colors, layout, and proportions
4. Include distinctive features (sidebars, headers, decorative elements)

**Step 2: Update Thumbnail Component**
Add your template case to `TemplateThumbnail.tsx`:
```tsx
case 'your-template-id':
  return '/thumbnails/your-template-id.svg'
```

**Step 3: Update Template Gallery**
Add template to the gallery options in `TemplateGallery.tsx`:
```tsx
const templates: TemplateOption[] = [
  // ... existing templates
  {
    id: 'your-template-id',
    name: 'Your Template Name',
    description: 'Template description',
    category: 'professional' | 'creative' | 'minimal'
  }
]
```

#### 2.4 **Thumbnail Design Best Practices**
- **Accuracy**: Thumbnail should closely represent the actual PDF output
- **Clarity**: Key sections should be clearly distinguishable at small sizes
- **Consistency**: Maintain visual hierarchy and proportions from the template
- **Performance**: SVG format ensures fast loading and scalability
- **Accessibility**: Include meaningful alt text for screen readers

### 3. **PDF Generator Integration**
Update the PDF generator to support multiple templates and ensure new templates are properly integrated:

```tsx
// pdfGenerator.ts - Template switching logic
const getTemplate = (template: string, data: ResumeData) => {
  switch (template) {
    case 'creative':
      return CreativeTemplate({ data })
    case 'modern':
    default:
      return EnhancedModernTemplate({ data })
  }
}

export const generateResumePDF = async (
  resumeData: ResumeData, 
  fileName?: string, 
  template: string = 'modern'
) => {
  const templateComponent = getTemplate(template, resumeData)
  const blob = await pdf(templateComponent).toBlob()
  saveAs(blob, fileName || `${resumeData.personal.fullName}_Resume.pdf`)
}
```

### 4. **Resume Builder Integration**
Add template selection as the first step in the resume building process:

```tsx
// Form sections with template selection first
const FORM_SECTIONS = [
  { id: 'template', title: 'Choose Template', icon: '🎨' },
  { id: 'personal', title: 'Personal Information', icon: '👤' },
  // ... other sections
]

// Template selection step
{currentSection === 0 && (
  <TemplateGallery
    selectedTemplate={selectedTemplate}
    onTemplateSelect={setSelectedTemplate}
  />
)}
```

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

### Issue 5: Border Radius Percentage Values
**Problem:** `borderRadius: '50%'` causes "Invalid border radius" errors
**Solution:** Use pixel values for circular elements
```tsx
// ❌ AVOID - Percentage values
profileImage: {
  width: 75,
  height: 75,
  borderRadius: '50%',  // This will cause errors
}

// ✅ CORRECT - Pixel values
profileImage: {
  width: 75,
  height: 75,
  borderRadius: 37.5,  // Half of width/height for circles
}

backgroundCircle: {
  width: 200,
  height: 200,
  borderRadius: 100,   // Half of width/height
}
```

### Issue 6: Section Title Separation from Content
**Problem:** Section titles appear alone at bottom of pages
**Solution:** Always group titles with first content item or wrap entire section
```tsx
// ❌ AVOID - Title can be orphaned
<Text style={styles.sectionTitle}>Languages</Text>
{data.languages.map(lang => <View>{/* content */}</View>)}

// ✅ CORRECT - Title grouped with first item
{data.languages.map((lang, index) => (
  <View key={lang.id} wrap={false}>
    {index === 0 && <Text style={styles.sectionTitle}>Languages</Text>}
    <View>{/* content */}</View>
  </View>
))}
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

### ❌ **DON'T Use Percentage Values for Border Radius**
```tsx
// AVOID - Causes "Invalid border radius" errors
borderRadius: '50%'
borderRadius: '10%'

// BETTER - Use pixel values
borderRadius: 37.5  // For 75x75 circle
borderRadius: 8     // For rounded corners
```

### ❌ **DON'T Separate Section Titles from Content**
```tsx
// AVOID - Title can be orphaned
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Section Title</Text>
  {items.map(item => <View wrap={false}>{/* content */}</View>)}
</View>

// BETTER - Group title with first item
<View style={styles.section}>
  {items.map((item, index) => (
    <View key={item.id} wrap={false}>
      {index === 0 && <Text style={styles.sectionTitle}>Section Title</Text>}
      <View>{/* content */}</View>
    </View>
  ))}
</View>
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
1. **Thoughtful grouping** of related content with proper `wrap={false}` usage
2. **Strategic section title placement** - always group with first content item
3. **Clean architecture** with separated concerns and modular components
4. **Consistent styling** using pixel values (not percentages) for borders
5. **Visual template selection** system with thumbnail previews
6. **Built-in fonts only** to avoid loading errors
7. **Comprehensive testing** with various content scenarios and page breaks

### Key Implementation Patterns:
- **Multiple Items**: Group title with first item using `index === 0`
- **Single Sections**: Wrap entire section with `wrap={false}`
- **Circular Elements**: Use pixel values (width/2) for `borderRadius`
- **Fixed Backgrounds**: Use `fixed` prop for elements on all pages
- **Template Selection**: Implement visual gallery instead of dropdowns

By following these guidelines, you can create professional PDF resumes that handle pagination gracefully, maintain visual consistency across all pages, and provide an excellent user experience for template selection.