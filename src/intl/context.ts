const contextTemplate = `
import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react'
import Storage from './storage'
import { LangEnum } from './typing'
import I18N, { Langs } from './index'

export interface I18NProps {
  I18N: Langs
  setLangTriggerRender: (lang: LangEnum) => void
}
export const I18NContext = createContext<I18NProps>({
  I18N,
  setLangTriggerRender: () => {},
})

export const LANG_STORAGE_KEY = 'currentLang'

export const I18NContextWrapper: React.FC = ({ children }) => {
  const i18nIns = useRef<Langs>(I18N)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useState({})
  const i18n = i18nIns.current
  useEffect(() => {
    Storage.get(LANG_STORAGE_KEY).then((lang: LangEnum) => {
      if (lang) {
        i18n.setLang(lang)
      } else {
        Storage.set(LANG_STORAGE_KEY, i18n.currentLang)
      }
      forceUpdate({})
    })
  }, [])
  function setLang(lang: LangEnum) {
    if (lang === i18n.currentLang) {
      return
    }
    i18n.setLangHandle(lang)
    Storage.set(LANG_STORAGE_KEY, lang)
    forceUpdate({})
  }
  return (
    <I18NContext.Provider value={{ setLangTriggerRender: setLang, I18N: i18n }}>
      {children}
    </I18NContext.Provider>
  )
}
export const useI18n = () => {
  return useContext(I18NContext)
}
`
export default contextTemplate
