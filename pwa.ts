import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useRegisterServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])
}

/** Exposes the browser's "install app" prompt when it is available. */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  )
  const installed = useSyncExternalStore(
    subscribeStandalone,
    () => window.matchMedia('(display-mode: standalone)').matches,
    () => false,
  )

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setDeferred(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferred) return false
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    return outcome === 'accepted'
  }, [deferred])

  return { canInstall: !!deferred, installed, install }
}

function subscribeStandalone(onChange: () => void) {
  const mq = window.matchMedia('(display-mode: standalone)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export type NotificationState = NotificationPermission | 'unsupported'

const permissionListeners = new Set<() => void>()

function subscribePermission(onChange: () => void) {
  permissionListeners.add(onChange)
  return () => permissionListeners.delete(onChange)
}

export function useNotificationPermission() {
  const state = useSyncExternalStore<NotificationState>(
    subscribePermission,
    () => ('Notification' in window ? Notification.permission : 'unsupported'),
    () => 'default',
  )

  const request = useCallback(async (): Promise<NotificationState> => {
    if (!('Notification' in window)) return 'unsupported'
    const result = await Notification.requestPermission()
    permissionListeners.forEach((l) => l())
    return result
  }, [])

  return { state, request }
}

/** A JSON value persisted in localStorage, safe to read during SSR. */
export function useLocalStorageState<T>(key: string, fallback: T) {
  const raw = useSyncExternalStore(
    subscribeStorage,
    () => localStorage.getItem(key),
    () => null,
  )
  const value: T = raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  const setValue = useCallback(
    (next: T) => {
      localStorage.setItem(key, JSON.stringify(next))
      storageListeners.forEach((l) => l())
    },
    [key],
  )
  return [value, setValue] as const
}

const storageListeners = new Set<() => void>()

function subscribeStorage(onChange: () => void) {
  storageListeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    storageListeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

/** Shows a local notification through the service worker (works when installed). */
export async function showLocalNotification(title: string, body: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false
  }
  const options = {
    body,
    icon: '/.netlify/images?url=/img/icon.png&w=192&h=192&fm=png',
  }
  const reg = await navigator.serviceWorker?.getRegistration()
  if (reg) await reg.showNotification(title, options)
  else new Notification(title, options)
  return true
}
