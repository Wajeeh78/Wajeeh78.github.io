/* Light and dark mode. The choice lives on <html data-theme>. index.html sets it
   before the first paint (saved choice, else light), so there is no flash. */

export type Theme = 'light' | 'dark'

export const THEME_EVENT = 'theme:change'
const KEY = 'theme'

export const getTheme = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* private mode: the choice just isn't remembered */
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f5f7' : '#000000')
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }))
}
