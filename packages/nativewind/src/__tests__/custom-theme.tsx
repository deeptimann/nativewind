import { View } from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { resetStyles } from "react-native-css-interop/testing-library";
import { act, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native-css-interop";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("Using css variables", async () => {
  // https://tailwindcss.com/docs/customizing-colors#using-css-variables
  await renderTailwind(<A testID={testID} className="text-primary" />, {
    css: `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer base {
        :root {
          --color-primary: 255 115 179;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --color-primary: 155 100 255;
          }
        }
      }
    `,
    config: {
      theme: {
        colors: {
          primary: "rgb(var(--color-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        },
      },
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(255,115,179,1)" });

  act(() => StyleSheet.setColorScheme("dark"));

  expect(component).toHaveStyle({ color: "rgba(155,100,255,1)" });
});