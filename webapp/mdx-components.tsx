import type { FunctionComponent, MDXComponents } from 'mdx/types';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
} from 'react';

// more information on setup
// https://beta.nextjs.org/docs/guides/mdx

const Heading1: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ children }) => {
  return <h1 className="mb-8 text-4xl font-bold">{children}</h1>;
};

const Heading2: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ children }) => {
  return <h2 className="mb-6 text-3xl font-bold">{children}</h2>;
};

const Heading3: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ children }) => {
  return <h3 className="mb-4 text-2xl font-bold">{children}</h3>;
};

const UnorderedList: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>
> = ({ children }) => {
  return <ul className="mb-4 list-inside list-disc pl-8">{children}</ul>;
};

const OrderedList: FunctionComponent<
  DetailedHTMLProps<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>
> = ({ children }) => {
  return <ol className="mb-4 list-inside list-decimal pl-8">{children}</ol>;
};

const ListItem: FunctionComponent<
  DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
> = ({ children }) => {
  return <li className="mb-2">{children}</li>;
};

const Paragraph: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = ({ children }) => {
  return <p className="mb-4">{children}</p>;
};

const Bold: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
> = ({ children }) => {
  return <b className="font-bold">{children}</b>;
};

const Link: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
  // @ts-expect-error href is valid
> = ({ children, href }) => {
  return (
    <a className="cursor-pointer text-green-600 underline" href={href}>
      {children}
    </a>
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
    a: Link,
    ...components,
  };
}
