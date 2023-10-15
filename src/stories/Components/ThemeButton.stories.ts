import type { Meta, StoryObj } from "@storybook/react";

import { ThemeButton } from "~/components/ThemeButton";

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

export const Mobile: Story = {
  args: {
    type: 'mobile',
  }
};

export const Desktop: Story = {
  args: {
    type: 'desktop',
  }
};

export const Footer: Story = {
  args: {
    type: 'footer',
  }
};