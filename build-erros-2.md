C:\Users\Multimedia\Desktop\Projects\resume-ai>npm run build

> resume-ai@1.0.0 build
> next build

   ▲ Next.js 15.3.3
   - Environments: .env.local, .env

   Creating an optimized production build ...
 ✓ Compiled successfully in 5.0s

./src/app/api/admin/users/route.ts
29:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/app/api/pricing/route.ts
65:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/resume/upload/route.ts
85:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
162:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
192:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
202:57  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
213:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
218:58  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
235:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
242:68  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
262:16  Warning: 'pdfError' is defined but never used.  @typescript-eslint/no-unused-vars
262:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
352:16  Warning: 'aiError' is defined but never used.  @typescript-eslint/no-unused-vars
352:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
371:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/resumes/route.ts
23:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
136:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/resumes/[id]/route.ts
43:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
149:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
185:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/user/admin-status/route.ts
18:12  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
23:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/user/subscription/route.ts
3:10  Warning: 'checkUserLimits' is defined but never used.  @typescript-eslint/no-unused-vars
23:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
28:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/api/webhooks/clerk/route.ts
41:12  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
89:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
101:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/billing/page.tsx
107:19  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
265:40  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
266:34  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
266:81  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/app/billing/payment-instructions/page.tsx
266:24  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
286:14  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/app/dashboard/page.tsx
37:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
48:11  Warning: 'toastId' is assigned a value but never used.  @typescript-eslint/no-unused-vars
83:32  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/resume-builder/import/page.tsx
20:10  Warning: 'userPlan' is assigned a value but never used.  @typescript-eslint/no-unused-vars
30:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
74:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
128:15  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/app/resume-builder/page.tsx
154:18  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
179:60  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
183:58  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
187:54  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
191:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
204:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/admin/AdminDashboard.tsx
60:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
107:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
155:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
175:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/admin/UserManagement.tsx
38:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
82:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/ai/AIProfessionalSummary.tsx
27:3  Warning: 'currentSummary' is defined but never used.  @typescript-eslint/no-unused-vars
29:3  Warning: 'personalInfo' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/resume-builder/EducationForm.tsx
32:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/resume-builder/LanguagesForm.tsx
45:35  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
90:40  Warning: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
90:53  Warning: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities

./src/components/resume-builder/PreviewModal.tsx
121:6  Warning: React Hook useEffect has a missing dependency: 'pdfUrl'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./src/components/resume-builder/ResumePreview.tsx
10:39  Warning: 'template' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./src/components/resume-builder/ResumeUploader.tsx
8:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
104:59  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
177:25  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/components/resume-builder/SkillsForm.tsx
59:29  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
110:40  Warning: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
110:50  Warning: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities

./src/components/resume-builder/WorkExperienceForm.tsx
35:77  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/resume-pdf/components/RightColumn.tsx
11:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/ui/input.tsx
4:18  Warning: An interface declaring no members is equivalent to its supertype.  @typescript-eslint/no-empty-object-type

./src/contexts/LanguageContext.tsx
29:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/lib/admin.ts
14:12  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
17:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars

./src/lib/db.ts
116:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
162:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
181:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/lib/init-db.ts
20:10  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
59:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
67:10  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/lib/resume-parser.ts
9:25  Warning: 'buffer' is defined but never used.  @typescript-eslint/no-unused-vars
20:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/lib/system-settings.ts
65:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
Failed to compile.

./src/components/resume-pdf/components/CreativeHeader.tsx:21:17
Type error: No overload matches this call.
  Overload 1 of 2, '(props: ImageProps): Image', gave the following error.
    Type '{ src: string; style: { width: number; height: number; borderRadius: number; }; alt: string; }' is not assignable to type 'IntrinsicAttributes & (IntrinsicClassAttributes<Image> & Readonly<ImageProps>)'.
      Property 'alt' does not exist on type 'IntrinsicAttributes & (IntrinsicClassAttributes<Image> & Readonly<ImageProps>)'.     
  Overload 2 of 2, '(props: ImageProps, context: any): Image', gave the following error.
    Type '{ src: string; style: { width: number; height: number; borderRadius: number; }; alt: string; }' is not assignable to type 'IntrinsicAttributes & (IntrinsicClassAttributes<Image> & Readonly<ImageProps>)'.
      Property 'alt' does not exist on type 'IntrinsicAttributes & (IntrinsicClassAttributes<Image> & Readonly<ImageProps>)'.     

  19 |                 src={personal.profileImage}
  20 |                 style={styles.profileImage}
> 21 |                 alt="Profile photo"
     |                 ^
  22 |               />
  23 |             </View>
  24 |           </View>
Next.js build worker exited with code: 1 and signal: null

C:\Users\Multimedia\Desktop\Projects\resume-ai>