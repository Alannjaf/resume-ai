C:\Users\Multimedia\Desktop\Projects\resume-ai>npm run build

> resume-ai@1.0.0 build
> next build

   ▲ Next.js 15.3.3
   - Environments: .env.local, .env

   Creating an optimized production build ...
<w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (146kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
 ✓ Compiled successfully in 5.0s

Failed to compile.

./src/app/api/admin/users/route.ts
29:22  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/app/api/pricing/route.ts
65:12  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/resume/upload/route.ts
85:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
162:51  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
192:59  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
202:57  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
213:53  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
218:58  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
235:56  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
242:68  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
262:16  Error: 'pdfError' is defined but never used.  @typescript-eslint/no-unused-vars
262:26  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
352:16  Error: 'aiError' is defined but never used.  @typescript-eslint/no-unused-vars
352:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
371:12  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/resumes/route.ts
23:12  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
136:12  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/resumes/[id]/route.ts
43:12  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
149:12  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
185:12  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/user/admin-status/route.ts
18:12  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
23:14  Error: 'e' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/user/subscription/route.ts
3:10  Error: 'checkUserLimits' is defined but never used.  @typescript-eslint/no-unused-vars
23:11  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
28:12  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/webhooks/clerk/route.ts
41:12  Error: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
89:14  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
101:14  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/billing/page.tsx
8:24  Error: 'Crown' is defined but never used.  @typescript-eslint/no-unused-vars
107:19  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
265:40  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
266:34  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
266:81  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/app/billing/payment-instructions/page.tsx
9:29  Error: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
266:24  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
286:14  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/app/dashboard/page.tsx
37:16  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
48:11  Error: 'toastId' is assigned a value but never used.  @typescript-eslint/no-unused-vars
83:32  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/resume-builder/import/page.tsx
20:10  Error: 'userPlan' is assigned a value but never used.  @typescript-eslint/no-unused-vars
30:16  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
74:14  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
128:15  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/app/resume-builder/page.tsx
18:10  Error: 'WorkExperience' is defined but never used.  @typescript-eslint/no-unused-vars
18:26  Error: 'Education' is defined but never used.  @typescript-eslint/no-unused-vars
18:37  Error: 'Skill' is defined but never used.  @typescript-eslint/no-unused-vars
18:44  Error: 'Language' is defined but never used.  @typescript-eslint/no-unused-vars
154:18  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
179:60  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
183:58  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
187:54  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
191:59  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
204:16  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/admin/AdminDashboard.tsx
60:9  Error: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
107:14  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
155:14  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
175:14  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/admin/UserManagement.tsx
17:3  Error: 'MoreVertical' is defined but never used.  @typescript-eslint/no-unused-vars
19:3  Error: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
40:9  Error: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
84:14  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/ai/AIProfessionalSummary.tsx
27:3  Error: 'currentSummary' is defined but never used.  @typescript-eslint/no-unused-vars
29:3  Error: 'personalInfo' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/landing/pricing.tsx
4:23  Error: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/resume-builder/EducationForm.tsx
32:71  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/resume-builder/LanguagesForm.tsx
45:35  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
90:40  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
90:53  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities

./src/components/resume-builder/PreviewModal.tsx
121:6  Warning: React Hook useEffect has missing dependencies: 'generatePDFPreview' and 'pdfUrl'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps

./src/components/resume-builder/ResumePreview.tsx
10:39  Error: 'template' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./src/components/resume-builder/ResumeUploader.tsx
8:28  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
104:59  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
177:25  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/components/resume-builder/SkillsForm.tsx
59:29  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
110:40  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
110:50  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities

./src/components/resume-builder/TemplateGallery.tsx
3:17  Error: 'useState' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/resume-builder/WorkExperienceForm.tsx
3:10  Error: 'useState' is defined but never used.  @typescript-eslint/no-unused-vars
35:77  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/resume-pdf/components/CreativeHeader.tsx
18:15  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text

./src/components/resume-pdf/components/ExecutiveHeader.tsx
47:13  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text

./src/components/resume-pdf/components/PDFHeader.tsx
16:11  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text

./src/components/resume-pdf/components/RightColumn.tsx
11:16  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/ui/input.tsx
4:18  Error: An interface declaring no members is equivalent to its supertype.  @typescript-eslint/no-empty-object-type

./src/contexts/LanguageContext.tsx
29:44  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/lib/admin.ts
14:12  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
17:14  Error: 'e' is defined but never used.  @typescript-eslint/no-unused-vars

./src/lib/db.ts
116:20  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
162:11  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
181:12  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/lib/init-db.ts
20:10  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
59:16  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
67:10  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/lib/resume-parser.ts
9:25  Error: 'buffer' is defined but never used.  @typescript-eslint/no-unused-vars
20:14  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/lib/system-settings.ts
65:50  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules    

C:\Users\Multimedia\Desktop\Projects\resume-ai>