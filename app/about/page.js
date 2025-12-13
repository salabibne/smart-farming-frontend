
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-base-100 min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[50vh] bg-[#E5F9DB]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-green-900">Cultivating the Future</h1>
            <p className="py-6 text-green-800">
              Sustainable farming for a healthier planet. We are dedicated to bringing fresh, organic produce to your table while preserving the earth for future generations.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-green-900">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                At Smart Farming, our mission is simple: to revolutionize agriculture through technology and sustainable practices. We believe that farming should not only feed the world but also heal it.
              </p>
              <p className="text-lg text-gray-700">
                By integrating smart sensors, data analytics, and traditional organic methods, we ensure that every crop is grown with care and precision, minimizing waste and maximizing quality.
              </p>
            </div>
            <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-xl">
               <div className="w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-xl">
                  Mission Image Placeholder
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our History */}
      <section className="py-16 px-4 bg-[#f3fdf0]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-green-900">Our History</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
               <div className="w-full h-80 bg-sepia-200 bg-[#e8dcc6] flex items-center justify-center text-amber-900 font-bold text-xl rounded-xl shadow-lg">
                  History Image Placeholder
               </div>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold mb-4 text-green-800">Rooted in Tradition</h3>
              <p className="text-gray-700 mb-4">
                Founded in 1950, our farm started as a small family plot. Over the decades, we have grown into a leader in sustainable agriculture, passing down knowledge from generation to generation.
              </p>
              <p className="text-gray-700">
                While our tools have changed—from horse-drawn plows to smart drones—our commitment to the land remains the same.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Farmers */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-green-900">Meet the Farmers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Farmer 1 */}
            <div className="card bg-base-100 shadow-xl border border-green-100">
              <figure className="h-64 bg-gray-200 flex items-center justify-center">
                 <span className="text-gray-500">Farmer 1 Photo</span>
              </figure>
              <div className="card-body">
                <h2 className="card-title text-green-900">John Doe</h2>
                <p className="text-green-700">Head Farmer</p>
                <p className="text-gray-600">With over 40 years of experience, John oversees all planting and harvesting operations.</p>
              </div>
            </div>
            {/* Farmer 2 */}
            <div className="card bg-base-100 shadow-xl border border-green-100">
              <figure className="h-64 bg-gray-200 flex items-center justify-center">
                 <span className="text-gray-500">Farmer 2 Photo</span>
              </figure>
              <div className="card-body">
                <h2 className="card-title text-green-900">Jane Smith</h2>
                <p className="text-green-700">Agronomist</p>
                <p className="text-gray-600">Jane specializes in soil health and crop rotation strategies to ensure long-term sustainability.</p>
              </div>
            </div>
            {/* Farmer 3 */}
            <div className="card bg-base-100 shadow-xl border border-green-100">
              <figure className="h-64 bg-gray-200 flex items-center justify-center">
                 <span className="text-gray-500">Farmer 3 Photo</span>
              </figure>
              <div className="card-body">
                <h2 className="card-title text-green-900">Mike Johnson</h2>
                <p className="text-green-700">Tech Lead</p>
                <p className="text-gray-600">Mike manages our smart sensors and drone fleet, bridging the gap between nature and technology.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-16 px-4 bg-[#E5F9DB]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-green-900">Sustainability First</h2>
          <p className="text-xl text-green-800 mb-8">
            We are proud to be 100% organic and carbon neutral. Our farm utilizes solar power, rainwater harvesting, and regenerative farming techniques.
          </p>
          <button className="btn btn-primary bg-green-700 border-none hover:bg-green-800 text-white">Learn More About Our Practices</button>
        </div>
      </section>
    </div>
  );
}
