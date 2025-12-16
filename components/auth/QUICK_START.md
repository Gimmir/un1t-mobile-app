# Quick Reference - Auth Components Usage

## Швидкий Старт

### Базова Auth Сторінка

```tsx
import { AuthLayout, CustomInput, PrimaryButton } from '@/components/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Screen() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <AuthLayout currentStep={1} totalSteps={3}>
      <View className="px-5 gap-3">
        <CustomInput
          control={control}
          name="email"
          error={errors.email}
          placeholder="Email"
          type="email"
        />
        
        <CustomInput
          control={control}
          name="password"
          error={errors.password}
          placeholder="Password"
          type="password"
        />
        
        <PrimaryButton 
          title="NEXT" 
          onPress={handleSubmit(onSubmit)} 
        />
      </View>
    </AuthLayout>
  );
}
```

## Типи Inputs

### Email
```tsx
<CustomInput
  control={control}
  name="email"
  type="email"
  showClearButton
/>
```

### Password
```tsx
<CustomInput
  control={control}
  name="password"
  type="password"
  helperText="Min 8 characters"
/>
```

### Phone
```tsx
<CustomInput
  control={control}
  name="phone"
  type="phone"
/>
```

### Text з autocomplete
```tsx
<CustomInput
  control={control}
  name="firstName"
  autoCapitalize="words"
  textContentType="givenName"
  autoComplete="name-given"
/>
```

## Dropdown Select

```tsx
const [showModal, setShowModal] = useState(false);

<CustomSelect
  control={control}
  name="studio"
  placeholder="Choose Studio"
  onPress={() => setShowModal(true)}
/>

<SlideUpModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  title="Choose Studio"
  data={STUDIOS}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => {
      setValue('studio', item.name);
      setShowModal(false);
    }}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )}
/>
```

## Checkbox

### Simple
```tsx
<CustomCheckbox
  control={control}
  name="terms"
  label="I agree to Terms"
/>
```

### Custom Label
```tsx
<CustomCheckbox
  control={control}
  name="terms"
  label={
    <Text className="text-white">
      I agree to <Text className="underline">Terms</Text>
    </Text>
  }
/>
```

## Buttons

### Primary
```tsx
<PrimaryButton 
  title="NEXT" 
  onPress={handleNext} 
/>
```

### Secondary
```tsx
<PrimaryButton 
  title="CANCEL" 
  variant="secondary"
  onPress={handleCancel} 
/>
```

## Modal з Search

```tsx
const [search, setSearch] = useState('');
const filteredData = data.filter(item => 
  item.name.toLowerCase().includes(search.toLowerCase())
);

<SlideUpModal
  visible={visible}
  onClose={onClose}
  title="Search Items"
  data={filteredData}
  searchable
  onSearch={setSearch}
  height="80%"
  renderItem={renderItem}
/>
```

## Common Patterns

### Full Name (2 fields)
```tsx
<CustomInput
  control={control}
  name="firstName"
  placeholder="First Name"
  autoCapitalize="words"
  textContentType="givenName"
  autoComplete="name-given"
/>

<CustomInput
  control={control}
  name="lastName"
  placeholder="Last Name"
  autoCapitalize="words"
  textContentType="familyName"
  autoComplete="name-family"
/>
```

### Address Fields
```tsx
<CustomInput
  control={control}
  name="address"
  placeholder="Address"
  textContentType="streetAddressLine1"
  autoComplete="street-address"
/>

<CustomInput
  control={control}
  name="city"
  placeholder="City"
  textContentType="addressCity"
/>

<CustomInput
  control={control}
  name="postcode"
  placeholder="Postcode"
  autoCapitalize="characters"
  textContentType="postalCode"
  autoComplete="postal-code"
/>
```

## Validation Schemas

### Basic
```tsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Advanced
```tsx
const schema = z.object({
  firstName: z.string()
    .min(2, "Too short")
    .regex(/^[a-zA-Z\s]+$/, "Letters only"),
  
  email: z.string()
    .min(1, "Required")
    .email("Invalid email"),
  
  password: z.string()
    .min(8, "Min 8 chars")
    .regex(/[A-Z]/, "Need uppercase")
    .regex(/[a-z]/, "Need lowercase")
    .regex(/[0-9]/, "Need number"),
  
  terms: z.literal(true, {
    errorMap: () => ({ message: "Must accept" })
  }),
  
  optional: z.boolean().optional(),
});
```

## Import Paths

```tsx
// Components
import { 
  AuthLayout,
  AuthHeader,
  CustomInput,
  CustomSelect,
  CustomCheckbox,
  PrimaryButton,
  SlideUpModal,
} from '@/components/auth';

// Constants
import { LANGUAGES, STUDIOS } from '@/src/constants/auth-data';

// Icons
import { IconSymbol } from '@/components/ui/icon-symbol';
```

## Styling Tips

### Container Padding
```tsx
<View className="px-5">  {/* Standard horizontal padding */}
```

### Gap между полями
```tsx
<View className="gap-3">  {/* Standard gap */}
```

### Button Spacing
```tsx
<View className="mt-10 mb-10">
  <PrimaryButton />
</View>
```

### Title
```tsx
<Text className="text-white text-2xl font-bold mt-2 mb-8 text-center tracking-wider uppercase">
  SCREEN TITLE
</Text>
```

## Troubleshooting

### Input не реагує
✅ Перевір що передав `control` від `useForm`
✅ Перевір що `name` співпадає з schema

### Border не з'являється
✅ Передай `error` prop з `formState.errors`

### Modal не закривається
✅ Перевір що викликається `onClose`
✅ Перевір стан `visible`

### Validation не працює
✅ Додай `mode: 'onChange'` в `useForm`
✅ Перевір Zod schema

## Performance Tips

1. **Мemoize render functions**
```tsx
const renderItem = useCallback(({ item }) => (
  <ItemComponent item={item} />
), []);
```

2. **Extract heavy components**
```tsx
const HeavyForm = memo(() => {
  // Form fields
});
```

3. **Use keyExtractor**
```tsx
<SlideUpModal
  keyExtractor={(item) => item.id}
  // ...
/>
```
