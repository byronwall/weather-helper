# Weather Helper

## Remaining tasks

- Create a set of docs in the tool
- Remove the circles
- Allow a chart to collapse to a boolean display with the exceptions being emphasized
- Show the available dates picker in a popup - default to the selected day only
- Get some visual distinction on the header - separate from body content
- Put the weather preferences into a popover
- Get rid of all the console calls.

## Overview

UX table stakes:

- Need the day picker (day of week) -- will require logic to determine closest dates and get weather data
- Need to pick a time of day (morning, afternoon, evening)
- Need to enter location

Capture user preferences:

- Ideal temperature
- Ideal humidity
- Tolerance for rain

Play with various ways of showing user preferences:

- Good/bad for each measure (show a shaded region along with the metric)
- Show shading during the time of interest - likely want to show wider view if doing charts (temp doesn't change quickly)

General UI that needs built:

- Charting interface
- Weather data <> icons

Sample URL: <https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/70601?unitGroup=us&key={key}&contentType=json>

Query builder: <https://www.visualcrossing.com/weather-query-builder/#>

## Steps and approach

- Get API access - download test data for diverse set of locations
  - Indy = home
  - Alaska = cold
  - Hawaii = hot
  - Mt Washington = wind
  - Louisiana = humid
- Drop the image into ChatGPT to get starting point for UI

## UI Progression

Initial prototype

![](docs/initial_ui_wide.png)

![](docs/initial_ui_mobile.png)

## Problems spotted during testing

- Get 1 more hour of data rendered if keeping the whole day plots
- Probably want to interpolate data to 10 minute increments to get a smoother looking chart
- Date list needs to overflow
- Drop a vertical cursor on a weather chart to get detailed data for that time - sync across all charts in a panel
- Ensure that the preference limits are considered in the axis limit logic

## Prototype settings to wire up

- Theme colors - find every color and put it into a color picker
- The opacity of the shaded region
- Chart sizes
- Chart margins and sizes

## Features

- Synchronized axis limits per metric across all charts
- Preferences and other user specific data stored to local storage

## Comments while building

- Converting the data structure to a flat list of time + metric values was a good move. Made it way easier to filter and process.
