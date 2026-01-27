import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import heroImage from "@/public/HomeImages/empoweringbangladesh_agriculture.jpg";
import featureImage from "@/public/HomeImages/bangladesh_2.png";
import tasir from "@/public/HomeImages/tasir.jpg"
import abid from "@/public/HomeImages/abid.jpg"
import salab from "@/public/HomeImages/salab_drop.jpg"
import matri from "@/public/HomeImages/matri.jpg"
const avatarPlaceholder = "https://i.pravatar.cc/150";

export default function Home() {
  return (
    <div className="bg-[#F1F8E9] min-h-screen font-sans selection:bg-green-200">
      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 space-y-8 animate-in slide-in-from-left duration-700">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Empowering Bangladesh&apos;s Agriculture
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              From fresh produce to essential farming tools — we connect rural innovation with urban markets, supporting farmers, feeding the future.
            </p>
          </div>
          <div className="lg:w-1/2 relative h-[400px] md:h-[500px] animate-in slide-in-from-right duration-700">
            <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl shadow-green-900/10 transform hover:scale-[1.02] transition-transform duration-500">
               {/* 
                 NOTE: The user will place the actual oxen image here later. 
                 Using a stylized div placeholder for now as requested.
               */}
               <Image 
                 src={heroImage} 
                 alt="Empowering Bangladesh Agriculture" 
                 fill 
                 className="object-cover" 
                 priority
                 placeholder="blur"
                 sizes="(max-width: 1024px) 100vw, 50vw"
               />
            </div>
          </div>
        </section>

        {/* our services Section */}
        <section className="bg-white py-32 rounded-[5rem] shadow-sm">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-20 lowercase tracking-tight">our services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {/* Service Cards */}
              {[
                { title: "Weather updates", desc: "Get real-time local weather alerts for smarter farming decisions.", icon: "☀" },
                { title: "AI Powered Field Maps", desc: "Monitor your land with precision mapping for efficient planning and monitoring.", icon: "🗺" },
                { title: "Crop Disease Detection", desc: "Identify problem instantly with AI-powered disease detection and suggestions.", icon: "🌾" },
                { title: "Chat Bot", desc: "Ask questions and get instant guidance from our 24/7 farming assistant.", icon: "🤖" },
                { title: "Market Trends", desc: "Stay updated with the latest farming trends and detailed seen insights.", icon: "📈" },
                { title: "Open Market", desc: "Buy and sell seeds, tools, and farm products directly from your small dashboard.", icon: "🏪" },
              ].map((service, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-[#F1F8E9] border border-green-50 hover:border-green-200 transition-all hover:shadow-xl hover:shadow-green-900/5 flex gap-6 items-start">
                   <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                     {service.icon}
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                     <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bangladesh 2.0 Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2 relative h-[400px] md:h-[500px] rounded-[4rem] overflow-hidden shadow-2xl">
              {/* Placeholder for Drone/Farmer Image */}
              <Image 
                src={featureImage} 
                alt="Bangladesh 2.0" 
                fill 
                className="object-cover transform hover:scale-105 transition-transform duration-700" 
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
          </div>
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Let&apos;s Create Bangladesh 2.0
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Be part of a smarter, greener Bangladesh. Together, we&apos;re building the future of agriculture with AI, IoT, and sustainable innovation. Join us to empower farmers, boost productivity, and revolutionize rural communities —one smart field at a time.
            </p>
            <button className="px-10 py-4 bg-[#6BBF59] text-white font-bold rounded-2xl shadow-lg shadow-green-900/20 hover:bg-[#5aa84a] transition-all transform hover:-translate-y-1">
              Join Now
            </button>
          </div>
        </section>

        {/* Testimonials section */}
        <section className="bg-white py-32 rounded-[5rem] mb-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <h2 className="text-4xl font-bold text-gray-900 mb-20 tracking-tight">What do our users say ?</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Salab Eam", role: "Agriculture Farm, Dhaka, Bangladesh", text: "this smart farming system has completely changed how we manage our crops. AI analysis can helps us make right decisions every day. highly recommended for any farm owner!",imageOfPerson:salab },
                  { name: "Abid Rafi", role: "Agriculture Farm, Dhaka, Bangladesh", text: "We've seen a significant increase in productivity and a reduction in waste since adopting this solution. The daily tracking and automated alerts are spot on. Totally worth the investment!",imageOfPerson:abid },
                  { name: "Noara Matri", role: "Agriculture Farm, Dhaka, Bangladesh", text: "I've never seen such a smooth integration of technology in agriculture. The system monitors soil, weather, and water requirements. It's like having a smart assistant for the farm.",imageOfPerson:matri},
                  { name: "Tasirul Islam", role: "Agriculture Farm, Dhaka, Bangladesh", text: "This project brings modern solutions to traditional farming. It empowers small and large farms alike with real-time data and automation. Brilliant innovation for the agricultural industry!",imageOfPerson:tasir},
                ].map((user, i) => (
                  <div key={i} className="bg-[#6BBF59] p-8 rounded-[2.5rem] flex flex-col items-center text-center text-white shadow-xl shadow-green-900/10 transition-transform hover:scale-105 duration-500">
                    <p className="text-xs font-medium leading-relaxed mb-8 opacity-90 h-28 overflow-hidden">
                      "{user.text}"
                    </p>
                    <div className="w-16 h-16 rounded-full border-2 border-white/50 overflow-hidden mb-4 shadow-lg focus-within:ring-2 ring-white">
                      <Image src={user.imageOfPerson} alt={user.name} width={64} height={64} className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-wide">{user.name}</h4>
                      <p className="text-[10px] opacity-70 mt-1 uppercase font-bold tracking-tighter">{user.role}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
