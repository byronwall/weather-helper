import { WeatherPreference } from "./userPrefsStore";

type ExamplePreference = {
  activity: string;
  weatherPreference: WeatherPreference;
};

export const examplePrefs: ExamplePreference[] = [
  {
    activity: "Hiking",
    weatherPreference: {
      temperature: {
        min: 45,
        max: 80,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Kite Flying",
    weatherPreference: {
      windSpeed: {
        min: 5,
        max: 20,
      },
      precipitation: {
        max: 20,
      },
    },
  },
  {
    activity: "Golfing",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      humidity: {
        max: 85,
      },
      windSpeed: {
        max: 20,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Jogging",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 75,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Tennis",
    weatherPreference: {
      temperature: {
        min: 55,
        max: 85,
      },
      humidity: {
        max: 75,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 20,
      },
    },
  },
  {
    activity: "Soccer",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      humidity: {
        max: 85,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Swimming (outdoor)",
    weatherPreference: {
      temperature: {
        min: 70,
        max: 100,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Sunbathing",
    weatherPreference: {
      temperature: {
        min: 75,
        max: 95,
      },
      humidity: {
        max: 60,
      },
      precipitation: {
        max: 10,
      },
    },
  },
  {
    activity: "Picnic",
    weatherPreference: {
      temperature: {
        min: 60,
        max: 80,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 10,
      },
      precipitation: {
        max: 20,
      },
    },
  },
  {
    activity: "Fishing",
    weatherPreference: {
      temperature: {
        min: 45,
        max: 85,
      },
      precipitation: {
        max: 50,
      },
    },
  },
  {
    activity: "Camping",
    weatherPreference: {
      temperature: {
        min: 40,
        max: 80,
      },
      humidity: {
        max: 90,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Mountain Biking",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      humidity: {
        max: 75,
      },
      windSpeed: {
        max: 20,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Rock Climbing",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 80,
      },
      humidity: {
        max: 70,
      },
      windSpeed: {
        max: 20,
      },
      precipitation: {
        max: 20,
      },
    },
  },
  {
    activity: "Surfing",
    weatherPreference: {
      temperature: {
        min: 70,
        max: 95,
      },
      precipitation: {
        max: 50,
      },
    },
  },
  {
    activity: "Sailing",
    weatherPreference: {
      temperature: {
        min: 60,
        max: 85,
      },
      windSpeed: {
        min: 5,
        max: 25,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Kayaking",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 90,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Canoeing",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Stand-up Paddleboarding",
    weatherPreference: {
      temperature: {
        min: 65,
        max: 90,
      },
      windSpeed: {
        max: 10,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Beach Volleyball",
    weatherPreference: {
      temperature: {
        min: 70,
        max: 90,
      },
      humidity: {
        max: 70,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 20,
      },
    },
  },
  {
    activity: "Outdoor Yoga",
    weatherPreference: {
      temperature: {
        min: 60,
        max: 85,
      },
      humidity: {
        max: 75,
      },
      windSpeed: {
        max: 10,
      },
      precipitation: {
        max: 20,
      },
    },
  },
  {
    activity: "Archery",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 80,
      },
      humidity: {
        max: 70,
      },
      windSpeed: {
        max: 10,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Horse Riding",
    weatherPreference: {
      temperature: {
        min: 40,
        max: 85,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 20,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Bird Watching",
    weatherPreference: {
      temperature: {
        min: 40,
        max: 80,
      },
      precipitation: {
        max: 50,
      },
    },
  },
  {
    activity: "Photography (Nature)",
    weatherPreference: {
      temperature: {
        min: 40,
        max: 80,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Outdoor Painting",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      windSpeed: {
        max: 10,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Running a Marathon",
    weatherPreference: {
      temperature: {
        min: 45,
        max: 65,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Triathlon",
    weatherPreference: {
      temperature: {
        min: 60,
        max: 75,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Skateboarding",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Rollerblading",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Frisbee",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Basketball (Outdoor)",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Flag Football",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      humidity: {
        max: 85,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Softball/Baseball",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      humidity: {
        max: 85,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Hockey (Field/Street)",
    weatherPreference: {
      temperature: {
        min: 40,
        max: 70,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Outdoor Concert",
    weatherPreference: {
      temperature: {
        min: 60,
        max: 90,
      },
      humidity: {
        max: 85,
      },
      windSpeed: {
        max: 20,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Stargazing",
    weatherPreference: {
      temperature: {
        min: 40,
        max: 70,
      },
      windSpeed: {
        max: 10,
      },
      precipitation: {
        max: 20,
      },
    },
  },
  {
    activity: "Outdoor Movie Night",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 80,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 10,
      },
      precipitation: {
        max: 20,
      },
    },
  },
  {
    activity: "Gardening",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 85,
      },
      precipitation: {
        max: 50,
      },
    },
  },
  {
    activity: "Paintball",
    weatherPreference: {
      temperature: {
        min: 50,
        max: 80,
      },
      humidity: {
        max: 80,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Scuba Diving (Beach Entry)",
    weatherPreference: {
      temperature: {
        min: 70,
        max: 90,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Snorkeling",
    weatherPreference: {
      temperature: {
        min: 70,
        max: 90,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 40,
      },
    },
  },
  {
    activity: "Outdoor Meditation",
    weatherPreference: {
      temperature: {
        min: 55,
        max: 80,
      },
      windSpeed: {
        max: 10,
      },
      precipitation: {
        max: 20,
      },
    },
  },
  {
    activity: "Water Balloon Fight",
    weatherPreference: {
      temperature: {
        min: 70,
        max: 90,
      },
      windSpeed: {
        max: 10,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Outdoor BBQ",
    weatherPreference: {
      temperature: {
        min: 60,
        max: 90,
      },
      windSpeed: {
        max: 15,
      },
      precipitation: {
        max: 30,
      },
    },
  },
  {
    activity: "Outdoor Wedding",
    weatherPreference: {
      temperature: {
        min: 60,
        max: 80,
      },
      humidity: {
        max: 70,
      },
      windSpeed: {
        max: 10,
      },
      precipitation: {
        max: 20,
      },
    },
  },
  {
    activity: "Sledding",
    weatherPreference: {
      temperature: {
        max: 32,
      },
      windSpeed: {
        max: 15,
      },
    },
  },
  {
    activity: "Snowboarding",
    weatherPreference: {
      temperature: {
        min: 20,
        max: 32,
      },
      windSpeed: {
        max: 25,
      },
    },
  },
  {
    activity: "Skiing",
    weatherPreference: {
      temperature: {
        min: 20,
        max: 32,
      },
      windSpeed: {
        max: 25,
      },
    },
  },
  {
    activity: "Snowshoeing",
    weatherPreference: {
      temperature: {
        min: 20,
        max: 32,
      },
      windSpeed: {
        max: 20,
      },
    },
  },
  {
    activity: "Ice Skating (Outdoor)",
    weatherPreference: {
      temperature: {
        max: 32,
      },
      windSpeed: {
        max: 10,
      },
    },
  },
];
