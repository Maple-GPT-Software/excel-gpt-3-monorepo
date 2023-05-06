import Link from 'next/link';
import React from 'react';
import { cn } from '@/utils/cn';
import { buttonVariants } from '@/components/ui/Button';

function ContactPage() {
  return (
    <div className="container pt-8">
      <h2 className="text-3xl font-thin uppercase">Get in touch</h2>
      <p className="mt-4">Have feedback? We&apos;d to hear from you</p>
      <p>Got a problem? We&apos;re here to help!</p>
      <Link
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'mt-8 border border-solid border-slate-500 hover:bg-transparent'
        )}
        href="https://docs.google.com/forms/d/e/1FAIpQLSeGxCyV220Yva10RUblYljHwMdBW9_VqwibCwGuNE5WzAqHQw/viewform?usp=sf_link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contact Form
      </Link>
    </div>
  );
}

export default ContactPage;
