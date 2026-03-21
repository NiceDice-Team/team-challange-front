"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const CustomBreadcrumb = ({ className='', items = [], ...props }) => {
  const {
    listClassName = "",
    linkClassName = "",
    pageClassName = "",
    separatorClassName = "",
    ...restProps
  } = props;

  return (
    <Breadcrumb className={cn("", className)} {...restProps}>
      <BreadcrumbList className={cn("flex items-center gap-1", listClassName)}>
        {items.map((item, index) => (
          <React.Fragment key={item.href || item.label}>
            <BreadcrumbItem>
              {item.href && !item.current ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-[var(--color-gray-2)] hover:text-[var(--color-purple)] text-sm transition-colors",
                      linkClassName
                    )}
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className={cn("text-[var(--color-purple)] text-sm", pageClassName)}>
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {index < items.length - 1 && (
              <BreadcrumbSeparator className={cn("mx-0.5", separatorClassName)}>
                <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M4.5 3L7.5 6L4.5 9"
                    stroke="var(--color-gray-2)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
