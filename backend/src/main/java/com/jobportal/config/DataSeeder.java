package com.jobportal.config;

import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, JobRepository jobRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only seed jobs if none exist yet
        if (jobRepository.count() > 0) return;

        // ── Admin ──
        userRepository.findByEmail("admin@jobportal.com").orElseGet(() -> {
            User u = new User();
            u.setName("Admin");
            u.setEmail("admin@jobportal.com");
            u.setPassword(passwordEncoder.encode("admin123"));
            u.setRole(User.Role.ADMIN);
            return userRepository.save(u);
        });

        // ── Employers ──
        User google = employer("Google Recruiter",   "recruiter@google.com",   "Google",     "Mountain View, CA");
        User amazon = employer("Amazon HR",           "hr@amazon.com",          "Amazon",     "Seattle, WA");
        User infosys= employer("Infosys Talent",      "talent@infosys.com",     "Infosys",    "Bangalore, India");
        User meta   = employer("Meta Hiring",         "hiring@meta.com",        "Meta",       "Menlo Park, CA");
        User tcs    = employer("TCS Recruiter",       "recruit@tcs.com",        "TCS",        "Mumbai, India");
        User wipro  = employer("Wipro HR",            "hr@wipro.com",           "Wipro",      "Hyderabad, India");
        User ms     = employer("Microsoft Talent",    "talent@microsoft.com",   "Microsoft",  "Redmond, WA");
        User ibm    = employer("IBM Hiring",          "hiring@ibm.com",         "IBM",        "New York, NY");
        User accenture = employer("Accenture HR",     "hr@accenture.com",       "Accenture",  "Dublin, Ireland");
        User flipkart  = employer("Flipkart Recruit", "recruit@flipkart.com",   "Flipkart",   "Bangalore, India");

        // ── Google Jobs ──
        job("Senior Java Developer", "Google", "Mountain View, CA",
            "Design and build scalable microservices for Google Cloud Platform. Lead a team of 5 engineers and drive architecture decisions.",
            Job.JobType.FULL_TIME, 120000.0, 160000.0, "Java,Spring Boot,Microservices,GCP,Kubernetes", google);

        job("React Frontend Engineer", "Google", "Remote",
            "Build next-generation web applications for Google Workspace. Strong React and TypeScript skills required.",
            Job.JobType.REMOTE, 100000.0, 140000.0, "React,TypeScript,CSS,GraphQL,REST API", google);

        job("DevOps Engineer", "Google", "New York, NY",
            "Manage CI/CD pipelines, Kubernetes clusters and cloud infrastructure at scale.",
            Job.JobType.FULL_TIME, 110000.0, 150000.0, "Docker,Kubernetes,Terraform,GCP,Jenkins", google);

        job("Machine Learning Engineer", "Google", "Mountain View, CA",
            "Develop and deploy ML models for Google Search ranking and recommendations.",
            Job.JobType.FULL_TIME, 140000.0, 190000.0, "Python,TensorFlow,PyTorch,ML,Data Science", google);

        job("Android Developer", "Google", "Remote",
            "Build and maintain Android applications used by billions of users worldwide.",
            Job.JobType.REMOTE, 105000.0, 145000.0, "Android,Kotlin,Java,Jetpack Compose", google);

        job("Site Reliability Engineer", "Google", "Austin, TX",
            "Ensure reliability and performance of Google's production systems. On-call rotation required.",
            Job.JobType.FULL_TIME, 115000.0, 155000.0, "Linux,Python,Go,Kubernetes,Monitoring", google);

        // ── Amazon Jobs ──
        job("Full Stack Developer", "Amazon", "Seattle, WA",
            "Build and maintain customer-facing e-commerce features using React and Spring Boot.",
            Job.JobType.FULL_TIME, 115000.0, 155000.0, "React,Spring Boot,MySQL,AWS,Node.js", amazon);

        job("Data Engineer", "Amazon", "Remote",
            "Design and maintain data pipelines for Amazon's analytics platform using AWS services.",
            Job.JobType.REMOTE, 105000.0, 145000.0, "Python,SQL,AWS,Spark,Kafka", amazon);

        job("Backend Engineer", "Amazon", "Austin, TX",
            "6-month contract to scale Amazon's logistics backend. Node.js and PostgreSQL experience preferred.",
            Job.JobType.CONTRACT, 80000.0, 100000.0, "Node.js,PostgreSQL,REST API,AWS Lambda", amazon);

        job("Cloud Solutions Architect", "Amazon", "Seattle, WA",
            "Design cloud-native solutions for enterprise clients on AWS. AWS certification required.",
            Job.JobType.FULL_TIME, 130000.0, 175000.0, "AWS,Cloud Architecture,Terraform,Microservices", amazon);

        job("QA Automation Engineer", "Amazon", "Remote",
            "Build and maintain automated test suites for Amazon's e-commerce platform.",
            Job.JobType.REMOTE, 90000.0, 120000.0, "Selenium,Java,TestNG,CI/CD,AWS", amazon);

        job("Product Manager - AWS", "Amazon", "Seattle, WA",
            "Define product roadmap for AWS developer tools. Work closely with engineering and customers.",
            Job.JobType.FULL_TIME, 125000.0, 165000.0, "Product Management,AWS,Agile,Roadmapping", amazon);

        // ── Infosys Jobs ──
        job("Java Spring Boot Developer", "Infosys", "Bangalore, India",
            "Work on enterprise banking applications. Freshers with strong Java fundamentals welcome.",
            Job.JobType.FULL_TIME, 600000.0, 1200000.0, "Java,Spring Boot,Hibernate,MySQL,REST API", infosys);

        job("Angular Developer", "Infosys", "Hyderabad, India",
            "Develop responsive web applications for BFSI sector clients using Angular 14+.",
            Job.JobType.FULL_TIME, 500000.0, 900000.0, "Angular,TypeScript,HTML,CSS,REST API", infosys);

        job("Part-Time QA Tester", "Infosys", "Chennai, India",
            "Manual and automated testing for web and mobile applications. Selenium experience preferred.",
            Job.JobType.PART_TIME, 300000.0, 500000.0, "Selenium,JIRA,Manual Testing,Agile", infosys);

        job("Python Developer", "Infosys", "Pune, India",
            "Develop automation scripts and data processing pipelines for insurance domain clients.",
            Job.JobType.FULL_TIME, 550000.0, 1000000.0, "Python,Django,REST API,PostgreSQL,AWS", infosys);

        job("Business Analyst", "Infosys", "Bangalore, India",
            "Bridge gap between business and technology teams. Gather requirements and create BRDs.",
            Job.JobType.FULL_TIME, 700000.0, 1300000.0, "Business Analysis,JIRA,SQL,Agile,Scrum", infosys);

        // ── Meta Jobs ──
        job("iOS Developer", "Meta", "Menlo Park, CA",
            "Build features for Facebook and Instagram iOS apps used by 2 billion users.",
            Job.JobType.FULL_TIME, 130000.0, 170000.0, "Swift,Objective-C,iOS,Xcode,React Native", meta);

        job("Data Scientist", "Meta", "Remote",
            "Analyze user behavior data to improve feed ranking and ad targeting algorithms.",
            Job.JobType.REMOTE, 125000.0, 165000.0, "Python,R,SQL,Machine Learning,Statistics", meta);

        job("Security Engineer", "Meta", "Menlo Park, CA",
            "Protect Meta's infrastructure and user data from security threats and vulnerabilities.",
            Job.JobType.FULL_TIME, 135000.0, 180000.0, "Cybersecurity,Python,Penetration Testing,SIEM", meta);

        job("AR/VR Developer", "Meta", "Seattle, WA",
            "Build immersive experiences for Meta Quest and the Metaverse platform.",
            Job.JobType.FULL_TIME, 120000.0, 160000.0, "Unity,C#,AR,VR,3D Graphics,OpenXR", meta);

        job("Infrastructure Engineer", "Meta", "Remote",
            "Design and operate Meta's global data center infrastructure at massive scale.",
            Job.JobType.REMOTE, 115000.0, 155000.0, "Linux,Networking,Python,Automation,Terraform", meta);

        // ── TCS Jobs ──
        job("SAP Consultant", "TCS", "Mumbai, India",
            "Implement and support SAP modules for large enterprise clients in manufacturing sector.",
            Job.JobType.FULL_TIME, 800000.0, 1500000.0, "SAP,ABAP,SAP FICO,SAP MM,ERP", tcs);

        job("React Native Developer", "TCS", "Bangalore, India",
            "Build cross-platform mobile applications for banking and fintech clients.",
            Job.JobType.FULL_TIME, 600000.0, 1100000.0, "React Native,JavaScript,iOS,Android,REST API", tcs);

        job("Mainframe Developer", "TCS", "Chennai, India",
            "Develop and maintain COBOL applications for banking clients. Mainframe experience required.",
            Job.JobType.FULL_TIME, 700000.0, 1200000.0, "COBOL,Mainframe,JCL,DB2,VSAM", tcs);

        job("Scrum Master", "TCS", "Hyderabad, India",
            "Facilitate agile ceremonies and remove impediments for a team of 10 developers.",
            Job.JobType.FULL_TIME, 900000.0, 1600000.0, "Scrum,Agile,JIRA,Confluence,Coaching", tcs);

        job("Network Engineer", "TCS", "Pune, India",
            "Design and manage enterprise network infrastructure for global clients.",
            Job.JobType.FULL_TIME, 600000.0, 1000000.0, "Cisco,Networking,CCNA,Firewall,VPN", tcs);

        // ── Wipro Jobs ──
        job("Cloud Engineer - AWS", "Wipro", "Hyderabad, India",
            "Migrate on-premise workloads to AWS cloud for enterprise clients.",
            Job.JobType.FULL_TIME, 700000.0, 1300000.0, "AWS,Cloud Migration,Terraform,Linux,Python", wipro);

        job("UI/UX Designer", "Wipro", "Bangalore, India",
            "Design intuitive user interfaces for web and mobile applications. Figma expertise required.",
            Job.JobType.FULL_TIME, 600000.0, 1100000.0, "Figma,UI/UX,Wireframing,Prototyping,CSS", wipro);

        job("Cybersecurity Analyst", "Wipro", "Remote",
            "Monitor and respond to security incidents. Conduct vulnerability assessments.",
            Job.JobType.REMOTE, 800000.0, 1400000.0, "Cybersecurity,SIEM,Splunk,Incident Response,CISSP", wipro);

        job("Tableau Developer", "Wipro", "Chennai, India",
            "Build interactive dashboards and reports for business intelligence projects.",
            Job.JobType.FULL_TIME, 550000.0, 950000.0, "Tableau,SQL,Power BI,Data Visualization,Excel", wipro);

        job("Java Microservices Developer", "Wipro", "Pune, India",
            "Develop microservices for healthcare domain using Spring Boot and Docker.",
            Job.JobType.FULL_TIME, 700000.0, 1200000.0, "Java,Spring Boot,Docker,Kubernetes,REST API", wipro);

        // ── Microsoft Jobs ──
        job("Azure Cloud Developer", "Microsoft", "Redmond, WA",
            "Build cloud-native applications on Microsoft Azure. Work on Azure DevOps and AKS.",
            Job.JobType.FULL_TIME, 125000.0, 165000.0, "Azure,C#,.NET,Kubernetes,DevOps", ms);

        job("C# .NET Developer", "Microsoft", "Remote",
            "Develop enterprise software solutions using .NET 8 and Azure cloud services.",
            Job.JobType.REMOTE, 110000.0, 150000.0, "C#,.NET,Azure,SQL Server,REST API", ms);

        job("Power Platform Developer", "Microsoft", "Redmond, WA",
            "Build low-code solutions using Power Apps, Power Automate and Power BI.",
            Job.JobType.FULL_TIME, 100000.0, 135000.0, "Power Apps,Power Automate,Power BI,SharePoint", ms);

        job("Technical Program Manager", "Microsoft", "Seattle, WA",
            "Drive cross-team engineering programs for Microsoft 365 products.",
            Job.JobType.FULL_TIME, 130000.0, 170000.0, "Program Management,Agile,Azure,Leadership", ms);

        job("Accessibility Engineer", "Microsoft", "Remote",
            "Ensure Microsoft products meet WCAG 2.1 AA accessibility standards.",
            Job.JobType.REMOTE, 105000.0, 140000.0, "Accessibility,WCAG,HTML,CSS,Screen Readers", ms);

        // ── IBM Jobs ──
        job("Blockchain Developer", "IBM", "New York, NY",
            "Build enterprise blockchain solutions using Hyperledger Fabric for financial clients.",
            Job.JobType.FULL_TIME, 115000.0, 155000.0, "Blockchain,Hyperledger,Node.js,Go,Smart Contracts", ibm);

        job("AI Engineer", "IBM", "Remote",
            "Develop AI solutions using IBM Watson and open-source ML frameworks.",
            Job.JobType.REMOTE, 120000.0, 160000.0, "Python,IBM Watson,NLP,Machine Learning,TensorFlow", ibm);

        job("Database Administrator", "IBM", "Austin, TX",
            "Manage and optimize DB2 and PostgreSQL databases for enterprise clients.",
            Job.JobType.FULL_TIME, 95000.0, 130000.0, "DB2,PostgreSQL,SQL,Performance Tuning,Backup", ibm);

        job("Integration Developer", "IBM", "New York, NY",
            "Build API integrations using IBM MQ and REST APIs for banking clients.",
            Job.JobType.CONTRACT, 85000.0, 110000.0, "IBM MQ,REST API,Java,Kafka,Integration", ibm);

        // ── Accenture Jobs ──
        job("Salesforce Developer", "Accenture", "Dublin, Ireland",
            "Implement Salesforce CRM solutions for retail and telecom clients.",
            Job.JobType.FULL_TIME, 70000.0, 110000.0, "Salesforce,Apex,LWC,SOQL,CRM", accenture);

        job("ServiceNow Developer", "Accenture", "Remote",
            "Configure and customize ServiceNow ITSM platform for enterprise clients.",
            Job.JobType.REMOTE, 75000.0, 115000.0, "ServiceNow,JavaScript,ITSM,Glide,REST API", accenture);

        job("RPA Developer", "Accenture", "Dublin, Ireland",
            "Build robotic process automation solutions using UiPath and Blue Prism.",
            Job.JobType.FULL_TIME, 65000.0, 100000.0, "UiPath,Blue Prism,RPA,Python,Automation", accenture);

        job("Digital Marketing Analyst", "Accenture", "London, UK",
            "Analyze digital marketing campaigns and provide data-driven recommendations.",
            Job.JobType.PART_TIME, 40000.0, 60000.0, "Google Analytics,SEO,SEM,Data Analysis,Excel", accenture);

        job("ERP Consultant", "Accenture", "Remote",
            "Implement Oracle ERP solutions for manufacturing and retail clients globally.",
            Job.JobType.REMOTE, 80000.0, 120000.0, "Oracle ERP,SQL,Business Analysis,Finance,SCM", accenture);

        // ── Flipkart Jobs ──
        job("Backend Engineer - Golang", "Flipkart", "Bangalore, India",
            "Build high-performance backend services for Flipkart's supply chain platform.",
            Job.JobType.FULL_TIME, 1200000.0, 2000000.0, "Go,Golang,Microservices,Kafka,MySQL", flipkart);

        job("Data Analyst", "Flipkart", "Bangalore, India",
            "Analyze seller and customer data to improve marketplace experience.",
            Job.JobType.FULL_TIME, 800000.0, 1400000.0, "SQL,Python,Tableau,Excel,Statistics", flipkart);

        job("iOS Developer", "Flipkart", "Bangalore, India",
            "Build and optimize the Flipkart iOS app for millions of daily users.",
            Job.JobType.FULL_TIME, 1000000.0, 1800000.0, "Swift,iOS,Xcode,REST API,Performance", flipkart);

        job("Growth Hacker", "Flipkart", "Remote",
            "Drive user acquisition and retention through data-driven growth experiments.",
            Job.JobType.REMOTE, 700000.0, 1200000.0, "Growth Hacking,A/B Testing,SQL,Marketing,Analytics", flipkart);

        job("DevOps Engineer", "Flipkart", "Bangalore, India",
            "Manage Flipkart's Kubernetes infrastructure handling millions of requests per second.",
            Job.JobType.FULL_TIME, 1100000.0, 1900000.0, "Kubernetes,Docker,AWS,Terraform,CI/CD", flipkart);

        System.out.println("✅ Seeded 50 jobs across 10 companies!");
    }

    private User employer(String name, String email, String company, String location) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setName(name);
            u.setEmail(email);
            u.setPassword(passwordEncoder.encode("password123"));
            u.setRole(User.Role.EMPLOYER);
            u.setCompany(company);
            u.setLocation(location);
            return userRepository.save(u);
        });
    }

    private void job(String title, String company, String location, String description,
                     Job.JobType type, Double salaryMin, Double salaryMax,
                     String skills, User postedBy) {
        Job j = new Job();
        j.setTitle(title);
        j.setCompany(company);
        j.setLocation(location);
        j.setDescription(description);
        j.setType(type);
        j.setSalaryMin(salaryMin);
        j.setSalaryMax(salaryMax);
        j.setSkills(skills);
        j.setPostedBy(postedBy);
        jobRepository.save(j);
    }
}
