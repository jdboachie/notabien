let activeEffect = null;

export function state(value) {
  const signal = { value, subscribers: new Set([])}
  return signal
}

export function effect(fn) {
  activeEffect = fn
  fn()
}

export function derived(fn) {
  let value = state(fn)
  effect(() => set(value, fn()))
  return value
}

export function get(signal) {
  if (activeEffect) {
    signal.subscribers.add(activeEffect)
  }
  return signal.value
}

export function set(signal, value) {
  signal.value = value
  signal.subscribers.forEach(effect => effect())
}
