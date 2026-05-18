package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public Job createJob(JobRequest request, String email) {
        User employer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setType(Job.JobType.valueOf(request.getType().toUpperCase()));
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setSkills(request.getSkills());
        job.setPostedBy(employer);
        return jobRepository.save(job);
    }

    public List<Job> getAllOpenJobs() {
        return jobRepository.findByStatus(Job.JobStatus.OPEN);
    }

    public List<Job> searchJobs(String keyword) {
        return jobRepository.searchJobs(keyword);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public List<Job> getMyJobs(String email) {
        User employer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return jobRepository.findByPostedBy(employer);
    }

    public Job updateJobStatus(Long id, String status, String email) {
        Job job = getJobById(id);
        if (!job.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        job.setStatus(Job.JobStatus.valueOf(status.toUpperCase()));
        return jobRepository.save(job);
    }

    public void deleteJob(Long id, String email) {
        Job job = getJobById(id);
        if (!job.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        jobRepository.delete(job);
    }
}
