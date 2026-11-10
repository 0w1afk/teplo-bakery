const dialog = document.querySelector<HTMLDialogElement>('#cart-dialog')!
const order = dialog.querySelector<HTMLFormElement>('#cart-order')!
const phone = order.querySelector<HTMLInputElement>('#cart-phone')!
const result = order.querySelector<HTMLElement>('.cart-result')!
const cartButton = document.querySelector<HTMLButtonElement>('#cart-trigger')!
const badge = cartButton.querySelector<HTMLElement>('#cart-count')!
const empty = dialog.querySelector<HTMLElement>('#cart-empty')!
const totalLabel = order.querySelector<HTMLElement>('#cart-total')!
const closeButton = dialog.querySelector<HTMLButtonElement>('.cart-close')!
const rows = [...order.querySelectorAll<HTMLElement>('.cart-row')]
const cards = [...document.querySelectorAll<HTMLFormElement>('.cart-add')]
const amounts = new Map<string, number>()
const key = 'teplo.cart.v1'
const currency = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
const validQty = (value: number) => Number.isInteger(value) && value >= 1 && value <= 999

function restore(raw: string | null) {
  amounts.clear()
  try {
    const saved = JSON.parse(raw ?? '{}')
    for (const row of rows) {
      const id = row.dataset.id!
      if (validQty(saved?.[id])) amounts.set(id, saved[id])
    }
  } catch { /* Ignore an unreadable saved cart. */ }
}

function updateLimits(container: HTMLElement, qty: number) {
  container.querySelector<HTMLButtonElement>('[data-step="-1"]')!.disabled = qty <= Number(container.querySelector('input')!.min)
  container.querySelector<HTMLButtonElement>('[data-step="1"]')!.disabled = qty >= 999
}

function render() {
  for (const card of cards) {
    const qty = amounts.get(card.dataset.product!)
    const input = card.querySelector('input')!
    const add = card.querySelector<HTMLButtonElement>('.cart-add-button')!
    if (qty !== undefined) input.value = String(qty)
    else if (add.hasAttribute('aria-haspopup')) input.value = input.defaultValue
    input.min = qty === undefined ? '1' : '0'
    const label = qty === undefined ? 'В корзину' : 'В корзине'
    if (add.textContent !== label) add.textContent = label
    if (qty === undefined) {
      add.removeAttribute('aria-haspopup')
      add.removeAttribute('aria-controls')
    } else {
      add.setAttribute('aria-haspopup', 'dialog')
      add.setAttribute('aria-controls', dialog.id)
    }
    updateLimits(card, input.valueAsNumber)
  }
  let count = 0
  let total = 0
  for (const row of rows) {
    const qty = amounts.get(row.dataset.id!) ?? 0
    const sum = qty * Number(row.dataset.price)
    const input = row.querySelector('input')!
    input.disabled = !qty
    row.hidden = !qty
    if (!qty) {
      input.value = input.defaultValue
      continue
    }
    if (input.valueAsNumber !== qty) input.value = String(qty)
    updateLimits(row, qty)
    row.querySelector<HTMLElement>('.row-sum')!.textContent = currency.format(sum)
    total += sum
    count += qty
  }
  badge.textContent = String(count)
  cartButton.setAttribute('aria-label', `Корзина, ${count} шт.`)
  totalLabel.textContent = currency.format(total)
  order.hidden = !count
  empty.hidden = !!count
  result.textContent = ''
  if (!count) phone.value = ''
}

function save() {
  render()
  try { localStorage.setItem(key, JSON.stringify(Object.fromEntries(amounts))) } catch { /* The cart still works in memory. */ }
}

try { restore(localStorage.getItem(key)) } catch { /* Storage may be unavailable. */ }
render()
window.addEventListener('storage', event => {
  if (event.key === key || event.key === null) {
    restore(event.newValue)
    render()
  }
})

function focusAfterRemoval() {
  const remaining = order.querySelector<HTMLButtonElement>('.cart-row:not([hidden]) .cart-remove')
  const target = remaining ?? closeButton
  target.focus()
}

function setQuantity(id: string, qty: number) {
  if (qty === 0) amounts.delete(id)
  else amounts.set(id, qty)
  save()
}

function bindStepper(container: HTMLElement, onChange: (qty: number) => void, fallback: () => number) {
  const input = container.querySelector('input')!
  function change() {
    const qty = input.valueAsNumber
    if (!input.validity.valid) return
    updateLimits(container, qty)
    onChange(qty)
  }
  input.addEventListener('input', change)
  input.addEventListener('blur', () => {
    if (!input.validity.valid) {
      input.value = String(fallback())
      updateLimits(container, input.valueAsNumber)
    }
  })
  for (const button of container.querySelectorAll<HTMLButtonElement>('[data-step]')) {
    button.addEventListener('click', () => {
      const current = input.validity.valid ? input.valueAsNumber : fallback()
      input.value = String(Math.min(999, Math.max(Number(input.min), current + Number(button.dataset.step))))
      change()
    })
  }
}

let returnFocus = cartButton
function openCart(button: HTMLButtonElement) {
  returnFocus = button
  result.textContent = ''
  dialog.showModal()
}

for (const card of cards) {
  const id = card.dataset.product!
  const input = card.querySelector('input')!
  bindStepper(card, qty => {
    if (amounts.has(id)) setQuantity(id, qty)
  }, () => amounts.get(id) ?? 1)
  card.addEventListener('submit', event => {
    event.preventDefault()
    if (amounts.has(id)) {
      openCart(card.querySelector<HTMLButtonElement>('.cart-add-button')!)
      return
    }
    if (!input.validity.valid) return
    setQuantity(id, Math.max(1, input.valueAsNumber))
  })
}

cartButton.addEventListener('click', () => openCart(cartButton))
closeButton.addEventListener('click', () => dialog.close())
dialog.addEventListener('close', () => returnFocus.focus({ preventScroll: true }))
order.querySelector('.cart-clear')!.addEventListener('click', () => {
  amounts.clear()
  save()
  closeButton.focus()
})

for (const row of rows) {
  const id = row.dataset.id!
  bindStepper(row, qty => {
    setQuantity(id, qty)
    if (qty === 0) focusAfterRemoval()
  }, () => amounts.get(id) ?? 1)
  row.querySelector('.cart-remove')!.addEventListener('click', () => {
    setQuantity(id, 0)
    focusAfterRemoval()
  })
}

function formatPhone(raw: string) {
  let digits = raw.replace(/\D/g, '')
  if (/^\s*\+7/.test(raw) || /^[78]\d{10}$/.test(digits) || raw === '8') digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (!digits) return raw.startsWith('+7') || raw === '8' ? '+7' : raw === '+' ? '+' : ''
  let text = '+7 (' + digits.slice(0, 3)
  if (digits.length > 3) text += ') ' + digits.slice(3, 6)
  if (digits.length > 6) text += '-' + digits.slice(6, 8)
  if (digits.length > 8) text += '-' + digits.slice(8, 10)
  return text
}

phone.addEventListener('paste', event => {
  const pasted = event.clipboardData?.getData('text') ?? ''
  if (!/^(?:[78])?\d{10}$/.test(pasted.replace(/\D/g, ''))) return
  event.preventDefault()
  phone.value = formatPhone(pasted)
  phone.setCustomValidity('')
  result.textContent = ''
})

phone.addEventListener('input', () => {
  const raw = phone.value
  const caret = phone.selectionStart ?? raw.length
  const digitsToRight = raw.slice(caret).replace(/\D/g, '').length
  phone.value = formatPhone(raw)
  let pos = phone.value.length
  let left = digitsToRight
  while (pos && left) if (/\d/.test(phone.value[--pos]!)) left--
  phone.setSelectionRange(pos, pos)
  phone.setCustomValidity('')
  result.textContent = ''
})
// Skip punctuation when deleting within a formatted number.
phone.addEventListener('beforeinput', event => {
  if (!(event instanceof InputEvent)) return
  const pos = phone.selectionStart ?? 0
  if (pos !== phone.selectionEnd) return
  if (event.inputType === 'deleteContentBackward') {
    let start = pos
    while (start > 0 && /\D/.test(phone.value[start - 1]!)) start--
    if (start !== pos) phone.setSelectionRange(Math.max(0, start - 1), pos)
  } else if (event.inputType === 'deleteContentForward') {
    let end = pos
    while (end < phone.value.length && /\D/.test(phone.value[end]!)) end++
    if (end !== pos) phone.setSelectionRange(pos, Math.min(end + 1, phone.value.length))
  }
})
order.addEventListener('submit', event => {
  event.preventDefault()
  phone.value = formatPhone(phone.value)
  if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone.value)) {
    phone.setCustomValidity('Введите все 10 цифр номера после +7.')
    phone.reportValidity()
    return
  }
  result.textContent = 'Заказ проверен. Это демоверсия, заказ не отправлен.'
})
