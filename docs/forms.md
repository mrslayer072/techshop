# Forms and validation

Two forms ship in the app:

- **Contact** (`src/components/ContactForm.tsx`) — name, email, subject, message
- **Checkout shipping step** (`src/components/CheckoutForm.tsx`) — full name, phone, address, postal code, province, city

Both follow the same validation pattern. This doc explains it once so a new field or new form can be added without re-deriving the rules.

---

## The validation library

All validators live in `src/lib/validation.ts`. Each validator has the same signature:

```ts
(value: string) => string | null;
```

- Returns a **Persian error message** when the input is invalid
- Returns `null` when the input is valid

Available validators:

| Function                             | Rule                                                             |
| ------------------------------------ | ---------------------------------------------------------------- |
| `validateName(value, label = "نام")` | 2–50 letters (Persian, Arabic, Latin, ZWNJ, spaces)              |
| `validateFullName(value)`            | As above, **plus** must contain ≥2 words separated by whitespace |
| `validateCity(value)`                | 2–40 letters                                                     |
| `validateProvince(value)`            | Non-empty (the select has a placeholder option with `value=""`)  |
| `validateAddress(value)`             | 10–250 characters                                                |
| `validateSubject(value)`             | 3–100 characters                                                 |
| `validateMessage(value)`             | 10–1000 characters                                               |
| `validateEmail(value)`               | RFC-ish regex: `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`                   |
| `validateIranianMobile(value)`       | Matches `^(?:\+98\|0098\|0)9\d{9}$` after digit normalization    |
| `validatePostalCode(value)`          | Exactly 10 ASCII digits after normalization                      |

Plus one helper:

```ts
toEnglishDigits(input: string): string
```

Maps Persian (۰–۹) and Arabic (٠–٩) digits to ASCII `0–9`. Phone and postal code inputs call this on `onChange` so the stored value is always ASCII and regex-friendly.

---

## The UI pattern

Every form does the same four things:

### 1. Track a `touched` flag per field

```ts
const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
  name: false,
  email: false,
  subject: false,
  message: false,
});
```

A field becomes `touched` on blur, or when the user tries to submit an invalid form. Errors are only displayed for touched fields — this prevents showing "Name is required" before the user has even clicked into the field.

### 2. Run validators every render

```ts
const rawErrors = {
  name: validateName(form.name),
  email: validateEmail(form.email),
  // …
};
const errors = {
  name: touched.name ? rawErrors.name : null,
  email: touched.email ? rawErrors.email : null,
  // …
};
const isValid = Object.values(rawErrors).every((e) => e === null);
```

`rawErrors` is the source of truth for "is the form valid". `errors` is what the UI renders.

### 3. On submit, reveal all errors if invalid

```ts
const handleSubmit = (e) => {
  e.preventDefault();
  if (!isValid) {
    setTouched({ name: true, email: true, subject: true, message: true });
    return;
  }
  // …proceed
};
```

This handles the case where the user clicks "Submit" without ever blurring a field.

### 4. Render error state consistently

Each field gets:

- A red border when in error (`border-danger`)
- `aria-invalid={!!errors.field}` for screen readers
- A `<p className="text-xs text-danger mt-1.5">` below the input with the message
- `maxLength` on the input matching the validator's upper bound — cheaper than letting the user type 10k characters and then erroring

Textareas with length caps also render a `{count}/{max}` counter on the right.

---

## Adding a new form

1. Add or reuse validators in `src/lib/validation.ts`.
2. In the component:
   - Hold a `form` state object with all field values
   - Hold a `touched` state object with `boolean` flags
   - Compute `rawErrors` and `errors` in the render body
   - Wire `onBlur` → `markTouched` on each input
   - Wire `onSubmit` to check `isValid` and mark all touched if not
3. Use the shared input class pattern from the existing forms — the red-border-on-error variant should match.

Don't reach for a form library. Two forms doesn't earn the dependency.

---

## Validator design notes

- **Regexes stay simple.** `EMAIL_RE` is intentionally loose — full RFC 5322 is wrong to try to match with a regex, and catching typos (`foo@bar`) is the real goal.
- **Length bounds are low-effort guards**, not security. The real backend (when it exists) will re-validate.
- **The letter regex** is `/^[a-zA-Z\u0600-\u06FF\s\u200c]+$/` — Latin + the Arabic/Persian Unicode block + whitespace + ZWNJ (U+200C, used to join Persian compounds like `پلی‌استیشن`).
- **Iranian mobile format** accepts three prefixes: `09`, `+989`, `00989`. The backend will normalize; the frontend just checks shape.
- **Postal code** is 10 digits in Iran. Nothing fancier — no checksum in the public spec.

---

## iOS zoom on focus

`globals.css` sets `input, select, textarea` to `font-size: 16px` on screens ≤767px. iOS Safari auto-zooms whenever an input's computed font-size is below 16px, and that's disorienting on mobile. The layout everywhere else still uses Tailwind's `text-sm`.
