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
  return <h1 className="text-4xl font-bold mb-8">{children}</h1>;
};

const Heading2: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ children }) => {
  return <h2 className="text-3xl font-bold mb-6">{children}</h2>;
};

const Heading3: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ children }) => {
  return <h3 className="text-2xl font-bold mb-4">{children}</h3>;
};

const UnorderedList: FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>
> = ({ children }) => {
  return <ul className="list-disc list-inside pl-8 mb-4">{children}</ul>;
};

const OrderedList: FunctionComponent<
  DetailedHTMLProps<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>
> = ({ children }) => {
  return <ol className="list-decimal list-inside pl-8 mb-4">{children}</ol>;
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
