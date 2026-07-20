import { LocaleProvider } from '@/app/components/LocaleProvider'

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  return (
    <LocaleProvider locale={locale}>
      {children}
    </LocaleProvider>
  )
}