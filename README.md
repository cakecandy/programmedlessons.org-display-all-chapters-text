# Display Multiple Chapters' Text in a Single Webpage

#### Context

This Fall 2022, I'm taking an Assembly class, and our quizzes are mostly based on the texts in http://programmedlessons.org/AssemblyTutorial/index.html.

During our lectures, I was copying and pasting texts into my own note document when I realized I should probably just write a script to do this.
Of course, you should read the texts. However, for obscure information in the chapters that frequently appear in our quizzes, being able to ctrl+f a keyword to find more information about it is very helpful.


I wrote this quick, rough script to combine all of the (selected) chapters into a single webpage for easy searching.

#### How to Use
1. Install https://nodejs.org/en/
2. Download all of the files into a folder
3. Edit the `1. Chapter Numbers.txt`: type the numbers of the chapters you want to display, separated by space
4. In Command Prompt, navigate to the folder you created using `cd {paste the folder filepath here}`
5. Type `npm install node` to install node packages into the folder
6. Type `node index.js` to run the script
7. The webpage will be hosted on http://localhost:8080/
