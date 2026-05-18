package com.jobportal.controller;

import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final EmailService emailService;

    public AdminController(UserRepository userRepository, JobRepository jobRepository,
                           ApplicationRepository applicationRepository,
                           EmailService emailService) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.emailService = emailService;
    }

    // Dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("openJobs", (long) jobRepository.findByStatus(Job.JobStatus.OPEN).size());
        stats.put("employers", userRepository.countByRole(User.Role.EMPLOYER));
        stats.put("jobseekers", userRepository.countByRole(User.Role.JOBSEEKER));
        return ResponseEntity.ok(stats);
    }

    // All users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // All jobs
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
    }

    // Delete job
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // All applications
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    // Update application status (with email trigger)
    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<Map<String, String>> updateApplicationStatus(@PathVariable Long id,
                                                               @RequestParam String status) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Application.AppStatus newStatus = Application.AppStatus.valueOf(status.toUpperCase());
        Application.AppStatus oldStatus = app.getStatus();
        app.setStatus(newStatus);
        applicationRepository.save(app);

        // Send email if status changed
        if (newStatus != oldStatus) {
            String email   = app.getApplicant().getEmail();
            String name    = app.getApplicant().getName();
            String title   = app.getJob().getTitle();
            String company = app.getJob().getCompany();

            switch (newStatus) {
                case SHORTLISTED -> emailService.sendSelectionEmail(email, name, title, company);
                case REJECTED    -> emailService.sendRejectionEmail(email, name, title, company);
                case REVIEWED    -> emailService.sendReviewEmail(email, name, title, company);
                default -> {}
            }
        }

        return ResponseEntity.ok(Map.of("id", String.valueOf(id), "status", status.toUpperCase()));
    }

    // Update job status
    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<Map<String, String>> updateJobStatus(@PathVariable Long id,
                                               @RequestParam String status) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(Job.JobStatus.valueOf(status.toUpperCase()));
        jobRepository.save(job);
        return ResponseEntity.ok(Map.of("id", String.valueOf(id), "status", status.toUpperCase()));
    }
}
