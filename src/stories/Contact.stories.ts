import type { Meta, StoryObj } from "@storybook/react";
import ContactBar from '../components/ContactBar';
import '../styles/globals.css'

const meta = {
  title: "Components/ContactBar",
  component: ContactBar,
  tags: ["autodocs"],
} satisfies Meta<typeof ContactBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
};