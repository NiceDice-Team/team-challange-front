"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const CustomAccordion = ({ className, ...props }: ComponentProps<typeof Accordion>) => {
  return <Accordion className={cn("w-full  ", className)} {...props} />;
};

export const CustomAccordionItem = ({ className, ...props }: ComponentProps<typeof AccordionItem>) => {
  return (
    <AccordionItem
      className={cn("border-b border-[var(--color-light-purple-2)] last:border-b-0", className)}
      {...props}
    />
  );
};

export const CustomAccordionTrigger = ({ className, ...props }: ComponentProps<typeof AccordionTrigger>) => {
  return (
    <AccordionTrigger
      className={cn("text-[var(--color-purple)] text-base uppercase font-semibold", className)}
      {...props}
    />
  );
};

export const CustomAccordionContent = ({ className, rootClassName, ...props }: ComponentProps<typeof AccordionContent>) => {
  return <AccordionContent className={cn("", className)} rootClassName={rootClassName} {...props} />;
};
