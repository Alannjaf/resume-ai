export const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export const formatDateRange = (startDate: string | undefined, endDate: string | undefined, current: boolean) => {
  const start = formatDate(startDate || '')
  const end = current ? 'Present' : formatDate(endDate || '')
  return `${start} - ${end}`
}