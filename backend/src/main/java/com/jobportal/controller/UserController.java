package com.jobportal.controller;

import com.jobportal.dto.ProfileUpdateRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public UserController(UserRepository userRepository,
                          JobRepository jobRepository,
                          ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    // Get current user profile
    @GetMapping("/me")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // Update profile
    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                              @RequestBody ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (request.getName()      != null) user.setName(request.getName());
        if (request.getBio()       != null) user.setBio(request.getBio());
        if (request.getSkills()    != null) user.setSkills(request.getSkills());
        if (request.getLocation()  != null) user.setLocation(request.getLocation());
        if (request.getCompany()   != null) user.setCompany(request.getCompany());
        if (request.getResumeUrl() != null) user.setResumeUrl(request.getResumeUrl());
        return ResponseEntity.ok(userRepository.save(user));
    }

    // Recruiter analytics
    @GetMapping("/recruiter/stats")
    public ResponseEntity<Map<String, Object>> getRecruiterStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        User employer = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Job> myJobs = jobRepository.findByPostedBy(employer);
        long totalJobs   = myJobs.size();
        long openJobs    = myJobs.stream().filter(j -> j.getStatus() == Job.JobStatus.OPEN).count();
        long closedJobs  = totalJobs - openJobs;

        long totalApps   = 0, pending = 0, reviewed = 0, shortlisted = 0, rejected = 0;
        for (Job job : myJobs) {
            List<Application> apps = applicationRepository.findByJob(job);
            totalApps   += apps.size();
            pending     += apps.stream().filter(a -> a.getStatus() == Application.AppStatus.PENDING).count();
            reviewed    += apps.stream().filter(a -> a.getStatus() == Application.AppStatus.REVIEWED).count();
            shortlisted += apps.stream().filter(a -> a.getStatus() == Application.AppStatus.SHORTLISTED).count();
            rejected    += apps.stream().filter(a -> a.getStatus() == Application.AppStatus.REJECTED).count();
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs",    totalJobs);
        stats.put("openJobs",     openJobs);
        stats.put("closedJobs",   closedJobs);
        stats.put("totalApps",    totalApps);
        stats.put("pending",      pending);
        stats.put("reviewed",     reviewed);
        stats.put("shortlisted",  shortlisted);
        stats.put("rejected",     rejected);
        return ResponseEntity.ok(stats);
    }
}
