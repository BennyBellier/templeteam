"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Typography } from "@/components/ui/typography";
import { NavigationLinks } from "@/lib/site-config";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function NavigationBar({ className }: { className?: string }) {
  const [offset, setOffset] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const [currentItemName, setCurrentItemName] = useState<string>();
  const [activeTrigger, setActiveTrigger] = useState<HTMLButtonElement | null>();

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
            <NavigationMenuItem key={link.id} value={link.name}>
              <NavigationMenuTrigger
                ref={(node: HTMLButtonElement | null) => {
                  if (currentItemName === link.name && activeTrigger !== node) {
                    setActiveTrigger(node);
                  }
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
                    key={uuidv4()}
                  >
                    {item.name}
                  </Typography>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={uuidv4()}>
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