package com.jobportal.dto;

public class ProfileUpdateRequest {
    private String name;
    private String bio;
    private String skills;
    private String location;
    private String company;
    private String resumeUrl;

    public ProfileUpdateRequest() {}

    public String getName()      { return name; }
    public void setName(String name) { this.name = name; }

    public String getBio()       { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getSkills()    { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getLocation()  { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCompany()   { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
}
