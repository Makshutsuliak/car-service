import data from "@/components/shared/data"

const { Category, servicesData, faqData } = data;
  
  const ServicesSection = () => {
    return (
      <section className="p-10 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Наші послуги</h2>
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => (
            <li
              key={service.id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
            >
              {service.icon}
              <h3 className="text-xl font-semibold mt-4">{service.title}</h3>
              <p className="text-gray-600 mt-2">{service.description}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  };
  
  export default ServicesSection;
  