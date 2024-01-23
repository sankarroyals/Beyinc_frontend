export const socket_io = "https://beyinc-socket.onrender.com"
// export const socket_io = "ws://localhost:8900"

export const domain_subdomain = {
    "Agriculture": [
        "Agriculture",
        "AgroTech",
        "Fruit & Veg",
        "Horticulture",
        "Forestry",
        "Aquaculture"
    ],
    "Business Services": [
        "Law",
        "Accounting",
        "Security",
        "Insurance",
        "Recruitment",
        "Translation",
        "Consultancy"
    ],
    "Education & Training": [
        "Education",
        "Training",
        "EdTech",
        "School",
        "University"
    ],
    "Energy & Environmental": [
        "Energy",
        "Mining",
        "Renewables",
        "GreenTech",
        "Oil & Gas",
        "Environmental"
    ],
    "Entertainment & Leisure": [
        "Sport",
        "Concerts",
        "Tourism",
        "Events",
        "Entertainment",
        "Gambling",
        "Art"
    ],
    "Fashion & Beauty": [
        "Cosmetics",
        "Clothing",
        "Salon",
        "Jewellery",
        "Fashion",
        "Textiles",
        "Beauty"
    ],
    "Finance": [
        "Finance",
        "Investment",
        "Cryptocurrency",
        "Trading",
        "FinTech",
        "Banking"
    ],
    "Food & Beverage": [
        "Food",
        "Beverage",
        "Alcohol",
        "Nutrition",
        "Organic"
    ],
    "Hospitality, Restaurants & Bars": [
        "Bars",
        "Restaurants",
        "Fast Food",
        "Hotels",
        "Cafes"
    ],
    "Manufacturing & Engineering": [
        "Manufacturing",
        "Engineering",
        "Prototyping",
        "3D Printing",
        "Chemicals",
        "Materials",
        "Machinery"
    ],
    "Media": [
        "Publishing",
        "Radio",
        "Film",
        "TV",
        "Music"
    ],
    "Medical & Services": [
        "MedTech",
        "Healthcare",
        "Pharma",
        "Biotech",
        "Medical"
    ],
    "Personal Services": [
        "Massage",
        "Spa",
        "Cleaning",
        "Gardening",
        "Laundry",
        "Pets"
    ],
    "Products & Innovation": [
        "Products",
        "Inventions",
        "Gadgets",
        "Patent",
        "Design"
    ],
    "Property": [
        "Property",
        "Construction",
        "Land",
        "Commercial Property",
        "Residential Property",
        "Property Services",
        "Warehousing"
    ],
    "Retail": [
        "Retail",
        "FMCG",
        "Shop",
        "Consumer",
        "Wholesale"
    ],
    "Sales & Marketing": [
        "Marketing",
        "Sales",
        "PR",
        "Advertising",
        "Digital Marketing"
    ],
    "Software": [
        "Software",
        "Ecommerce",
        "Apps",
        "Data",
        "SaaS",
        "Gaming",
        "Web"
    ],
    "Technology": [
        "Technology",
        "Robotics",
        "IT Hardware",
        "Telecom",
        "Mobile",
        "Electronics",
        "Computers"
    ],
    "Transportation": [
        "Transport",
        "Aerospace",
        "Logistics",
        "Automotive",
        "Marine",
        "Aviation"
    ]
}



export const domainPitch = ['health', 'education']
export const techPitch = ['web development', 'teaching']
export const itPositions = [
    'Lead', 'Freelancer',
    'CEO',
    'Co Founder',
    'Software Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile App Developer',
    'Web Developer',
    'DevOps Engineer',
    'System Administrator',
    'Network Administrator',
    'Database Administrator',
    'Quality Assurance (QA) Engineer',
    'Software Tester',
    'Business Analyst',
    'Product Manager',
    'Project Manager',
    'UI/UX Designer',
    'Data Scientist',
    'Data Analyst',
    'Machine Learning Engineer',
    'Artificial Intelligence (AI) Engineer',
    'Cloud Engineer',
    'Cloud Architect',
    'Cybersecurity Analyst',
    'Information Security Specialist',
    'IT Support Specialist',
    'IT Consultant',
    'Network Engineer',
    'Technical Writer',
    'Systems Analyst',
    'Technical Support Engineer',
    'Solution Architect',
    'IT Manager',
    'Chief Technology Officer (CTO)',
    'Chief Information Officer (CIO)',
    'Blockchain Developer',
    'Quantum Computing Engineer',
    'Game Developer',
    'Embedded Systems Engineer',
    'IT Trainer',
    'Robotics Engineer',
    'Virtual Reality (VR) Developer',
    'Augmented Reality (AR) Developer',
    'Data Engineer',
    'UI/UX Researcher',
    'IT Auditor',
    'IT Compliance Analyst',
    'ERP Consultant',
    'IT Recruiter',
    'Business Intelligence (BI) Developer',
    'Mobile Game Developer',
    'Frontend Architect',
    'Backend Architect',
    'Microservices Architect',
    'IT Procurement Specialist',
    'Health IT Specialist',
    'Geospatial Data Scientist',
    'Web Security Analyst',
    'Ethical Hacker',
    'Data Warehouse Architect',
    'Disaster Recovery Specialist',
    'Digital Marketing Technologist',
    'Financial Systems Analyst',
    'AR/VR Interaction Designer',
    'Geographic Information Systems (GIS) Analyst',
    'Wireless Communication Engineer',
    'System Integration Engineer',
    'IT Operations Manager',
    'Automation Engineer',
    'Chatbot Developer',
    'IT Compliance Manager',
    'Network Security Engineer',
    'Quantitative Analyst',
    'Digital Forensics Analyst',
    'Middleware Developer',
    'Business Process Analyst',
    'E-commerce Developer',
    'Linux System Administrator',
    'Information Systems Manager',
    'IT Project Coordinator',
    'Systems Engineer',
    'IT Security Consultant',
    'Mobile Solutions Architect',
    'Cloud Security Engineer',
    'IT Risk Analyst',
    'Technical Recruiter',
    'Software Configuration Manager',
    'Content Management System (CMS) Developer',
    'API Developer',
    'IT Business Continuity Planner',
    'Wireless Network Engineer',
    'Geotechnical Software Engineer',
    'Agile Coach',
    'Systems Integration Specialist',
    'Digital Transformation Consultant',
    'Big Data Engineer',
    'Customer Support Engineer',
];


export const convertToDate = (inputDate) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const date = inputDate?.split('-')[1][0] == '0' ? inputDate?.split('-')[1][1]-1 : inputDate?.split('-')[1]-1
    return `${months[date]} ${inputDate?.split('-')[0]}`

}
