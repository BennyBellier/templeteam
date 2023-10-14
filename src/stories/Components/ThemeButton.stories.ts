import type { Meta, StoryObj } from "@storybook/react";

import { ThemeButton } from "~/components/elements";

const meta = {
  title: "Components/Theme Button",
  component: ThemeButton,
  parameters: {
    layout: 'centered',
  },
  tags: ["autodocs"],
} as Meta<typeof ThemeButton>;

export default meta;
type Story = StoryObj<typeof ThemeButton>;

export const Default: Story = {
};