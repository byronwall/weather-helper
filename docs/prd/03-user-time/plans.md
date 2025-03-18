# User Time Implementation Plan

## Overview

This plan outlines the implementation of user time preferences, allowing users to specify desired time ranges for weather analysis and visualization.

## Components to Update

### 1. User Preferences Store (`src/stores/userPrefsStore.ts`)

- Add new state for time preferences:

  ```typescript
  interface TimePreference {
    startHour: number; // 0-23
    endHour: number; // 0-23
    preset: "morning" | "afternoon" | "evening" | "custom";
  }
  ```

- Add actions:
  - `setTimePreference(preset: string)`
  - `setCustomTimeRange(startHour: number, endHour: number)`
  - `getTimeRange(): { start: number, end: number }`

### 2. User Preferences Component (`src/components/UserPreferences.tsx`)

- Add new section for time preferences:
  - Radio buttons for Morning/Afternoon/Evening
  - Custom time range inputs (optional)
  - Visual representation of selected time range

### 3. Weather Chart Component (`src/WeatherChart.tsx`)

- Add vertical dashed lines for time range boundaries
- Update chart to focus on time range + buffer
- Add buffer hours constant (e.g., 2 hours before/after)
- Update axis scaling to focus on relevant time period

### 4. Preference Helper (`src/utils/preferenceHelper.ts`)

- Update `analyzeCombinedPreferences` to only evaluate within time range
- Add time range validation to preference analysis
- Update time range formatting for display

### 5. Weather Card Component (`src/WeatherCard.tsx`)

- Update preference summary to show time range context
- Add time range indicator in weather summary section

## Implementation Steps

### Phase 1: Store Updates

- [ ] Update `userPrefsStore.ts` with new time preference interface
- [ ] Add time preference actions and selectors
- [ ] Add persistence for time preferences
- [ ] Add default values for time preferences

### Phase 2: UI Components

- [ ] Create TimePreferenceSelector component
  - [ ] Radio buttons for presets
  - [ ] Custom time inputs
  - [ ] Visual time range display
- [ ] Integrate TimePreferenceSelector into UserPreferences
- [ ] Add time range indicators to WeatherCard
- [ ] Update chart visualization with time range lines

### Phase 3: Chart Updates

- [ ] Add time range buffer constant
- [ ] Update chart scaling to focus on time range
- [ ] Add vertical lines for time boundaries
- [ ] Update chart data filtering to focus on time range

### Phase 4: Preference Analysis

- [ ] Update preference analysis to respect time range
- [ ] Add time range validation
- [ ] Update time range formatting
- [ ] Add time range context to violation messages

### Phase 5: Testing & Polish

- [ ] Add unit tests for time preference logic
- [ ] Test edge cases (crossing midnight, etc.)
- [ ] Add visual feedback for time range selection
- [ ] Polish UI/UX of time selection components

## Status

### Phase 1: Store Updates

- [ ] Basic time preference interface
- [ ] Store actions and selectors
- [ ] Persistence layer
- [ ] Default values

### Phase 2: UI Components

- [ ] TimePreferenceSelector component
- [ ] UserPreferences integration
- [ ] WeatherCard updates
- [ ] Chart visualization updates

### Phase 3: Chart Updates

- [ ] Time range buffer implementation
- [ ] Chart scaling updates
- [ ] Time boundary lines
- [ ] Data filtering

### Phase 4: Preference Analysis

- [ ] Time range validation
- [ ] Analysis updates
- [ ] Formatting updates
- [ ] Context messages

### Phase 5: Testing & Polish

- [ ] Unit tests
- [ ] Edge case testing
- [ ] Visual feedback
- [ ] UI/UX polish

## Current Progress

- No work completed yet

### Next Steps

- Begin with store updates to establish time preference foundation
- Create basic UI components for time selection
- Implement chart visualization updates
- Add preference analysis updates
- Complete testing and polish
