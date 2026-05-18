package com.jobportal.service;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ApplicationService(ApplicationRepository applicationRepository,
                               JobRepository jobRepository,
                               UserRepository userRepository,
                               EmailService emailService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public Application apply(Long jobId, String coverLetter, String resumeUrl, String email) {
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (applicationRepository.existsByJobAndApplicant(job, applicant)) {
            throw new RuntimeException("Already applied to this job");
        }
        Application app = new Application();
        app.setJob(job);
        app.setApplicant(applicant);
        app.setCoverLetter(coverLetter);
        app.setResumeUrl(resumeUrl);
        return applicationRepository.save(app);
    }

    public List<Application> getMyApplications(String email) {
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByApplicant(applicant);
    }

    public List<Application> getApplicationsForJob(Long jobId, String email) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        return applicationRepository.findByJob(job);
    }

    public Application updateStatus(Long appId, String status, String email) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!app.getJob().getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        Application.AppStatus newStatus = Application.AppStatus.valueOf(status.toUpperCase());
        Application.AppStatus oldStatus = app.getStatus();
        app.setStatus(newStatus);
        Application saved = applicationRepository.save(app);

        // ── Trigger email only when status actually changes ──
        if (newStatus != oldStatus) {
            String applicantEmail = app.getApplicant().getEmail();
            String applicantName  = app.getApplicant().getName();
            String jobTitle       = app.getJob().getTitle();
            String companyName    = app.getJob().getCompany();

            switch (newStatus) {
                case SHORTLISTED ->
                    emailService.sendSelectionEmail(applicantEmail, applicantName, jobTitle, companyName);
                case REJECTED ->
                    emailService.sendRejectionEmail(applicantEmail, applicantName, jobTitle, companyName);
                case REVIEWED ->
                    emailService.sendReviewEmail(applicantEmail, applicantName, jobTitle, companyName);
                default -> { /* PENDING — no email */ }
            }
        }

        return saved;
    }
}
