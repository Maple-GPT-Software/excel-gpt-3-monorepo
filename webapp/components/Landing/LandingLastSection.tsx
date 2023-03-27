import Link from 'next/link';

const LandingLastSection = () => {
  return (
    <>
      <section
        id="home"
        className="relative z-10 flex h-screen w-full items-center overflow-hidden "
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div
                className="wow fadeInUp mx-auto max-w-[800px] text-center"
                data-wow-delay=".2s"
              >
                <h1 className="mb-5 text-3xl  leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  Try the #1 Excel AI solution ExcelSimplify now!
                </h1>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link
                    href="https://nextjstemplates.com/templates/startup"
                    className="bg-primary hover:bg-darkGreen rounded-md py-2 px-2 text-base font-semibold text-black duration-300 ease-in-out sm:py-4 sm:px-8"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="https://github.com/NextJSTemplates/startup-nextjs"
                    className="rounded-md bg-black/20 py-4 px-8 text-base font-semibold text-black duration-300 ease-in-out hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingLastSection;
