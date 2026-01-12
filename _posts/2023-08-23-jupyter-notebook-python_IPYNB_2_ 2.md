---
layout: post
title: Playing with Jupyter Notebooks and Python
description: GitHub pages was built with Python and Jupyter Notebooks in mind.  This post is to verify tools by using Python.
categories: ['DevOps', 'Python']
permalink: /jupyter/notebook/python
menu: nav/tools_setup.html
toc: True
comments: True
---

## Python and Jupyter Notebooks
Python is a highly versatile and widely-used programming language, renowned for its readability and broad library support. Jupyter Notebooks, on the other hand, is an interactive computing environment that enables users to create and share documents containing live code, equations, visualizations, and narrative text. Together, they form a powerful toolkit for data analysis, scientific research, and educational purposes.

We will play with Python and Jupyter Notebooks to get a feel for both.  This is a great interactive way to start development.

### Emoji Print
It is easy to add an emoji to a message in code.  However, using the emoji library or other libraries often requires you to install code on your machine.  Before using a library, that is not part of Python distribution, you must install with `pip`

```bash
# terminal command to install library
$ pip install emoji
Collecting emoji
  Downloading emoji-2.5.1.tar.gz (356 kB)
...
Successfully installed emoji-2.5.1
```


```python
#!pip install emoji
from emoji import emojize 
print(emojize(":thumbs_up: Python is awesome! :grinning_face:"))
```

### Extracting Data 
Web sites become a lot more interesting when you are working with data, not trying to create it.  Here is some code using a library called newspaper, this extracts a couple of writeups from the CNN Entertainment site.
- Learn more on [newspaper3k](https://newspaper.readthedocs.io/en/latest/)
- Learn about library for [wikipedia](https://pypi.org/project/wikipedia/)


```python
#!pip install newspaper3k
from newspaper import Article
from IPython.display import display, Markdown


urls = ["http://cnn.com/2023/03/29/entertainment/the-mandalorian-episode-5-recap/index.html", 
        "https://www.cnn.com/2023/06/09/entertainment/jurassic-park-anniversary/index.html"]

for url in urls:
    article = Article(url)
    article.download()
    article.parse()
    # Jupyter Notebook Display
    # print(article.title)
    display(Markdown(article.title)) # Jupyter display only
    display(Markdown(article.text)) # Jupyter display only
    print("\n")

```


```python
#!pip install wikipedia
import wikipedia 
from IPython.display import display, Markdown # add for Jupyter

terms = ["Python (programming language)", "JavaScript"]
for term in terms:
    # Search for a page 
    result = wikipedia.search(term)
    # Get the summary of the first result
    summary = wikipedia.summary(result[0])
    print(term) 
    # print(summary) # console display
    display(Markdown(summary)) # Jupyter display
```

### Inspecting a Function
The inspect module can give you the output of what's inside many Python functions/objects.  This can help you explore code behind what you are using.
- [Inspect](https://docs.python.org/3/library/inspect.html) documentation.


```python
import inspect 
from newspaper import Article

# inspect newspaper Article function
print(inspect.getsource(Article))
```

### Python Data Types
Dynamic typing means that the type of the variable is determined only during runtime.  Strong typing means that variables do have a type and that the type matters when performing operations.  In the illustration below there are two functions
- mean... shows types required prior to calling average function
- average, average2... calculates the average of a list of numbers


Python has types.  In the language you can use type hints, but most coders do not use them.  In other languages like Java and 'C' you must specify types.
- [Python Types Cheat Sheet](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)


```python
import sys
from typing import Union

# Define types for mean function, trying to analyze input possibilities
Number = Union[int, float]  # Number can be either int or float type
Numbers = list[Number] # Numbers is a list of Number types
Scores = Union[Number, Numbers] # Scores can be single or multiple 

def mean(scores: Scores, method: int = 1) -> float:
    """
    Calculate the mean of a list of scores.
    
    Average and Average2 are hidden functions performing mean algorithm

    If a single score is provided in scores, it is returned as the mean.
    If a list of scores is provided, the average is calculated and returned.
    """
    
    def average(scores): 
        """Calculate the average of a list of scores using a Python for loop with rounding."""
        sum = 0
        len = 0
        for score in scores:
            if isinstance(score, Number):
                sum += score
                len += 1
            else:
                print("Bad data: " + str(score) + " in " + str(scores))
                sys.exit()
        return sum / len
    
    def average2(scores):
        """Calculate the average of a list of scores using the built-in sum() function with rounding."""
        return sum(scores) / len(scores)

    # test to see if scores is  a list of numbers
    if isinstance(scores, list):
        if method == 1:  
            # long method
            result = average(scores)
        else:
            # built in method
            result = average2(scores)
        return round(result + 0.005, 2)
    
    return scores # case where scores is a single valu

# try with one number
singleScore = 100
print("Print test data: " + str(singleScore))  # concat data for single line
print("Mean of single number: " + str(mean(singleScore)))

print()

# define a list of numbers
testScores = [90.5, 100, 85.4, 88]
print("Print test data: " + str(testScores))
print("Average score, loop method: " + str(mean(testScores)))
print("Average score, function method: " +  str(mean(testScores, 2)))

print()

badData = [100, "NaN", 90]
print("Print test data: " + str(badData))
print("Mean with bad data: " + str(mean(badData)))


```

## Hacks
Here is a summary of some of the things learned above.
- Formatting messages with emoji
- Exploring data with newspaper and wikipedia libraries
- Finding code on how the library we used was made
- Learning about data types while writing an algorithm for mean

> Part of Project Based learning is the idea of combining concepts to form something more interesting.  Make a plan, form some ideas, brainstorm ideas with pair.  Produce something that is interesting and challenging.  Samples...
- Could I get input from user to look up wikipedia information? [Python input](https://www.w3schools.com/python/ref_func_input.asp), [Article on Input](https://vegibit.com/python-input-function/)
- What could I learn in Python about Stats to get Machine Learning Read? [Stats Calculations](https://docs.python.org/3/library/statistics.html)
- Could I add emoji to an extracted article?  [String Find](https://www.w3schools.com/python/ref_string_find.asp), [String Methods](https://www.w3schools.com/python/python_strings_methods.asp)




