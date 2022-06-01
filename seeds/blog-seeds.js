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
    user_id: 1,
    category_id: 3,
    summary: 'Tips and tricks to ace the project',
    text: "'We cannot solve problems with the kind of thinking we employed when we came up with them.' Albert Einstein",
  },
  {
    title: 'Tech Blog, stuck in a bog?',
    user_id: 2,
    category_id: 2,
    summary: '7 steps to creating the best tech blog in your class',
    text: "'Learn as if you will live forever, live like you will die tomorrow.' Mahatma Gandhi",
  },
  {
    title: 'E-commerce Back End, know your res.send!',
    user_id: 3,
    category_id: 2,
    summary:
      "You'll see why ORMs are so useful, and why last week was so hard!",
    text: "'Success is not final; failure is not fatal: It is the courage to continue that counts.' Winston S. Churchill",
  },
  {
    title: "Employee Management System, it's as big as it sounds!",
    user_id: 4,
    category_id: 2,
    summary:
      'We break down the steps you need to knock this one out of the park!',
    text: "'It is better to fail in originality than to succeed in imitation.' Herman Melville",
  },
  {
    title: 'Note Taker, game changer!',
    user_id: 5,
    category_id: 2,
    summary: 'Officially full stack! Welcome to the world of servers.',
    text: "'The road to success and the road to failure are almost exactly the same.' Colin R. Davis",
  },
  {
    title: 'Team Profile Generator, do it with Class!',
    user_id: 6,
    category_id: 2,
    summary:
      "OOPs! Did someone say Class? Here's how to constructor() your way to an A+",
    text: "'Success usually comes to those who are too busy looking for it.' Henry David Thoreau",
  },
  {
    title: "Good README Generator, there's Node going back now!",
    user_id: 7,
    category_id: 2,
    summary: "Everything you need to Node about... okay, okay, I'll stop now.",
    text: "'Develop success from failures. Discouragement and failure are two of the surest stepping stones to success.' Dale Carnegie'",
  },
  {
    title: 'Updated Portfolio, come again?',
    user_id: 8,
    category_id: 1,
    summary:
      "Cross the T's and Dot the I's: here's what to cross and what to dot.",
    text: "'There are three ways to ultimate success: The first way is to be kind. The second way is to be kind. The third way is to be kind.' Mister Rogers",
  },
  {
    title: 'Project 1, easier said than done!',
    user_id: 9,
    category_id: 3,
    summary:
      "And you thought Weather Dashboard was hard! Here's how to make Project 1 work.",
    text: "'The slogan 'Press On' has solved and always will solve the problems of the human race.' Calvin Coolidge",
  },
  {
    title: 'Weather Dashboard, .then what?',
    user_id: 10,
    category_id: 1,
    summary: 'Everything you need to know about fetch, .then and catch',
    text: "'Success is peace of mind, which is a direct result of self-satisfaction in knowing you made the effort to become the best of which you are capable.' John Wooden",
  },
  {
    title: 'Day planner, delegate, delegate, delegate',
    user_id: 11,
    category_id: 1,
    summary: 'Let the third parties do the work!',
    text: "'I never dreamed about success. I worked for it.' Estée Lauder",
  },
  {
    title: "Code Quiz, wait, what's an object?",
    user_id: 12,
    category_id: 1,
    summary: "Know your objects from your arrays, and you'll be fine!",
    text: "'Success is getting what you want, happiness is wanting what you get.' W. P. Kinsella",
  },
  {
    title: 'Password Generator, Math.what?',
    user_id: 13,
    category_id: 1,
    summary: "Generate? Math? Random? Here's how you do it.",
    text: "'Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.' Alexander Graham Bell",
  },
  {
    title: "Professional Portfolio, easy! Wait… what's a flex box?",
    user_id: 14,
    category_id: 1,
    summary: "It's all about putting things in boxes.",
    text: "'Either you run the day or the day runs you.' Jim Rohn",
  },
  {
    title: "Code refactor, how do you even say 'Horiseon'?",
    user_id: 15,
    category_id: 1,
    summary:
      "Messy code is still good code, right? Here's why refactoring is super important.",
    text: "'I'm a greater believer in luck, and I find the harder I work the more I have of it.' Thomas Jefferson",
  },
];

const seedBlogs = () => Blog.bulkCreate(blogData);

module.exports = seedBlogs;
