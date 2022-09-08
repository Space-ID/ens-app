import React, { createRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

import { useOnClickOutside } from 'components/hooks'
import RotatingSmallCaret from '../Icons/RotatingSmallCaret'

import './LanguageSwitcher.scss'
import LanguageEarthIcon from 'components/Icons/LanguageEarthIcon'

const LANGUAGES = [
  {
    value: 'en',
    label: 'English (EN)',
  },
  {
    value: 'cn',
    label: '简体中文 (CN)',
  },
  {
    value: 'ja',
    label: '日本語 (JA)',
  },
  {
    value: 'de',
    label: 'Deutsch (DE)',
  },
  {
    value: 'es',
    label: 'Español (ES)',
  },
  {
    value: 'fr',
    label: 'Français (FR)',
  },
  {
    value: 'ko',
    label: '한국어 (KO)',
  },
  {
    value: 'it',
    label: 'Italiano (IT)',
  },
  {
    value: 'pl',
    label: 'Polski (PL)',
  },
  {
    value: 'pt-BR',
    label: 'Português (BR)',
  },
  {
    value: 'ru',
    label: 'Pусский (RU)',
  },
  {
    value: 'vi',
    label: 'Tiếng Việt (VI)',
  },
]

function getLang(lang) {
  return LANGUAGES.find((l) => l.value === lang)
}

function saveLanguageToLocalStorage(value) {
  window.localStorage.setItem('language', value)
}

function getLanguageFromLocalStorage() {
  return window.localStorage.getItem('language')
}

export default function LanguageSwitcher() {
  const dropdownRef = createRef()
  const togglerRef = createRef()
  const [languageSelected, setLanguageSelected] = useState(
    getLang(getLanguageFromLocalStorage()) ?? getLang('en')
  )
  const [showDropdown, setShowDropdown] = useState(false)
  const { i18n } = useTranslation()

  useOnClickOutside([dropdownRef, togglerRef], () => setShowDropdown(false))

  function changeLanguage(language) {
    setLanguageSelected(language)
    saveLanguageToLocalStorage(language.value)
    i18n.changeLanguage(language.value)
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      <div
        className="text-[#adbbcd] uppercase flex justify-enter h-full py-0 px-[6px] items-center hover:cursor-pointer"
        ref={togglerRef}
        onClick={() => setShowDropdown((show) => !show)}
      >
        <span className="mr-1 text-base font-semibold text-green-200 font-urbanist">
          {languageSelected.value}
        </span>
        <LanguageEarthIcon />
        {/* <RotatingSmallCaret
          start="top"
          rotated={showDropdown ? 1 : 0}
          highlight={1}
        /> */}
      </div>
      {showDropdown && (
        <AnimatePresence>
          <motion.ul
            className="w-[140px] list-none absolute bg-dark-common bottom-[35px] right-0 mt-[10px] rounded-xl shadow-dropdown z-[2] max-h-[120px] overflow-y-auto dropdown-container border border-green-100"
            ref={dropdownRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {LANGUAGES.map((language) => {
              return (
                <li
                  className="px-4 py-3 text-base text-green-200 font-urbanist"
                  key={language.value}
                  onClick={() => changeLanguage(language)}
                >
                  {language.label}
                </li>
              )
            })}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  )
}
