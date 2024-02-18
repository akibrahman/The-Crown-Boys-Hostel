export const metadata = {
  title: "404 Not Found",
  description: "This is page doesn't exits",
};

const notFound = () => {
  return (
    <div>
      <p className="text-orange-600">Not Found</p>
    </div>
  );
};

export default notFound;
