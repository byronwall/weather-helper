# User Preferences Requirements

- Need a system so that the user can enter their specific preferences for "good" weather.
- For each metric, allow a min and max value, both are optional
- If the value is given, the chart should render lines for the min and max values
- If the current chart value is between the min and max, the chart should render a triple thick line
- If the value is outside the min or max, the chart should render a single thick line and should also create gutter regions to show the move outside of preferences.
- There should be a simple component to update the preferences. Assume that an empty text box is an indication of no preference. Update everything immediately.
- Store user preferences in a new global zustand store.

## Plan
