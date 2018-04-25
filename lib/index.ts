interface Registration {
  keys: string;
  fn(e: KeyboardEvent): void;
}

const registrations: Registration[] = [];

function handleKey(e: KeyboardEvent): void {
  const registration = registrations.find(registration => registration.keys === e.code);
  if (registration) {
    registration.fn(e);
  }
}

export function install(el = document): void {
  el.addEventListener('keydown', handleKey);
  el.addEventListener('keypress', handleKey);
  el.addEventListener('keyup', handleKey);
}

export function uninstall(el = document): void {
  el.removeEventListener('keydown', handleKey);
  el.removeEventListener('keypress', handleKey);
  el.removeEventListener('keyup', handleKey);
}

export function bind(keys: string, fn: (e: KeyboardEvent) => void): void {
  registrations.push({keys: `Key${keys.toUpperCase()}`, fn});
}
