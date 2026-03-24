"use client";

import Link from "next/link";

const footerData = [
  {
    title: "ONLINE SHOPPING",
    links: [
      "Men",
      "Women",
      "Kids",
      "Home & Living",
      "Beauty",
      "Gift Card",
      "Myntra Insider",
    ],
  },
  {
    title: "CUSTOMER POLICIES",
    links: [
      "Contact Us",
      "FAQ",
      "T&C",
      "Terms Of Use",
      "Track Orders",
      "Shipping",
      "Returns",
    ],
  },
  {
    title: "EXPERIENCE MYNTRA APP",
    links: [
      "Android App",
      "iOS App",
      "Careers",
      "Privacy Policy",
      "Blog",
      "Site Map",
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-10">
      
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {footerData.map((section, index) => (
          <div key={index}>
            <h3 className="font-semibold mb-3 text-sm">
              {section.title}
            </h3>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {section.links.map((link, i) => (
                <Link
                  key={i}
                  href="#"
                  className="hover:text-black transition"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <hr />

      {/* Bottom */}
      <div className="text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} www.myntra.com. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;