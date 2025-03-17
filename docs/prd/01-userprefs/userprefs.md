# User Preferences Requirements

- Need a system so that the user can enter their specific preferences for "good" weather.
- For each metric, allow a min and max value, both are optional
- If the value is given, the chart should render lines for the min and max values
- If the current chart value is between the min and max, the chart should render a triple thick line
- If the value is outside the min or max, the chart should render a single thick line and should also create gutter regions to show the move outside of preferences.
- There should be a simple component to update the preferences. Assume that an empty text box is an indication of no preference. Update everything immediately.
- Store user preferences in a new global zustand store.

## Plan

### Phase 1: User Preferences Store Setup

- [ ] Create `stores/userPrefsStore.ts`
  - [ ] Define preference interface for weather metrics
  - [ ] Implement zustand store with min/max values for each metric
  - [ ] Add persistence layer using zustand/middleware
  - [ ] Add type-safe getters and setters

### Phase 2: User Preferences Input Component

- [ ] Create `components/UserPreferences.tsx`
  - [ ] Build form layout with min/max inputs for each metric
  - [ ] Implement real-time validation and updates
  - [ ] Add clear functionality for removing preferences
  - [ ] Style component to match existing UI

### Phase 3: Chart Enhancements

- [ ] Update chart rendering logic
  - [ ] Add min/max reference lines
  - [ ] Implement triple-thick line rendering for in-range values
  - [ ] Add gutter regions for out-of-range values
  - [ ] Update chart styling and colors

### Phase 4: Integration and Testing

- [ ] Connect preferences to chart components
  - [ ] Subscribe to preference updates
  - [ ] Implement dynamic chart updates
  - [ ] Test all combinations of min/max settings
  - [ ] Verify persistence across page reloads

## Current Progress

- Requirements documented
- Implementation plan created

## Next Steps

1. Set up user preferences store
2. Create basic input component structure
3. Implement chart rendering modifications
4. Test and refine the integration

## Technical Details

### Interfaces

```typescript
interface WeatherPreference {
  temperature?: {
    min?: number;
    max?: number;
  };
  humidity?: {
    min?: number;
    max?: number;
  };
  // Add other weather metrics as needed
}

interface UserPrefsStore {
  preferences: WeatherPreference;
  setPreference: (
    metric: keyof WeatherPreference,
    min?: number,
    max?: number
  ) => void;
  clearPreference: (metric: keyof WeatherPreference) => void;
}
```

### Component Structure

```typescript
// UserPreferences.tsx
interface PreferenceInputProps {
  metric: keyof WeatherPreference;
  label: string;
  unit: string;
}

// ChartEnhancements
interface PreferenceLineProps {
  value: number;
  type: "min" | "max";
  metric: keyof WeatherPreference;
}
```
