// This is an example file to show how to use the library

// We are goin to make a report on an algorithm that takes three indiviuals with their ages, and a salary table. We are going to determine how much money each of them makes, and how much they make together.

// You can run this example by running `npm run example:simple` and check the result in `src/example/simple.md`

import { DocuPorter } from "..";

import path from 'path';

const fileNameWithoutExt = path.basename(__filename, path.extname(__filename));
const mdPath = path.join('src/example', `${fileNameWithoutExt}.md`);

// We need to instantiate a DocuPorter object with the path to the markdown file where we want to write the report
const rep = new DocuPorter(mdPath);

// We can now start writing the report by adding a title
rep.h1('Example 1: Salary Report');

// These are the people we are going to use in our example
const people = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 22 },
  { name: 'Jack', age: 27 },
]

// These are the salaries we are going to use in our example
const salaries = [
  { age: 20, amount: 25000 },
  { age: 24, amount: 36000 },
  { age: 26, amount: 42000 },
]

// We want to explain all this in the report, so we start by adding pararaphs and json blocks to the md to explan what we are doing
rep.text('We have three people:');
rep.json(people);

rep.text('And we have a table with the salaries each person earns when it reaches an specific age:');
rep.json(salaries);

// We can now start doing the calculations we need to do to get the results we want. We are going to use the map function to get the salaries for each person. We can add a code clause to the report to explain what we are doing

const peopleWithSalaries = people.map(person => {
  let salary = 0;

  for (const s of salaries) {
    if (person.age >= s.age) {
      salary = s.amount;
    }
  }

  return { ...person, salary };
});

rep.text('We can now look into the salaries table and assign a salary to each person:');
rep.ts(`const peopleWithSalaries = people.map(person => {
  let salary = 0;

  for (const s of salaries) {
    if (person.age <= s.age) {
      salary = s.amount;
    }
  }

  return { ...person, salary };
});`)

// And again, show the result of the calculation using a json
rep.json(peopleWithSalaries);

// We can add lower level titles to the report to give more structure to the document
rep.h2('Total Salaries:');

// When traversing a list of object, we may want to report only one item to make an example. We can use the reporter conditions and values to do that. In this case, we only want to mkae reporting for the second person in the list, so we set the condition name to be Jane. Now we can set the value of name to be each of the name of the report, and only when the name matches the condition, the report will take place
rep.conditions.set('name', 'Jane');

rep.text('We can now sum all the salaries to get the total amount of money they make together using a reduce function:');
rep.ts(`const totalSalaries = peopleWithSalaries.reduce((acc, person) => acc + person.salary, 0);`);

const totalSalaries = peopleWithSalaries.reduce((acc, person) => {
  rep.values.set('name', person.name);

  // This report will only take place when the name is Jane
  rep.text('During the iterations, we sum up each person salary to the accumulator:');
  rep.json({
    accumulator: acc,
    personSalary: person.salary,
    nextValue: `${acc} + ${person.salary} = ${acc + person.salary}`
  });

  // To debug code, you can also use the rep.log function to print to the console. It does the same as console.log, but it only does if the conditions and values match
  rep.log('When the name is', person.name, 'the accumulator is', acc); // This will only print when the name is Jane. This can be pretty handy to debug large arrays mapping or reducing

  return acc + person.salary
}, 0);

// Once we are done with the calculation loop, we can clear up the conditions and values so they don't affect the rest of the report
rep.conditions.clearAll();
rep.values.clearAll();

rep.text('And we get the total salaries:');
rep.json(totalSalaries);

// We can also mute and unmute the reporter so it doesn't write to the file
if (totalSalaries < 1000000) rep.mute();
rep.h1('We are millionaires!')
rep.unMute();

rep.h1('We are not millionaires :(')

