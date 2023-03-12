import SectionTitle from '@/components/Common/SectionTitle';
import ReviewCard from '@/components/ReviewCard/ReviewCard';

const testimonialData = [
  {
    id: 1,
    name: 'Musharof Chy',
    designation: 'Founder @TailGrids',
    content:
      "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
    image: '/images/testimonials/auth-01.png',
    star: 5,
  },
  {
    id: 2,
    name: 'Devid Weilium',
    designation: 'Founder @UIdeck',
    content:
      "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
    image: '/images/testimonials/auth-02.png',
    star: 5,
  },
  {
    id: 3,
    name: 'Lethium Frenci',
    designation: 'Founder @Lineicons',
    content:
      "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
    image: '/images/testimonials/auth-03.png',
    star: 5,
  },
];

const LandingReviewSection = () => {
  return (
    <section className="relative z-10 bg-green-600/[.03] py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="What Our Users Says"
          paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {testimonialData.map((testimonial) => (
            <ReviewCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
      <div className="absolute top-5 right-0 z-[-1]"></div>
      <div className="absolute left-0 bottom-5 z-[-1]"></div>
    </section>
  );
};

export default LandingReviewSection;
