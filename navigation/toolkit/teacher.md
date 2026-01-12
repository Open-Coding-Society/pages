---
layout: post
title: Teacher Toolkit
description:
permalink: /teacher
menu: nav/homejava.html
show_reading_time: false
---

<div class="container">
    <div class="student-management glowOnHover"
        onclick="location.href='{{site.baseurl}}/teacher-toolkit/period1';" style="cursor: pointer;">
        <div class="student-management-image">
            <img src="{{site.baseurl}}/images/toolkit-nav-buttons/studentmanagement.png" alt="student-management" />
        </div>
        <div class="student-management-details">
            <h3>Student Management</h3>
            <p>This tool lets you:</p>
            <ul>
                <li>Track students at each table per period</li>
                <li>See what each student is doing and monitor assigned tasks</li>
                <li>Track the progress of each student</li>
                <li>View students' GitHub activity</li>
            </ul>
        </div>
    </div>
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto auto auto;
        gap: 30px 0px;
        grid-auto-flow: row;
        grid-template-areas:
            "student-management";
    }

    .student-management {
        display: grid;
        grid-template-columns: 150px 1fr;
        grid-template-rows: auto;
        gap: 0px 0px;
        grid-auto-flow: row;
        grid-template-areas:
            "student-management-image student-management-details";
        grid-area: student-management;
    }

    .student-management-image {
        grid-area: student-management-image;
        display: flex;
        align-items: center;
        background-color: white;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;

    }

    .student-management-details {
        padding: 10px;
        grid-area: student-management-details;
    }

    .glowOnHover {
        border: none;
        outline: none;
        color: #fff;
        background: #1e1e1e;
        cursor: pointer;
        position: relative;
        z-index: 0;
        border-radius: 10px;
    }

    .glowOnHover:before {
        content: '';
        background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
        position: absolute;
        top: -2px;
        left: -2px;
        background-size: 400%;
        z-index: -1;
        filter: blur(5px);
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        animation: glowing 20s linear infinite;
        opacity: 0;
        transition: opacity .3s ease-in-out;
        border-radius: 10px;
    }

    .glowOnHover:hover:before {
        opacity: 1;
    }

    .glowOnHover:after {
        z-index: -1;
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: #1e1e1e;
        left: 0;
        top: 0;
        border-radius: 10px;
    }

    @keyframes glowing {
        0% {
            background-position: 0 0;
        }

        50% {
            background-position: 400% 0;
        }

        100% {
            background-position: 0 0;
        }
    }

    img {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    h3 {
        margin-top: 0px !important;
        padding-top: 0px !important;
    }
</style>
