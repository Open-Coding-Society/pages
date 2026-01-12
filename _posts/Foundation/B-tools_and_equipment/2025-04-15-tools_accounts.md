---
toc: True
layout: post
data: tools
title: Account Creation
description: Learn how to create and manage course-required accounts, including a Portfolio Website, GitHub, Slack, and LinkedIn, while protecting your Personal Identifiable Information (PII).
categories: ['DevOps']
permalink: /tools/old/accounts
breadcrumb: True
author: John Mortensen
---

## Personal Identifiable Information (PII)

When creating accounts for this course, it's important to understand what Personal Identifiable Information (PII) is and how to protect it. PII refers to any information that can be used to identify you.

In this course, there may be instances where you are asked to share PII. We encourage you to share it thoughtfully and in ways that align with your personal and professional goals.

<div class="frq" id="frq1">
  <p><b>FRQ 1:</b> Explain why sharing PII on platforms like LinkedIn can be beneficial, but also risky. Provide at least one example for each side.</p>
  <textarea id="frq1-answer" rows="4" cols="80"></textarea>
</div>

### Why PII Matters

Websites like `LinkedIn` are platforms where we showcase our accomplishments and intentionally share certain aspects of our PII to build a professional presence.

As individuals and as a society, we often share PII on platforms like TikTok, Reddit, X, Instagram, or Facebook. This sharing can provide a sense of satisfaction, sometimes referred to as the "dopamine effect." While we may feel proud of the accomplishments we share, there are instances where we or others might regret sharing certain information, such as lighthearted accounts of social activities.

It is important to recognize that all the accounts mentioned above contribute to your PII and become part of your digital footprint.

<div class="frq" id="frq2">
  <p><b>FRQ 2:</b> What is the “dopamine effect” of sharing online, and how might it impact the decisions you make about your PII?</p>
  <textarea id="frq2-answer" rows="4" cols="80"></textarea>
</div>

### Types of PII

* **Public Information**: These are details that are generally known and shared:
  * Name
  * Email (consider using a secondary email for public use)
  * Picture
  * High School and College attended
  * State and City of residence
  * Properties you own

* **Sensitive Information**: Be more cautious with these details:
  * Full birth date
  * Place of Birth
  * Street Address
  * Phone Number
  * Maiden names of Mother or Grandmother
  * Driver's License Number
  * Home router location
  * Previous residences
  * Credit Reports

* **Highly Confidential Information**: Keep these absolutely secret:
  * Internet Access Credentials (e.g., Wi-Fi passwords)
  * Google key store (used for app signing or sensitive data storage)
  * Two-Factor Authentication sources (e.g., backup codes)
  * Social Security Number

<div class="frq" id="frq3">
  <p><b>FRQ 3:</b> Categorize the following into Public, Sensitive, or Highly Confidential:  
  (a) Your GitHub username  
  (b) Your Wi-Fi password  
  (c) Your home address</p>
  <textarea id="frq3-answer" rows="4" cols="80"></textarea>
</div>

### Techniques to Increase Security

* **Multi-Factor Authentication (MFA)**
* **Biometrics**
* **Asymmetric Cryptography**
* **Strong Passwords**
* **Regular Software Updates**
* **Secure Home Router**
* **Secure Wi-Fi**
* **Data Encryption**

<div class="frq" id="frq4">
  <p><b>FRQ 4:</b> Which of the listed techniques would you prioritize first for securing your personal accounts? Why?</p>
  <textarea id="frq4-answer" rows="4" cols="80"></textarea>
</div>

### Be Aware of Internet Threats

* **Viruses and Malware**
* **Phishing**
* **Social Engineering**
* **Post-Incident Actions**

<div class="frq" id="frq5">
  <p><b>FRQ 5:</b> Describe a scenario where social engineering could trick someone into giving up PII. How would you defend against it?</p>
  <textarea id="frq5-answer" rows="4" cols="80"></textarea>
</div>

---

## Open Coding Society Accounts

As part of this course, you will need to create several accounts...

<div class="frq" id="frq6">
  <p><b>FRQ 6:</b> Why do we recommend not using your school email when signing up for GitHub or Slack?</p>
  <textarea id="frq6-answer" rows="4" cols="80"></textarea>
</div>

---

## PII Strategy on Account Creation

<div class="frq" id="frq7">
  <p><b>FRQ 7:</b> Describe your personal strategy for separating email accounts. How does this help manage both PII and workflow?</p>
  <textarea id="frq7-answer" rows="4" cols="80"></textarea>
</div>

---

## Hacks

Create your course accounts...

<div class="frq" id="frq8">
  <p><b>FRQ 8:</b> After reading the Hacks section, which account creation step do you think is most critical for your professional growth, and why?</p>
  <textarea id="frq8-answer" rows="4" cols="80"></textarea>
</div>

---

<script>
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".frq").forEach(function(block) {
    const textarea = block.querySelector("textarea");
    const key = block.id + "-answer";
    // Load saved answer
    textarea.value = localStorage.getItem(key) || "";
    // Save on input
    textarea.addEventListener("input", function() {
      localStorage.setItem(key, textarea.value);
    });
  });
});
</script>
