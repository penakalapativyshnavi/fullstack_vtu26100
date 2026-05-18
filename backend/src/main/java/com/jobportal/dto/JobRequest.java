package com.jobportal.dto;

public class JobRequest {

    private String title;
    private String description;
    private String company;
    private String location;
    private String type;
    private Double salaryMin;
    private Double salaryMax;
    private String skills;

    public JobRequest() {}

    public JobRequest(String title, String description, String company, String location,
                      String type, Double salaryMin, Double salaryMax, String skills) {
        this.title = title;
        this.description = description;
        this.company = company;
        this.location = location;
        this.type = type;
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        this.skills = skills;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getSalaryMin() { return salaryMin; }
    public void setSalaryMin(Double salaryMin) { this.salaryMin = salaryMin; }

    public Double getSalaryMax() { return salaryMax; }
    public void setSalaryMax(Double salaryMax) { this.salaryMax = salaryMax; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
}
