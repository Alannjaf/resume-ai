import { FormInput } from '@/components/ui/form-input'
import { Input } from '@/components/ui/input'
import { TranslateAndEnhanceButton } from '@/components/ai/TranslateAndEnhanceButton'
import { useLanguage } from '@/contexts/LanguageContext'
import ImageUploader from '@/components/resume-builder/ImageUploader'
import { ResumeData } from '@/types/resume'
import { SubscriptionPermissions } from '@/types/subscription'

interface PersonalInfoSectionProps {
  formData: ResumeData
  updatePersonalField: (field: string, value: string) => void
  setFormData: (data: ResumeData) => void
  checkPermission?: (permission: keyof SubscriptionPermissions) => boolean
}

export function PersonalInfoSection({ 
  formData, 
  updatePersonalField,
  setFormData, 
  checkPermission
}: PersonalInfoSectionProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      {/* Profile Image Upload - Top Priority */}
      {checkPermission && checkPermission('canUploadPhoto') ? (
        <div className="flex justify-center">
          <ImageUploader
            currentImage={formData.personal.profileImage}
            originalImage={formData.personal.originalProfileImage}
            cropData={formData.personal.profileImageCrop}
            onImageUpload={(imageDataUrl, originalImage) => {
              setFormData({
                ...formData,
                personal: {
                  ...formData.personal,
                  profileImage: imageDataUrl,
                  originalProfileImage: originalImage || imageDataUrl
                }
              })
            }}
            onImageRemove={() => {
              setFormData({
                ...formData,
                personal: {
                  ...formData.personal,
                  profileImage: undefined,
                  originalProfileImage: undefined,
                  profileImageCrop: undefined
                }
              })
            }}
            onCropUpdate={(croppedImage, cropData) => {
              setFormData({
                ...formData,
                personal: {
                  ...formData.personal,
                  profileImage: croppedImage,
                  profileImageCrop: cropData
                }
              })
            }}
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-400 mb-2">📷</div>
            <p className="text-sm text-gray-600">{t('forms.personalInfo.photoUpgrade.title')}</p>
            <p className="text-xs text-gray-500 mt-1">{t('forms.personalInfo.photoUpgrade.description')}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.personalInfo.fields.fullName')} *
            </label>
            <FormInput
              value={formData.personal.fullName}
              onChange={(e) => updatePersonalField('fullName', e.target.value)}
              placeholder={t('forms.personalInfo.placeholders.fullName')}
              required
            />
            <TranslateAndEnhanceButton
              content={formData.personal.fullName}
              contentType="personal"
              onAccept={(enhancedName) => updatePersonalField('fullName', enhancedName)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.personalInfo.fields.professionalTitle')}
            </label>
            <FormInput
              value={formData.personal.title || ''}
              onChange={(e) => updatePersonalField('title', e.target.value)}
              placeholder={t('forms.personalInfo.placeholders.professionalTitle')}
            />
            <TranslateAndEnhanceButton
              content={formData.personal.title || ''}
              contentType="personal"
              onAccept={(enhancedTitle) => updatePersonalField('title', enhancedTitle)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.personalInfo.fields.email')} *
            </label>
            <FormInput
              type="email"
              value={formData.personal.email}
              onChange={(e) => updatePersonalField('email', e.target.value)}
              placeholder={t('forms.personalInfo.placeholders.email')}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.personalInfo.fields.phone')}
            </label>
            <Input
              value={formData.personal.phone}
              onChange={(e) => updatePersonalField('phone', e.target.value)}
              placeholder={t('forms.personalInfo.placeholders.phone')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.personalInfo.fields.location')}
            </label>
            <Input
              value={formData.personal.location}
              onChange={(e) => updatePersonalField('location', e.target.value)}
              placeholder={t('forms.personalInfo.placeholders.location')}
            />
            <TranslateAndEnhanceButton
              content={formData.personal.location || ''}
              contentType="personal"
              onAccept={(enhancedLocation) => updatePersonalField('location', enhancedLocation)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.personalInfo.fields.linkedin')}
            </label>
            <Input
              value={formData.personal.linkedin || ''}
              onChange={(e) => updatePersonalField('linkedin', e.target.value)}
              placeholder={t('forms.personalInfo.placeholders.linkedin')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.personalInfo.fields.website')}
            </label>
            <Input
              value={formData.personal.website || ''}
              onChange={(e) => updatePersonalField('website', e.target.value)}
              placeholder={t('forms.personalInfo.placeholders.website')}
            />
          </div>
        </div>
        
        {/* Optional Demographics Section */}
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t('forms.personalInfo.demographics.title')}
            </h3>
            <span className="text-sm text-gray-500">
              {t('forms.personalInfo.demographics.optional')}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {t('forms.personalInfo.demographics.description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.personalInfo.demographics.dateOfBirth')}
              </label>
              <Input
                type="date"
                value={formData.personal.dateOfBirth || ''}
                onChange={(e) => updatePersonalField('dateOfBirth', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.personalInfo.demographics.gender')}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.personal.gender || ''}
                onChange={(e) => updatePersonalField('gender', e.target.value)}
              >
                <option value="">{t('forms.personalInfo.demographics.selectGender')}</option>
                <option value="male">{t('forms.personalInfo.demographics.male')}</option>
                <option value="female">{t('forms.personalInfo.demographics.female')}</option>
                <option value="other">{t('forms.personalInfo.demographics.other')}</option>
                <option value="prefer-not-to-say">{t('forms.personalInfo.demographics.preferNotToSay')}</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {t('forms.personalInfo.demographics.nationality')}
                </label>
                <TranslateAndEnhanceButton
                  content={formData.personal.nationality || ''}
                  contentType="personal"
                  onAccept={(result) => updatePersonalField('nationality', result)}
                />
              </div>
              <Input
                placeholder={t('forms.personalInfo.demographics.nationalityPlaceholder')}
                value={formData.personal.nationality || ''}
                onChange={(e) => updatePersonalField('nationality', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.personalInfo.demographics.maritalStatus')}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.personal.maritalStatus || ''}
                onChange={(e) => updatePersonalField('maritalStatus', e.target.value)}
              >
                <option value="">{t('forms.personalInfo.demographics.selectMaritalStatus')}</option>
                <option value="single">{t('forms.personalInfo.demographics.single')}</option>
                <option value="married">{t('forms.personalInfo.demographics.married')}</option>
                <option value="divorced">{t('forms.personalInfo.demographics.divorced')}</option>
                <option value="widowed">{t('forms.personalInfo.demographics.widowed')}</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {t('forms.personalInfo.demographics.country')}
                </label>
                <TranslateAndEnhanceButton
                  content={formData.personal.country || ''}
                  contentType="personal"
                  onAccept={(result) => updatePersonalField('country', result)}
                />
              </div>
              <Input
                placeholder={t('forms.personalInfo.demographics.countryPlaceholder')}
                value={formData.personal.country || ''}
                onChange={(e) => updatePersonalField('country', e.target.value)}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}