import Image from "next/image";
import Link from "next/link";

const LandingSectionOne = () => {
  return (
    <section className="pt-32 sm:py:12 md:py-20 lg:py-28 w-full h-screen flex items-center">
      <div className="container w-full">
        <div className="-mx-4 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-full px-4 lg:w-1/2">
            <div className="wow fadeInUp max-w-[470px] flex flex-col gap-8" data-wow-delay=".2s">
              <div>
                <h1 className="mb-4 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl">
                  Bug free code
                </h1>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl">
                  Premier support
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt.
                </p>
              </div>
              <div className="mb-1 flex flex-row gap-4 ">
                <Link
                    href="https://nextjstemplates.com/templates/startup"
                    className="rounded-md bg-lime-200 py-2 px-2 sm:py-4 sm:px-8 text-base font-semibold text-black duration-300 ease-in-out hover:bg-lime-600"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="https://github.com/NextJSTemplates/startup-nextjs"
                    className="rounded-md bg-black/20 py-2 px-2 sm:py-4 sm:px-8 text-base font-semibold text-black duration-300 ease-in-out hover:bg-black/30"
                  >
                    Contact Us
                  </Link>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="wow fadeInUp relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/about/about-image-2.svg"
                alt="about image"
                fill
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSectionOne;
