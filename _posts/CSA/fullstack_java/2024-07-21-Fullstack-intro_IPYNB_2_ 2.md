---
layout: post
title: Fullstack Development (Student Thinking)
description: A reminder and guide to full stack development, aka learn how to do everyone job
type: coding 
courses: {'csa': {'week': 3}}
permalink: /fullstack/java/intro
toc: True
comments: True
author: Finn Carpenter
---

## Introduction

> What is Full Stack?

- A full stack feature in software development refers to a feature or functionality that spans both the **front end** (client side) and the **back end** (server side) of an application.
- This means that the feature includes everything from the **user interface** and user experience (what the user sees and interacts with) to the **server**, **database**, and **logic** that make the feature work behind the scenes.

> The components or stack of this feature are usually as follows

1. **Frontend**, the part that the user interacts with
2. **Backend**, the sever side of the feature, handling requests, interactions with the database
3. **Database**, Where the apps data is stored and managed
4. **API**, The Application Programming Interface allows the fronted to connect and communicate with backend

## Framework

When creating the backend and frontend of your project you should have a clear answer to these two questions

> What **data** will need to be stored for my feature to work, and what **endpoints** are needed for my feature?

| ID | Author | Title | Body | Timestamp | Tags |
| -- | ------ | ----- | ---- | --------- | ---- |
|    |        |       |      |           |      |

> What will the **wireframe** for my feature look like, and how will it be **auto-generated**?

<img src="{{site.baseurl}}/images/fullstack/quickSketch.png" width="400px" style="margin: auto">

- The questions above are what make your feature workable and unique.
- If you're able to answer these questions above you will have no problem in seeing the vision of your feature

## How to answer the questions with your idea

Start with an idea;  I am going to be creating a announcement API!

1. Question #1

    - For an announcement feature, I'm going to need an **ID** (standard in every database), **author**, **title**, **body**, **time**, and **tags** data
    - For the endpoints think about how this data need's to be accessed besides the usual CRUD (Create/Read/Update/Delete) methods, maybe a **fetch** by **author** or **tag**

2. Question #2

    - **Search** a a filter to the wireframes, perhaps look at how information is shared in an annoucements tool
    - **Data** presentations will be fetched for each announcement on top of each other with the most recent at the top

## Doubt your Doubts

> My doubting thoughts on this matter

- The problem with fullstack development is no doubt the barrier entry in terms of knowledge that is needed
- Knowing how to create API's with specific endpoints, or generating javascript wireframes, it seems like an impossible tasks
- I found that most slackers in groups came from a place of self dismissal "I can't do this", "Im never gonna understand this"

> My overcoming thoughts

- Use this simple outline to start a GitHub issue
- Start referencing the full-stack materials for Java/Spring with your idea in mind
- Learn the process Sprint: POJO, JPA, API
- Build Postman checks, build endpoint queries for methods: GET, POST, PUT, DELETE
- JavaScript frontend is basically the same as Python/Flask:  Desing Forms and format JSON response
