"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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
import { subscribe } from "diagnostics_channel";

export function Navigation() {
  const [offset, setOffset] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const [currentItemName, setCurrentItemName] = useState<string>();
  const [activeTrigger, setActiveTrigger] = useState<HTMLButtonElement>();

  useEffect(() => {
    const list = listRef.current;
    if (activeTrigger && list) {
      const listWidth = list.offsetWidth;
      const listCenter = listWidth / 2;

      const activeTriggerOffsetRight = listWidth - activeTrigger.offsetLeft - activeTrigger.offsetWidth + activeTrigger.offsetWidth / 2;

      setOffset(listCenter - activeTriggerOffsetRight);
    }
  }, [activeTrigger]);

  return (
    <NavigationMenu value={currentItemName} onValueChange={setCurrentItemName}>
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
              >
                {link.name}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col">
                {link.content.map((item) => (
                  <Typography
                    as={NavigationMenuLink}
                    href={item.href}
                    variant="link"
                    className="text-muted-foreground hover:text-foreground"
                    key={item.href}
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
                className="text-muted-foreground hover:text-foreground"
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
