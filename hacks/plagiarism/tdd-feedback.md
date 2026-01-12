---
layout: post
toc: True
title: Plagiarism Quest TDD Feedback Analysis
description: In the Plagiarism Prevention Quest we will use Test-Driven Development (TDD) to drive future sprints. 
author: John Mortensen
permalink: /plagiarism/tdd-feedback
breadcrumb: True
---

## Overview

**Data Source:** Google Form responses from ~100 students across 4 classes  
**Testing Method:** TDD approach with rapid feedback collection  
**Analysis Date:** October 15, 2025  

---

## Part 1: TDD Move Forward

The positive-to-negative feedback ratio shows the Plagiarism Prototype Phase is ready to move to Development. All issues will be addressed as priorities in the project. The next step is to introduce backend infrastructure with user and instructor roles.

### Critical Infrastructure

**Priority:** Fix blockers preventing quest completion

#### Video System Issues

- **Evidence:** 6+ reports of broken videos
- **Instructor Note:** "Fix broken videos (6+ reports), as I did not create those."
- **Action:** Audit and replace all video content, add error handling

#### Authentication Barriers

- **Evidence:** Students unable to access without login
- **Instructor Note:** "Resolve authentication barriers with users, perhaps by using in place authentication to avoid confusion."
- **Action:** Implement guest access or simplified authentication

#### Performance Optimization

- **Evidence:** AI tools slow to load/failing
- **Instructor Note:** "Optimize tool loading performance, this may be AI time"
- **Action:** Improve AI response times, improve loading/action indicators. Review load times on backend services to support 50 simultaneous users in lecture scenario.

### Navigation & Flow

**Priority:** Fix user experience friction points

#### Navigation Flow Redesign

- **Evidence:** 8+ requests for "Next" buttons
- **Instructor Note:** "Add 'Next' buttons (8+ requests), great suggestion"
- **Action:** Implement linear progression with next/previous navigation

#### Mobile Experience Overhaul

- **Evidence:** 7+ mobile usability issues
- **Instructor Note:** "Overhaul mobile experience (7+ issues). The test was not specific, but I have taken a look at it."
- **Action:** Responsive design improvements, mobile-specific testing

#### Progress Tracking

- **Evidence:** Students want clearer completion indicators
- **Instructor Note:** "Implement progress tracking, I think this is on page not on modules"
- **Action:** Add visual progress indicators and completion checkmarks

### Visual Design & Engagement

**Priority:** Enhance appeal and usability

#### Visual Appeal Modernization

- **Evidence:** 10+ design complaints
- **Instructor Note:** "Modernize visual appeal (10+ design complaints)"
- **Action:** Re-evaluate design for teenage audience, add more color and visual elements. This is interesting as I am following many design principles that were approved through the Master's program. This may be a theme preference or GitHub Pages issue - for instance, some do not like dark-mode.  

#### Instruction Clarity Enhancement

- **Evidence:** 6+ reports of unclear instructions
- **Instructor Note:** "Enhance instruction clarity (6+ reports). Add more on page design on step-by-step workflows."
- **Action:** C3 needs review. Designers should review page-specific comments for more details.

#### Age-Appropriate Design

- **Evidence:** "Make it appealing for kids our age"
- **Instructor Note:** "This would be something I would really expect from you all on your projects, particularly after seeing the plainness of many lessons. This could be a preference versus design issue."
- **Action:** Incorporate approved and well-defined design preferences, modern UI elements

### Advanced Features (Week 4)

**Priority:** Polish and enhance learning experience

#### Learning Connection Bridges

- **Evidence:** Modules feel disconnected
- **Instructor Note:** "Bridge learning connections between modules. I agree, the ideas are in my head, but not fully expressed. The least favorite of mine is C3."
- **Action:** Add narrative threads, explicit connections between C1-C4, redesign C3

#### Accessibility & Branding

- **Evidence:** Consistency and accessibility issues
- **Instructor Note:** "Polish accessibility and branding. Since this site is a content site, it would be interesting to hear from those who have ideas."
- **Action:** Not clear - matching OCS branding may remove buttons that move.

#### Synthesis & Reflection Elements

- **Evidence:** Missing culminating experience
- **Instructor Note:** "Add synthesis/reflection elements. This might be related to making things more age-related. I did notice that students tend to comment on lessons, but not on their homework grades."
- **Action:** Not clear, but reflection prompts are an option. Social media experience for peer sharing opportunities on page is an idea I would like to explore.

---

## Part 2: Student Final Project Learning Goals

### Demonstrated Mastery (Ready to Apply)

Students successfully absorbed sophisticated instructional design principles:

#### Quest Architecture Understanding

- **Progressive unlock systems** - Students understand scaffolded learning
- **Modular learning design** - (activation → demonstration → practice → application → assessment → integration)
- **Achievement/leveling systems** - Gamification for motivation
- **Multi-media integration** - Text, video, audio, interactive elements

#### Technical Implementation Skills

- **AI tool integration** - Using AI for assessment and content creation
- **Assessment system design** - Automated feedback and instructor review
- **Cross-device compatibility** - Mobile-responsive design principles
- **User experience principles** - Navigation, visual design, accessibility

#### Learning Design Principles

- **Clear objective setting** - Students understand learning goal communication
- **Scaffolded progression** - Building complexity gradually
- **Engagement strategies** - Motivation through achievement and interaction
- **Feedback mechanisms** - Immediate and meaningful response systems

### Project Topic Guidance

#### Confirmed Topics (2 classes each)

1. **ML-Learning Modules** - Machine learning concepts and applications
2. **AI Impacts Modules** - "AI Impacts Modules, ie, Digital Citizenship as society"

#### Suggested Topics for Undecided Classes

- **Creative Media Quests** - "UI Designs that High Schoolers like"
- **Cyber Society** - Privacy, security, online behavior, digital citizenship, combating bias, AI usage

---

## Key Success Indicators

### Educational Success

**Dual Learning Achievement:** Students learned both plagiarism prevention content AND instructional design principles  
**Transfer Evidence:** Students can articulate specific design elements to implement in their own quests  
**Engagement:** Students demonstrated genuine interest and provided detailed, constructive feedback  

### TDD Process Success

**Clear Priorities:** Feedback created actionable improvement roadmap  
**User-Centered:** Students identified real usability problems  
**Learning Focus:** Technical issues didn't prevent educational objectives  

### Future Implementation

**Student Readiness:** Classes prepared to build sophisticated e-learning experiences  
**Template Success:** Quest structure proven effective for various topics  
**Scalable Process:** TDD method works for multiple classes and topics  

---

## Original Survey Questions

### Question 1: Improvement Priority

**"If you were to improve one part of this system, what would it be and why?"**

**Sample Responses:**

- "My team suggested editing the layout of the page to be extra visually appealing. Such as adding visuals like diagrams, editing font colors and sizes, etc. Just appealing for kids our age in general."
- "We would improve the UI because we found it difficult to keep going back to the main page to proceed to the next stage."
- "Watch Videos Sometimes dont load"
- "Maybe include like check marks when each section of the module is finished, so when we move on, we know that the next module is unlocked and we can progress."
- "Have a next button after each section so we don't have to go back to the main page and switch."

### Question 2: Learning Transfer

**"What did you learn from observing this system that could help you design your own quest?"**

**Sample Responses:**

- "I learned the progression system and how it locks features and we can implement that into our own design."
- "We learned to make our quest progressive and include elements of 'leveling up' to make it a more interactive and genuine experience."
- "I learned to break up the quest into different sections ranging from activation, demonstration, practice, application, assessment, and integration."
- "The integration of AI was something that we could integrate into our own design."
- "The importance of making a visually appealing page and ui, as through the interactive elements and clear ui, understanding the provided information was very easy."

### Question 3: Difficulty Assessment

**"Did you find anything hard? If yes, what?"**

**Sample Responses:**

- "Our team didn't find any major issues, but one minor problem that occurred was that each feature, such as the 'Analyzing text' feature took a while to load would end up not working."
- "It was a little difficult to understand what each of the settings can be used for, so at the top there could be more explanation on the purpose of the different tools and their applications"
- "For the phone, some instructions are hard to read because they did not fit onto the screen."
- "The workload and the lack of actual sources to use makes it a bit difficult at first."
- "No, everything was clear and easy to follow."