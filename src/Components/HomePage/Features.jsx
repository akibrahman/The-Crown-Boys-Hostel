import SectionTitle from "./coms/SectionTitle";
import SingleFeature from "./coms/SingleFeature";
import featuresData from "./data/featuresData";

const Features = () => {
  return (
    <>
      <section id="features" className="py-6 md:py-8 lg:py-10 bg-dark-black">
        <div className="container p-4 items-center mx-auto">
          <SectionTitle
            title="Main Features"
            paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
            center={true}
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
