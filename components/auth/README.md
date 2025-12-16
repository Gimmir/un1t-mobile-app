# Auth Components

Reusable authentication components for the UN1T mobile app.

## Components

### `AuthLayout`
Main layout wrapper for authentication screens with header, progress dots, and keyboard handling.

**Props:**
- `children: ReactNode` - Screen content
- `currentStep?: number` - Current step number (1-based)
- `totalSteps?: number` - Total number of steps
- `showHeader?: boolean` - Show/hide header (default: true)
- `scrollable?: boolean` - Enable scrolling (default: true)
- `onBack?: () => void` - Custom back handler

**Example:**
```tsx
<AuthLayout currentStep={1} totalSteps={5}>
  <View className="px-5">
    {/* Your form content */}
  </View>
</AuthLayout>
```

---

### `AuthHeader`
Header with close button and progress indicator.

**Props:**
- `currentStep: number` - Current step (1-based)
- `totalSteps: number` - Total steps
- `onBack?: () => void` - Custom back handler

---

### `ProgressDots`
Visual progress indicator showing current step.

**Props:**
- `currentStep: number` - Active step (1-based)
- `totalSteps: number` - Total number of steps

---

### `CustomInput`
Styled text input with validation support, type-specific features (password visibility toggle, clear button).

**Props:**
- `control: Control<T>` - React Hook Form control
- `name: Path<T>` - Field name
- `error?: FieldError` - Validation error
- `placeholder: string` - Placeholder text
- `type?: 'text' | 'email' | 'password' | 'phone'` - Input type (default: 'text')
- `showClearButton?: boolean` - Show clear button (default: false)
- `helperText?: string` - Helper text below input
- All standard `TextInputProps`

**Example:**
```tsx
<CustomInput
  control={control}
  name="email"
  error={errors.email}
  placeholder="Email"
  type="email"
  showClearButton
/>
```

---

### `CustomSelect`
Dropdown-style selector with chevron indicator.

**Props:**
- `control: Control<T>` - React Hook Form control
- `name: Path<T>` - Field name
- `error?: FieldError` - Validation error
- `placeholder: string` - Placeholder text
- `onPress: () => void` - Handler when pressed (opens modal)

**Example:**
```tsx
<CustomSelect
  control={control}
  name="homeStudio"
  error={errors.homeStudio}
  placeholder="Choose Home Studio"
  onPress={() => setModalVisible(true)}
/>
```

---

### `CustomCheckbox`
Checkbox with label support.

**Props:**
- `control: Control<T>` - React Hook Form control
- `name: Path<T>` - Field name
- `error?: FieldError` - Validation error
- `label: string | ReactNode` - Label text or custom component

**Example:**
```tsx
<CustomCheckbox
  control={control}
  name="terms"
  error={errors.terms}
  label="I agree to Terms and Conditions"
/>
```

---

### `SlideUpModal`
Animated modal that slides from bottom with optional search.

**Props:**
- `visible: boolean` - Show/hide modal
- `onClose: () => void` - Close handler
- `title: string` - Modal title
- `data: T[]` - Array of items to display
- `renderItem: ListRenderItem<T>` - Render function for each item
- `searchable?: boolean` - Enable search input (default: false)
- `onSearch?: (text: string) => void` - Search handler
- `height?: string` - Modal height: '70%' or '80%' (default: '70%')

**Example:**
```tsx
<SlideUpModal
  visible={isModalVisible}
  onClose={() => setModalVisible(false)}
  title="Choose Home Studio"
  data={STUDIOS}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => selectItem(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )}
/>
```

---

### `PrimaryButton`
Primary action button with variant support.

**Props:**
- `title: string` - Button text
- `variant?: 'primary' | 'secondary'` - Style variant (default: 'primary')
- All standard `TouchableOpacityProps`

**Example:**
```tsx
<PrimaryButton 
  title="NEXT" 
  onPress={handleSubmit(onSubmit)} 
/>

<PrimaryButton 
  title="LOGIN" 
  variant="secondary"
  onPress={handleLogin} 
/>
```

---

## Usage Pattern

Typical authentication screen structure:

```tsx
import { AuthLayout, CustomInput, PrimaryButton } from '@/components/auth';

export default function SignUpScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <AuthLayout currentStep={1} totalSteps={5}>
      <View className="px-5">
        <Text className="text-white text-2xl font-bold mb-8 text-center">
          TITLE
        </Text>

        <View className="gap-3">
          <CustomInput
            control={control}
            name="email"
            error={errors.email}
            placeholder="Email"
            type="email"
          />
          
          <PrimaryButton 
            title="NEXT" 
            onPress={handleSubmit(onSubmit)} 
          />
        </View>
      </View>
    </AuthLayout>
  );
}
```

## Design Tokens

All components follow the UN1T design system:
- Background: `#191919`
- Input background: `#252525`
- Border color (active): `white`
- Border color (error): `red-500`
- Border color (inactive): `transparent` or `zinc-700`
- Text color: `white`
- Placeholder: `#52525b` (zinc-600)
- Input height: `52px`
- Font size: `16px`
