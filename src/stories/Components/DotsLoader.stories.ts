import type { Meta, StoryObj } from "@storybook/react";

import { DotsLoader } from "~/components/Loader";

const meta = {
  title: "Components/Dots loader",
  component: DotsLoader,
  parameters: {
    layout: 'centered',
  },
  tags: ["autodocs"],
  argTypes : {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof DotsLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
};

