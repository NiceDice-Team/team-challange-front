import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomAccordion, CustomAccordionItem, CustomAccordionTrigger, CustomAccordionContent } from '../../components/shared/CustomAccordion';

// Mock the UI accordion components
jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children, ...props }) => <div data-testid="accordion" {...props}>{children}</div>,
  AccordionItem: ({ children, ...props }) => <div data-testid="accordion-item" {...props}>{children}</div>,
  AccordionTrigger: ({ children, ...props }) => <button data-testid="accordion-trigger" {...props}>{children}</button>,
  AccordionContent: ({ children, ...props }) => <div data-testid="accordion-content" {...props}>{children}</div>,
}));

describe('CustomAccordion', () => {
  test('renders CustomAccordion wrapper', () => {
    render(
      <CustomAccordion type="single" collapsible>
        <CustomAccordionItem value="item-1">
          <CustomAccordionTrigger>First Item</CustomAccordionTrigger>
          <CustomAccordionContent>
            This is the first accordion item content.
          </CustomAccordionContent>
        </CustomAccordionItem>
      </CustomAccordion>
    );
    
    // Check that accordion structure is rendered
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('This is the first accordion item content.')).toBeInTheDocument();
  });

  test('renders multiple accordion items', () => {
    render(
      <CustomAccordion type="single" collapsible>
        <CustomAccordionItem value="item-1">
          <CustomAccordionTrigger>First Item</CustomAccordionTrigger>
          <CustomAccordionContent>First content</CustomAccordionContent>
        </CustomAccordionItem>
        <CustomAccordionItem value="item-2">
          <CustomAccordionTrigger>Second Item</CustomAccordionTrigger>
          <CustomAccordionContent>Second content</CustomAccordionContent>
        </CustomAccordionItem>
      </CustomAccordion>
    );
    
    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
    expect(screen.getByText('First content')).toBeInTheDocument();
    expect(screen.getByText('Second content')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(
      <CustomAccordion className="custom-accordion" type="single" collapsible>
        <CustomAccordionItem value="item-1">
          <CustomAccordionTrigger>Test Item</CustomAccordionTrigger>
          <CustomAccordionContent>Test content</CustomAccordionContent>
        </CustomAccordionItem>
      </CustomAccordion>
    );
    
    // Check if custom class is applied to the accordion
    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveClass('custom-accordion');
  });

  test('renders accordion item with custom styling', () => {
    render(
      <CustomAccordionItem className="custom-item" value="test">
        <CustomAccordionTrigger>Test</CustomAccordionTrigger>
        <CustomAccordionContent>Content</CustomAccordionContent>
      </CustomAccordionItem>
    );
    
    const item = screen.getByTestId('accordion-item');
    expect(item).toHaveClass('custom-item');
  });

  test('renders accordion trigger with custom styling', () => {
    render(
      <CustomAccordionTrigger className="custom-trigger">
        Test Trigger
      </CustomAccordionTrigger>
    );
    
    const trigger = screen.getByTestId('accordion-trigger');
    expect(trigger).toHaveClass('custom-trigger');
    expect(trigger).toHaveTextContent('Test Trigger');
  });

  test('renders accordion content with custom styling', () => {
    render(
      <CustomAccordionContent className="custom-content">
        Test Content
      </CustomAccordionContent>
    );
    
    const content = screen.getByTestId('accordion-content');
    expect(content).toHaveClass('custom-content');
    expect(content).toHaveTextContent('Test Content');
  });

  test('handles interaction with accordion trigger', () => {
    const mockClick = jest.fn();
    
    render(
      <CustomAccordionTrigger onClick={mockClick}>
        Clickable Trigger
      </CustomAccordionTrigger>
    );
    
    const trigger = screen.getByTestId('accordion-trigger');
    fireEvent.click(trigger);
    
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  test('renders with empty content', () => {
    render(
      <CustomAccordion type="single" collapsible>
        {/* Empty accordion */}
      </CustomAccordion>
    );
    
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
  });
});