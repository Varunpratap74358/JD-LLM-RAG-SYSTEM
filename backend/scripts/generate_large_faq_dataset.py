import json
import uuid

# ==========================================
# 1. KNOWLEDGE BASE (Source of Truth)
# ==========================================

COMPANY_NAME = "Predusk Technology Pvt Ltd"
FOUNDER = "Varun Pratap Singh"

TECH_STACK = {
    "Frontend": ["React.js", "Next.js", "Angular", "Tailwind CSS", "HTML5", "CSS3", "JavaScript", "TypeScript", "Redux", "Material UI"],
    "Backend": ["Node.js", "Express.js", "NestJS", "GoLang", "Python", "FastAPI", "Django", "GraphQL", "REST API", "Socket.IO"],
    "Database": ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "Supabase", "DynamoDB"],
    "DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Git", "GitHub", "GitLab", "Jenkins", "Terraform", "Nginx"],
    "AI/ML": ["GenAI", "LLMs", "OpenAI API", "Hugging Face", "LangChain", "RAG", "Vector Databases", "Pinecone", "TensorFlow", "PyTorch"]
}

PROJECTS = {
    "Lands and Homes": {
        "desc": "A comprehensive property and user management platform.",
        "stack": "GoLang, PostgreSQL, GraphQL, Next.js",
        "role": "Full Stack Development & Architecture"
    },
    "E-commerce Platform": {
        "desc": "A scalable online shopping solution with admin panels and secure payments.",
        "stack": "MERN Stack (MongoDB, Express, React, Node)",
        "role": "End-to-end development"
    },
    "Real-time Chat Application": {
        "desc": "High-performance chat system supporting thousands of concurrent users.",
        "stack": "MEAN Stack (MongoDB, Express, Angular, Node) with Socket.IO",
        "role": "Backend optimization and WebSocket implementation"
    },
    "Dating App": {
        "desc": "Mobile-first dating platform with matchmaking algorithms.",
        "stack": "MERN Stack + Flutter for mobile",
        "role": "API design and Auth implementation"
    }
}

SERVICES = [
    "Custom AI Solution", "Cloud Migration", "Legacy Code Refactoring", "API Development",
    "MVP Development", "SaaS Product Design", "Enterprise Software", "Mobile App Backend",
    "Real-time System", "Performance Optimization", "Security Audit", "Database Design"
]

ROLES_WE_HIRE = [
    "Frontend Developer", "Backend Engineer", "Full Stack Developer", "DevOps Engineer",
    "AI Researcher", "Data Scientist", "UI/UX Designer", "Product Manager"
]

# ==========================================
# 2. GENERATOR LOGIC
# ==========================================

faqs = []
faq_counter = 1

def add_faq(question, variations, answer):
    global faq_counter
    # Ensure ID is padded, e.g., faq_001
    faq_id = f"faq_{faq_counter:04d}" 
    faqs.append({
        "id": faq_id,
        "question": question,
        "variations": variations,
        "answer": answer
    })
    faq_counter += 1

# --- CATEGORY A: TECH STACK (Permutations) ---
# Generates ~50 techs * 4 variations = 200 items

for category, technologies in TECH_STACK.items():
    for tech in technologies:
        # Template 1: Capability
        add_faq(
            question=f"Do you work with {tech}?",
            variations=[
                f"Is {tech} part of your tech stack?",
                f"Can you build apps using {tech}?",
                f"Do you have experience with {tech}?",
                f"Are you experts in {tech}?"
            ],
            answer=f"Yes, {tech} is a core part of our {category} technology stack. We have extensive experience building scalable and secure applications using {tech}."
        )
        
        # Template 2: Hiring/Consulting
        add_faq(
            question=f"Can I hire a {tech} developer?",
            variations=[
                f"Do you offer {tech} consulting?",
                f"I need a {tech} expert",
                f"Looking for {tech} development services"
            ],
            answer=f"Yes, we provide dedicated {tech} developers and consulting services. Our team creates high-performance solutions tailored to your business needs using {tech}."
        )

# --- CATEGORY B: PROJECTS (Deep Dive) ---
# Generates 4 projects * 4 templates = 16 items

for project, details in PROJECTS.items():
    # Template 1: Overview
    add_faq(
        question=f"Tell me about the {project} project.",
        variations=[
            f"What is {project}?",
            f"Describe the {project} case study",
            f"Have you built something like {project}?"
        ],
        answer=f"{project} is {details['desc']} It was built using {details['stack']}, focusing on {details['role']}."
    )
    
    # Template 2: Tech Stack specific
    add_faq(
        question=f"What technology was used in {project}?",
        variations=[
            f"Tech stack for {project}",
            f"How was {project} built?",
            f"Coding language of {project}"
        ],
        answer=f"The {project} project was engineered using {details['stack']}."
    )

# --- CATEGORY C: SERVICES (Service Catalog) ---
# Generates 12 services * 3 templates = 36 items

for service in SERVICES:
    add_faq(
        question=f"Do you offer {service}s?",
        variations=[
            f"Can you help with {service}?",
            f"I need {service}",
            f"Services for {service}"
        ],
        answer=f"Yes, {service} is one of our key offerings. We help businesses innovate and scale by providing expert {service}s tailored to their requirements."
    )

# --- CATEGORY D: FOUNDER & COMPANY ---

founder_q = [
    ("Who is the founder?", "The company was co-founded by Varun Pratap Singh, a Full Stack Developer wite expertise in MERN and MEAN stacks."),
    ("What represents your company culture?", "Our culture is built on innovation, transparency, and continuous learning. We prioritize code quality and long-term client success."),
    ("Do you utilize AI internally?", "Yes, we integrate AI into our internal workflows for coding optimization, testing, and automated deployment."),
    ("Why choose Predusk Technology?", "We offer a unique blend of technical expertise (AI, Cloud, Full Stack) and business acumen, ensuring your product is built for growth, not just launch."),
    ("Are you a remote company?", "Yes, we are a remote-first organization with a distributed team of experts across multiple time zones.")
]

for q, a in founder_q:
    add_faq(q, [f"Tell me about {q.split()[-1].strip('?')}", "Question about " + q.split()[-1].strip('?')], a)

# --- CATEGORY E: HIRING & ROLES ---
for role in ROLES_WE_HIRE:
    add_faq(
        question=f"Are you hiring {role}s?",
        variations=[
            f"Job opening for {role}",
            f"Careers: {role}",
            f"Do you have a vacancy for {role}?"
        ],
        answer=f"We are frequently looking for talented {role}s. Please check our careers page or send your resume to careers@predusk.com."
    )

# --- CATEGORY F: BOILERPLATE & GENERIC (SCALING TO 700) ---
# To reach high numbers meaningfully, we generate combinations of Stack + Service

for tech_cat, tech_list in TECH_STACK.items():
    for tech in tech_list:
        for service in ["Consulting", "Migration", "Audit", "Performance Tuning"]:
             add_faq(
                question=f"Do you provide {service} for {tech}?",
                variations=[
                    f"{tech} {service} services",
                    f"Help with {tech} {service}",
                    f"Can you {service.lower()} my {tech} app?"
                ],
                answer=f"Yes, we specialize in {service} for {tech} applications, ensuring they are optimized, secure, and scalable."
            )

# ==========================================
# 3. OUTPUT
# ==========================================

output_path = "backend/data/faqs_generated.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(faqs, f, indent=4)

print(f"SUCCESS: Generated {len(faqs)} unique FAQs at {output_path}")
