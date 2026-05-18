package com.jobportal.controller;

import com.jobportal.dto.JobRequest;
import com.jobportal.entity.Job;
import com.jobportal.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllOpenJobs());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Job>> getMyJobs(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(jobService.getMyJobs(user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Job> create(@RequestBody JobRequest request,
                                      @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(jobService.createJob(request, user.getUsername()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Job> updateStatus(@PathVariable Long id,
                                            @RequestParam String status,
                                            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(jobService.updateJobStatus(id, status, user.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetails user) {
        jobService.deleteJob(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
