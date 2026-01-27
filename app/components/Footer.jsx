import React from 'react';
import Image from 'next/image';
import logo from '@/public/smartFarming.png';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-[#F1F8E9] pt-20 pb-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Logo & Socials */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                             <Image src={logo} alt="Smart Farming" width={40} height={40} />
                             <span className="font-bold text-gray-800">Smart Farming</span>
                        </div>
                        <div className="flex gap-4">
                            {/* Simple placeholders for social icons */}
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 cursor-pointer transition-colors">𝕏</div>
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 cursor-pointer transition-colors">📸</div>
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 cursor-pointer transition-colors">▶</div>
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 cursor-pointer transition-colors">in</div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-6">Smart Solutions</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>Weather Insights</li>
                            <li>Market Prices</li>
                            <li>Crop Health Monitor</li>
                            <li>Yield Analysis</li>
                            <li>Soil Quality Check</li>
                            <li>Disease Detection</li>
                        </ul>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-6">E-Agriculture</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>Buy Seeds</li>
                            <li>Farming Tools</li>
                            <li>Fertilizers</li>
                            <li>Open Market</li>
                            <li>Sell Produce</li>
                            <li>Logistics Support</li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-6">Support & More</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>Expert Advice</li>
                            <li>Farmer Community</li>
                            <li>Help Center</li>
                            <li>Success Stories</li>
                            <li>Tutorials</li>
                            <li>Government Subsidy</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-400">
                    <p>© 2026 Smart Farming. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
