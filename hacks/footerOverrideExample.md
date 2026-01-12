---
title: Example Page
permalink: /exampleFooter
---

<script src="{{site.baseurl}}/assets/js/FooterOverride.js"></script>
<script>
    // Change default styles for all buttons
    setDefaultStylesFooter("button", "background: blue; color: white; padding: 10px 20px;");
    // Style the footer itself
    setFooterStyle("background: #f5f5f5; padding: 20px; text-align: center;");
    // Add spacing
    addSpacingFooter("30px");
    // Add a list
    addListFooter(["Item 1", "Item 2", "Item 3"], false, "margin: 10px;");
    // Add an input field
    const myInput = addInputFooter("Enter your name", "text", "nameInput");
    // Add a textarea
    const myTextarea = addTextareaFooter("Enter your message", 5);
    // Add icons/emojis
    addIconFooter("⭐", "font-size: 30px; color: gold;");
    addIconFooter("❤️");
    // Create a horizontal row of buttons
    const btn1 = document.createElement("button");
    btn1.textContent = "Option 1";
    btn1.onclick = () => alert("Option 1");
    const btn2 = document.createElement("button");
    btn2.textContent = "Option 2";
    btn2.onclick = () => alert("Option 2");
    addRowFooter([btn1, btn2], "justify-content: center;");
    // Submit button that reads input
    addButtonFooter("Submit", () => {
        const name = document.getElementById("nameInput").value;
        alert("Hello " + name + "!");
    });
        // Text
    addTextFooter("Welcome to my page!");
    // Button
    addButtonFooter("Click Me", () => alert("Hello!"));
    // Link
    addLinkFooter("Visit Google", "https://google.com", "", true);
    // Divider
    addDividerFooter();
    // Image
    addImageFooter("{{site.baseurl}}/assets/images/logo.png", "Logo", "width: 100px;");
    // Container with HTML
    addContainerFooter("<strong>Bold text</strong> and <em>italic</em>", "text-align: center;");
    // Custom element
    const myDiv = document.createElement("div");
    myDiv.textContent = "Custom element!";
    addElementFooter(myDiv);
    // Clear everything
    // clearFooter();
    addButtonFooter("Clear Footer", () => clearFooter());
</script>