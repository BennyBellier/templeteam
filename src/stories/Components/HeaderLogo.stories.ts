import type { Meta, StoryObj } from "@storybook/react";

import { HeaderLogo } from "~/components/navigation";

const meta = {
  title: "Components/Header logo",
  component: HeaderLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeaderLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
