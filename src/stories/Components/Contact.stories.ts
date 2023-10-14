import type { Meta, StoryObj } from "@storybook/react";
import ContactBar from '../../components/ContactBar';

const meta = {
  title: "Components/Contact bar",
  component: ContactBar,
  parameters: {
    layout: 'centered',
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ContactBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
};