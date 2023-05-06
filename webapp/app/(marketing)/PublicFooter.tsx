import Link from 'next/link';
import {
  CONTACT_US_ROUTE,
  PRIVATE_POLICIES,
  TERMS_AND_CONDITIONS,
} from '@/constants';

const PublicFooter = () => {
  return (
    <>
      <footer className="relative bg-neutral-700 py-4 text-white md:py-8">
        <div className="container grid grid-cols-1 md:grid-cols-2">
          <p className="text-body-color text-center text-base dark:text-white">
            Excel Simplify <span>&#169;</span> 2023
          </p>
          <div className="mt-4 flex justify-center gap-4 md:mt-0">
            <Link href={CONTACT_US_ROUTE}>Contact Us</Link>
            <Link href={PRIVATE_POLICIES}>Private Policy</Link>
            <Link href={TERMS_AND_CONDITIONS}>Terms and Conditions</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default PublicFooter;
