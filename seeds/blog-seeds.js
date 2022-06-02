/*
 * Tech Blog
 * seeds/blog-seeds.js
 * This script contains the seeds for the Blog entity
 * Copyright 2022 Leo Wong
 */

const { Blog } = require('../models');

const blogData = [
  {
    title: 'Project 2, what to do?',
    date: '2022-05-26T12:00:00.000Z',
    user_id: 1,
    category_id: 3,
    summary: 'Tips and tricks to ace the project',
    text: `A vertical approach means that you would start with Model, test it, then move on to View, test it, and finally move on to Controller. A horizontal approach means you would make something simple across Model, View and Controller, test it, and then work on another thing. It really depends on how your group plans it, although both may work to your advantage. It's good to find a way to divide the work in order to parallelize your team's time, knowledge and energy. Don't forget to nominate a leader, and it's good to have test branches or test repos to see if a new technology will work. As Albert Einstein said, 'We cannot solve problems with the kind of thinking we employed when we came up with them.'`,
  },
  {
    title: 'Tech Blog, stuck in a bog?',
    date: '2022-05-19T12:00:00.000Z',
    user_id: 2,
    category_id: 2,
    summary: '7 steps to creating the best tech blog in your class',
    text: "This is probably the hardest assignment in the course so far. Plan your time wisely and start by studying the solution to the Week 14 Mini Project, as it is a working model. Understand what you can from it, and adapt it to your needs. It's not a bad idea to start with the Model, then moving on to some basic Views, and then working on the Controller. It's a good idea to do as much as you can on this assignment before Project 2 starts! Don't forget to include a good quality README, and space your code out with lots of comments. As Mahatma Gandhi said, 'Learn as if you will live forever, live like you will die tomorrow.'",
  },
  {
    title: 'E-commerce Back End, know your res.send!',
    date: '2022-05-12T12:00:00.000Z',
    user_id: 3,
    category_id: 2,
    summary:
      "You'll see why ORMs are so useful, and why last week was so hard!",
    text: "Showcase your ability to connect your DB, build out your schema and DB infrastructure in a comprehensive walkthrough video. Show users how to connect to their DB, run the schema and seed the database. Then, test the CRUD operations in your database and show the completion of the operation by running another GET route. Try to commit and push your work after each piece of code is written, edited or deleted. If you can, organize your files for sustainability and readability. Don't forget to include a great README! As Winston S. Churchill said, 'Success is not final; failure is not fatal: It is the courage to continue that counts.' Winston S. Churchill",
  },
  {
    title: "Employee Management System, it's as big as it sounds!",
    date: '2022-05-05T12:00:00.000Z',
    user_id: 4,
    category_id: 2,
    summary:
      'We break down the steps you need to knock this one out of the park!',
    text: "You need to firstly meet all technical criteria for this assignment. The video should be correctly linked in the README and demonstrate a functional menu. The video should go through all of the technical acceptance criteria and any bonus actions you managed to do. Your management system table schema should follow the one in the homework instructions. Finally, your repository should have a unique name and an excellent folder structure. As Herman Melville said, 'It is better to fail in originality than to succeed in imitation.'",
  },
  {
    title: 'Note Taker, game changer!',
    date: '2022-04-28T12:00:00.000Z',
    user_id: 5,
    category_id: 2,
    summary: 'Officially full stack! Welcome to the world of servers.',
    text: "Note Taker is really all about showcasing your knowledge of the fundamentals for developing CRUD-worthy APIs. Users should be able to visit your live app, create and save persistent notes, then review any previously created note. Notes should be able to be deleted as well. Despite the number of files, try to have a clean folder structure at the root of your repo. It goes without saying that a good quality README is vital. As Colin R. David said, 'The road to success and the road to failure are almost exactly the same.'",
  },
  {
    title: 'Team Profile Generator, do it with Class!',
    date: '2022-04-19T12:00:00.000Z',
    user_id: 6,
    category_id: 2,
    summary:
      "OOPs! Did someone say Class? Here's how to constructor() your way to an A+",
    text: "The Generator should meet all of the requirements, be visually appealing, and work as intended. Be wise with your placement of comments — be conservative, but concise and descriptive. Keep a steady commit history and make little changes as you go. If your code breaks somewhere, you have a history of working commits that you can revert back to. As Henry David Thoreau said, 'Success usually comes to those who are too busy looking for it.'",
  },
  {
    title: "Good README Generator, there's Node going back now!",
    date: '2022-04-11T12:00:00.000Z',
    user_id: 7,
    category_id: 2,
    summary: "Everything you need to Node about... okay, okay, I'll stop now.",
    text: "You need to demonstrate your ability to build a command line interface program that inquires and compiles the information into a comprehensive Readme! Integrate all the necessary modules to build it and try to meet the challenge requirements without any errors in the terminal when your CLI is initialized and tested! Don't forget to include your own README. As Dale Carnegie said, 'Develop success from failures. Discouragement and failure are two of the surest stepping stones to success.'",
  },
  {
    title: 'Updated Portfolio, come again?',
    date: '2022-04-04T12:00:00.000Z',
    user_id: 8,
    category_id: 1,
    summary:
      "Cross the T's and Dot the I's: here's what to cross and what to dot.",
    text: "If you have a polished user interface, an intuitive user experience, responsive web design, then you'll be sure to impress the graders. This one will take lots of hours but they will pay off! As Mr Rogers said, 'There are three ways to ultimate success: The first way is to be kind. The second way is to be kind. The third way is to be kind.'",
  },
  {
    title: 'Project 1, easier said than done!',
    date: '2022-03-28T12:00:00.000Z',
    user_id: 9,
    category_id: 3,
    summary:
      "And you thought Weather Dashboard was hard! Here's how to make Project 1 work.",
    text: "Make sure the image files are under a central images folder. Make it clear that recent searches is a dropdown by using an arrow icon. Try to nicely comment and separate your code. When your API returns no results, you should give some feedback to the user. If you are using a modal, make sure the modal contents are sized correctly inside it. With your CSS variables, make sure you follow the kebab-case naming convention and do not use snake_case or camleCase. Finally, make sure everyone contributes at least one important thing to the project in order to get the 'Even Contribution' mark. As Calvin Coolidge said, 'The slogan 'Press On' has solved and always will solve the problems of the human race.'",
  },
  {
    title: 'Weather Dashboard, .then what?',
    date: '2022-03-21T12:00:00.000Z',
    user_id: 10,
    category_id: 1,
    summary: 'Everything you need to know about fetch, .then and catch',
    text: "Your application should work well. The styling that you do in this application should be unlike any Weather Dashboard your class has ever seen! Try to do a good job on your local storage by having it in a dropdown as the list could get pretty long. This is one of those projects you should put on display. Also, try and do a good job on your README — make it look really clean. As John Wooden said, 'Success is peace of mind, which is a direct result of self-satisfaction in knowing you made the effort to become the best of which you are capable.' ",
  },
  {
    title: 'Day planner, delegate, delegate, delegate',
    date: '2022-03-14T12:00:00.000Z',
    user_id: 11,
    category_id: 1,
    summary: 'Let the third parties do the work!',
    text: "Your app should properly display the current date and time, and color-code the input fields. It should save values to local storage, and load and display them when the page is refreshed. Your repo should also be well maintained and documented. As Estée Lauder said, 'I never dreamed about success. I worked for it.'",
  },
  {
    title: "Code Quiz, wait, what's an object?",
    date: '2022-03-07T12:00:00.000Z',
    user_id: 12,
    category_id: 1,
    summary: "Know your objects from your arrays, and you'll be fine!",
    text: "When viewing the deployed application and clicking the start button, the user should see a timer counting down and the first question. When answered incorrectly, time should be deducted. After all the questions are answered, the timer should stop, the quiz should end, and the user should be able to save their initials and high score into local storage. The quiz should look fantastic as well as function flawlessly! The quiz should be mobile-responsive which is absolutely amazing. As W. P. Kinsella said, 'Success is getting what you want, happiness is wanting what you get.'",
  },
  {
    title: 'Password Generator, Math.what?',
    date: '2022-02-28T12:00:00.000Z',
    user_id: 13,
    category_id: 1,
    summary: "Generate? Math? Random? Here's how you do it.",
    text: "There's no need to be overwhelmed! The application should be properly deployed and upon clicking Generate Password the user should be prompted with several choices on the length and type of characters the user would like in their password. The addition of the default choices and check marks once a selection is made would be a very nice touch indeed. Make your repo and README look great. The repo should have several well commented commits and the code should have consistent indentation. The README should have badges to show what tech was used, how the application works and screenshots. As Alexander Graham Bell said, 'Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.'",
  },
  {
    title: "Professional Portfolio, easy! Wait… what's a flex box?",
    date: '2022-02-21T12:00:00.000Z',
    user_id: 14,
    category_id: 1,
    summary: "It's all about putting things in boxes.",
    text: "Good to see you make it to week 2! Your page should contain all of the required sections, nav links, projects, and your name and photo. Its nav elements should link to all of their corresponding page sections, its first project image should be larger than the others, and clicking a project should link to its deployed site. The page design should be properly mobile responsive. The code repo should be well maintained and documented, with a strong README, good code comments, and plenty of quality commits. Keep up the fantastic effort! As Jim Rohn said, 'Either you run the day or the day runs you.' Jim Rohn",
  },
  {
    title: "Code refactor, how do you even say 'Horiseon'?",
    date: '2022-02-14T12:00:00.000Z',
    user_id: 15,
    category_id: 1,
    summary:
      "Messy code is still good code, right? Here's why refactoring is super important.",
    text: "Congratulations on joining the course! You have already demonstrated initiative by wanting to build web apps with HTML and CSS! With this assignment, ensure your links are all functional and correctly navigate users to the appropriate destination. Ensure the organization and consolidation of your CSS selector properties, and properly comment out your CSS code, because this will be huge for you when you go back to your work and try to understand the story and approach behind it! You'll really impress the grader if you do very specific comments and organize your work! Keep up the hard work as the class gets more difficult! As Thomas Jefferson said, 'I'm a greater believer in luck, and I find the harder I work the more I have of it.'",
  },
];

const seedBlogs = () => Blog.bulkCreate(blogData);

module.exports = seedBlogs;
