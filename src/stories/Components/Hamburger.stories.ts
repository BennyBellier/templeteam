import type { Meta, StoryObj } from "@storybook/react";
import { HamburgerMenu } from '~/components/navigation';

const meta = {
  title: "Components/HamburgerMenu",
  component: HamburgerMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ["autodocs"],
} as Meta<typeof HamburgerMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Close: Story = {
  args: {
    isOpen: false,
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
  },
};