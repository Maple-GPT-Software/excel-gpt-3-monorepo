import type { MDXComponents } from 'mdx/types';
import { ReactNode } from 'react';

type Children = {
  children?: ReactNode;
};

const Heading1 = ({ children, ...props }: Children) => {
  return <h1 className="text-4xl font-bold mb-8">{children}</h1>;
};

const Heading2 = ({ children, ...props }: Children) => {
  return (
    <h2 className="text-3xl font-bold mb-6" {...props}>
      {children}
    </h2>
  );
};

const Heading3 = ({ children, ...props }: Children) => {
  return (
    <h3 className="text-2xl font-bold mb-4" {...props}>
      {children}
    </h3>
  );
};

const UnorderedList = ({ children, ...props }: Children) => {
  return (
    <ul className="list-disc list-inside pl-8 mb-4" {...props}>
      {children}
    </ul>
  );
};

const OrderedList = ({ children, ...props }: Children) => {
  return (
    <ol className="list-decimal list-inside pl-8 mb-4" {...props}>
      {children}
    </ol>
  );
};

const ListItem = ({ children, ...props }: Children) => {
  return (
    <li className="mb-2" {...props}>
      {children}
    </li>
  );
};

const Paragraph = ({ children, ...props }: Children) => {
  return (
    <p className="mb-4" {...props}>
      {children}
    </p>
  );
};

const Bold = ({ children, ...props }: Children) => {
  return (
    <b className="font-bold" {...props}>
      {children}
    </b>
  );
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    p: Paragraph,
    ul: UnorderedList,
    ol: OrderedList,
    li: ListItem,
    b: Bold,
    ...components,
  };
}
