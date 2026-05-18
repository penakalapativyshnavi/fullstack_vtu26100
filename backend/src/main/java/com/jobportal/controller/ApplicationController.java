package com.jobportal.controller;

import com.jobportal.entity.Application;
import com.jobportal.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<Application> apply(@PathVariable Long jobId,
                                             @RequestBody Map<String, String> body,
                                             @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(applicationService.apply(
                jobId,
                body.get("coverLetter"),
                body.get("resumeUrl"),
                user.getUsername()
        ));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Application>> myApplications(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(applicationService.getMyApplications(user.getUsername()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> jobApplications(@PathVariable Long jobId,
                                                              @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, user.getUsername()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id,
                                                    @RequestParam String status,
                                                    @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status, user.getUsername()));
    }
}
