"use client";

import { useEffect, useRef, useState } from "react";
import { Typography } from "@/components/ui/typography";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from "@/components/ui/navigation-menu";
import { NavigationLinks } from "@/lib/site-config";

export function NavigationBar({ className }: { className?: string }) {
  const [offset, setOffset] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const [currentItemName, setCurrentItemName] = useState<string>();
  const [activeTrigger, setActiveTrigger] = useState<HTMLButtonElement>();

  useEffect(() => {
    const list = listRef.current;
    if (activeTrigger && list) {
      const listWidth = list.offsetWidth;
      const listCenter = listWidth / 2;

      const activeTriggerOffsetRight =
        listWidth -
        activeTrigger.offsetLeft -
        activeTrigger.offsetWidth +
        activeTrigger.offsetWidth / 2;

      setOffset(listCenter - activeTriggerOffsetRight);
    }
  }, [activeTrigger]);

  return (
    <NavigationMenu
      value={currentItemName}
      onValueChange={setCurrentItemName}
      className={className}
    >
      <NavigationMenuList ref={listRef}>
        {NavigationLinks.map((link) =>
          link.content ? (
            <NavigationMenuItem key={link.href} value={link.name}>
              <NavigationMenuTrigger
                ref={(node: HTMLButtonElement) => {
                  if (currentItemName === link.name && activeTrigger !== node) {
                    setActiveTrigger(node);
                  }
                  return node;
                }}
                className="text-xl font-normal lg:text-lg lg:font-light"
              >
                {link.name}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col">
                {link.content.map((item) => (
                  <Typography
                    as={NavigationMenuLink}
                    href={item.href}
                    variant="link"
                    key={item.name + item.href}
                  >
                    {item.name}
                  </Typography>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={link.href}>
              <Typography
                as={NavigationMenuLink}
                href={link.href}
                variant="link"
              >
                {link.name}
              </Typography>
            </NavigationMenuItem>
          ),
        )}
        <NavigationMenuIndicator />
      </NavigationMenuList>
      <NavigationMenuViewport
        style={{
          transform: `translateX(${offset}px)`,
        }}
      />
    </NavigationMenu>
  );
}

function NavigationSidebarContent({
  link,
}: {
  link: {
    name: string;
    href: string;
    content: { name: string; href: string }[];
  };
}) {
  return (
    <>
      <NavigationMenuItem>
        <Typography as={NavigationMenuLink} href={link.href} variant="link">
          {link.name}
        </Typography>
      </NavigationMenuItem>

      {link.content.map((item) => (
        <NavigationMenuItem key={"Mobile content:" + link.name + item.href}>
          <Typography
            as={NavigationMenuLink}
            href={item.href}
            variant="link"
            className="ml-5"
          >
            {item.name}
          </Typography>
        </NavigationMenuItem>
      ))}
    </>
  );
}

export function NavigationSidebar({ className }: { className?: string }) {
  return (
    <NavigationMenu orientation="vertical" className={className}>
      <NavigationMenuList className="flex-col">
        {NavigationLinks.map((link) =>
          link.content ? (
            <NavigationSidebarContent
              key={"Mobile:" + link.name + link.href}
              link={link}
            />
          ) : (
            <NavigationMenuItem key={"Mobile:" + link.name + link.href}>
              <Typography
                as={NavigationMenuLink}
                href={link.href}
                variant="link"
              >
                {link.name}
              </Typography>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
