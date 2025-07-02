"use client";

import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const CustomAccordion = ({ className, ...props }) => {
  return <Accordion className={cn("w-full  ", className)} {...props} />;
};

export const CustomAccordionItem = ({ className, ...props }) => {
  return (
    <AccordionItem
      className={cn("border-b border-[var(--color-light-purple-2)] last:border-b-0", className)}
      {...props}
    />
  );
};

export const CustomAccordionTrigger = ({ className, ...props }) => {
  return (
    <AccordionTrigger
      className={cn("text-[var(--color-purple)] text-base uppercase font-semibold", className)}
      {...props}
    />
  );
};

export const CustomAccordionContent = ({ className, ...props }) => {
  return <AccordionContent className={cn("", className)} {...props} />;
};
