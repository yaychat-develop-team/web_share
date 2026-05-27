export type ToastType = 'info' | 'success' | 'error' | 'warning'

export type ToastOptions = {
  message: string
  duration?: number
  type?: ToastType
}

type ToastInput = string | ToastOptions
type ToastFn = (input: ToastInput) => void

export type ToastApi = ToastFn & {
  success: ToastFn
  error: ToastFn
  warning: ToastFn
  info: ToastFn
}

const TOAST_DURATION = 2000
const TOAST_GAP = 12
const TOAST_Z_INDEX = 9999

let toastSeed = 0

const toastColorMap: Record<ToastType, string> = {
  info: 'rgba(31, 41, 55, 0.9)',
  success: 'rgba(5, 150, 105, 0.9)',
  error: 'rgba(220, 38, 38, 0.92)',
  warning: 'rgba(217, 119, 6, 0.92)',
}

const getToastContainer = () => {
  let container = document.getElementById('global-toast-container')
  if (container) return container

  container = document.createElement('div')
  container.id = 'global-toast-container'
  container.style.position = 'fixed'
  container.style.left = '50%'
  container.style.top = '20vh'
  container.style.transform = 'translateX(-50%)'
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.alignItems = 'center'
  container.style.gap = `${TOAST_GAP}px`
  container.style.zIndex = String(TOAST_Z_INDEX)
  container.style.pointerEvents = 'none'
  container.style.width = 'calc(100% - 32px)'
  container.style.maxWidth = '375px'

  document.body.appendChild(container)
  return container
}

const normalizeInput = (input: ToastInput, type: ToastType = 'info') => {
  if (typeof input === 'string') {
    return { message: input, type, duration: TOAST_DURATION }
  }

  return {
    message: input.message,
    type: input.type ?? type,
    duration: input.duration ?? TOAST_DURATION,
  }
}

const createToastElement = (message: string, type: ToastType) => {
  const item = document.createElement('div')
  item.dataset.toastId = `toast-${Date.now()}-${toastSeed++}`
  item.textContent = message
  item.style.maxWidth = '100%'
  item.style.padding = '10px 14px'
  item.style.borderRadius = '8px'
  item.style.color = '#fff'
  item.style.fontSize = '14px'
  item.style.lineHeight = '20px'
  item.style.textAlign = 'center'
  item.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.18)'
  item.style.backgroundColor = toastColorMap[type]
  item.style.wordBreak = 'break-word'
  item.style.opacity = '0'
  item.style.transform = 'translateY(-8px)'
  item.style.transition = 'opacity 0.2s ease, transform 0.2s ease'

  return item
}

const showToast: ToastFn = (input) => {
  const { message, type, duration } = normalizeInput(input)
  if (!message) return

  const container = getToastContainer()
  const item = createToastElement(message, type)
  container.appendChild(item)

  requestAnimationFrame(() => {
    item.style.opacity = '1'
    item.style.transform = 'translateY(0)'
  })

  window.setTimeout(() => {
    item.style.opacity = '0'
    item.style.transform = 'translateY(-8px)'

    window.setTimeout(() => {
      item.remove()
      if (!container.childElementCount) {
        container.remove()
      }
    }, 200)
  }, duration)
}

const withType = (type: ToastType): ToastFn => (input) => {
  showToast(typeof input === 'string' ? { message: input, type } : { ...input, type })
}

export const toast: ToastApi = Object.assign(showToast, {
  success: withType('success'),
  error: withType('error'),
  warning: withType('warning'),
  info: withType('info'),
})
