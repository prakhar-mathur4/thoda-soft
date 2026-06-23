// Reference-counted body scroll lock so nested modals don't unlock prematurely.
let count = 0;

export function lockScroll() {
  count += 1;
  document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
  count = Math.max(0, count - 1);
  if (count === 0) document.body.style.overflow = '';
}
