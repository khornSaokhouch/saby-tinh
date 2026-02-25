// app/our-story/page.jsx
import { FaGlobeAsia, FaBullseye, FaChartLine, FaUsers, FaMedal, FaCodeBranch } from 'react-icons/fa';
import Link from 'next/link';

export const metadata = {
    title: "Our Story | E-Commerces",
    description: "Learn about the journey, mission, and vision of E-Commerces.",
};

// --- Data for Enhanced Narrative ---
const milestones = [
    { year: 2018, title: "The Concept & Founding", description: "Established E-Commerces in Phnom Penh with a small team focused on local business digitization." },
    { year: 2019, title: "Launch of V1 Platform", description: "Successfully launched the first version of our marketplace, onboarding 50 pilot merchants." },
    { year: 2021, title: "Scaling & Regional Expansion", description: "Secured Series A funding. Expanded merchant support and logistics network into neighboring provinces." },
    { year: 2023, title: "Introducing E-Payments", description: "Integrated proprietary payment gateways, drastically improving transaction security and speed for all users." },
    { year: 2025, title: "Future Forward", description: "Focused on leveraging AI and machine learning to offer personalized merchant insights and enhance buyer experience." },
];

const coreValues = [
    { icon: FaUsers, title: "Customer Obsession", details: "We start with the customer and work backward, aiming for exceptional service and platform usability." },
    { icon: FaChartLine, title: "Sustainable Growth", details: "We build features and processes that ensure long-term stability and success for both our merchants and our company." },
    { icon: FaCodeBranch, title: "Technical Excellence", details: "We commit to scalable, secure, and cutting-edge technology that reliably powers e-commerce." },
];

// --- Helper Components for Styling ---
const StaggeredSection = ({ title, children, imageSrc, altText, icon: Icon, reverse = false }) => (
    <div className={`flex flex-col md:flex-row items-center gap-12 py-10 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="md:w-1/2">
            {/* Placeholder image for demonstration */}
            <img
                src={imageSrc || "/images/placeholder.jpg"} 
                alt={altText}
                className="rounded-3xl shadow-2xl w-full object-cover h-72 md:h-96 transform hover:scale-[1.02] transition duration-500"
            />
        </div>
        <div className="md:w-1/2">
            <div className="flex items-center space-x-3 mb-4 text-indigo-600">
                <Icon size={30} className="flex-shrink-0" />
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">{children}</p>
        </div>
    </div>
);

const TimelineItem = ({ year, title, description, isLast }) => (
    <div className="relative pl-8 sm:pl-16">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            
            {/* Year Tag */}
            <div className="flex-shrink-0 text-xl font-extrabold text-indigo-700 w-16 -ml-16 sm:ml-0 text-left sm:text-right">
                {year}
            </div>

            {/* Timeline Connector */}
            <div className="absolute left-0 top-0 h-full w-0.5 bg-indigo-200">
                <div className="absolute w-4 h-4 rounded-full bg-indigo-600 -left-[7.5px] top-0 shadow-lg border-4 border-white"></div>
                {!isLast && <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-indigo-300"></div>}
            </div>

            {/* Content */}
            <div className="pb-8 pl-6 sm:pl-0">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    </div>
);

// --- Main Component ---
export default function OurStoryPage() {
    return (
        <main className="min-h-screen py-16">
            <section className="max-w-6xl mx-auto px-6 md:px-12 space-y-20">
                
                {/* 1. Hero Header */}
                <header className="text-center max-w-4xl mx-auto border-b pb-8">
                    <p className="text-lg font-semibold text-indigo-600 mb-2">
                        OUR HERITAGE
                    </p>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tighter">
                        The Story Behind <span className="text-indigo-700">E-Commerces</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        From a simple idea in a small office to empowering hundreds of businesses—our journey is driven by commitment and innovation.
                    </p>
                </header>
                
                {/* 2. Mission Section (Left Image) */}
                <StaggeredSection
                    title="Our Mission"
                    imageSrc="http://googleusercontent.com/images/mission.jpg"
                    altText="Our Mission to Empower Businesses"
                    icon={FaBullseye}
                >
                    At E-Commerces, our core mission is simple: to **democratize e-commerce**. We exist to empower businesses in Cambodia and the wider ASEAN region to sell online effortlessly. We provide secure, scalable, and beautifully designed solutions that bridge the digital divide, ensuring every merchant—from local artisans to large distributors—has the tools to succeed globally.
                </StaggeredSection>

                {/* 3. Vision Section (Right Image) */}
                <StaggeredSection
                    title="Our Vision"
                    imageSrc="http://googleusercontent.com/images/vision.jpg"
                    altText="Our Vision for Global Commerce"
                    icon={FaGlobeAsia}
                    reverse={true}
                >
                    We envision a future where borders don't limit commerce. We aim to be the **leading e-commerce platform in Southeast Asia**, recognized for innovation, reliability, and fostering a thriving digital ecosystem. By simplifying complex e-commerce technology, we strive to unlock unprecedented growth and opportunity for all entrepreneurs we serve.
                </StaggeredSection>

                {/* 4. Our Journey (Timeline) */}
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                        Key Milestones
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        {milestones.map((item, index) => (
                            <TimelineItem
                                key={item.year}
                                year={item.year}
                                title={item.title}
                                description={item.description}
                                isLast={index === milestones.length - 1}
                            />
                        ))}
                    </div>
                </div>

                {/* 5. Our Core Values (Grid) */}
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 text-center mb-10">
                        The Principles That Guide Us
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {coreValues.map((value, index) => (
                            <div 
                                key={index} 
                                className="bg-indigo-50 p-8 rounded-xl shadow-lg border-t-4 border-indigo-600 transform hover:scale-[1.03] transition duration-300"
                            >
                                <value.icon className="text-indigo-700 mb-3" size={32} />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-700 text-base">{value.details}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. CTA Footer */}
                <footer className="text-center pt-10 border-t border-gray-200">
                    <p className="text-xl text-gray-700 mb-4">
                        Ready to see the future of e-commerce in action?
                    </p>
                    <Link
                        href="/contact-us"
                        className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition transform hover:translate-y-0.5"
                    >
                        Contact Our Team Today
                    </Link>
                </footer>
            </section>
        </main>
    );
}