/**
 * Supplemental calendar seeds (mission desk drills + sprint module tasks).
 * Used alongside pathwayTaskCatalog milestones.
 */

export const CS_PATHWAY_MISSION_DESK_KNOWLEDGE_BASE = Object.freeze({
  'The Admin': {
    expertise: 'Linux terminal usage, WSL setup for Windows, installing and managing tool versions with Brew (macOS) and Apt (Ubuntu/Kali/Mint), VSCode setup with extensions like GitLens and Jupyter, and verifying correct installation of Python, pip, Ruby, Bundler, Gem, Jupyter, and Git config',
    questions: [
      { question: 'What command checks which version of Python is active in your terminal?', answer: 'python --version - if it shows 2.x you may need python3 --version; your venv should point to the correct version.' },
      { question: 'How do you verify pip is installed and see its version?', answer: 'pip --version - it also shows which Python it is linked to, so you can confirm it matches your active venv.' },
      { question: 'What command confirms Ruby is installed and shows its version?', answer: 'ruby -v - on macOS use Brew (brew install ruby); on Ubuntu/Kali/Mint use apt (sudo apt install ruby-full).' },
      { question: 'How do you check that Bundler and Gem are installed correctly?', answer: 'bundle -v and gem -v - Bundler manages Ruby gem dependencies per project the same way pip manages Python packages.' },
      { question: 'What command verifies Jupyter is installed and shows its version?', answer: 'jupyter --version - also run jupyter kernelspec list to confirm the correct Python kernel is registered.' },
      { question: 'How do you set your Git global username and email, and how do you verify them?', answer: 'git config --global user.name "Your Name" and git config --global user.email "you@example.com"; verify with git config --global user.name and git config --global user.email.' },
      { question: 'How do you install a tool with Brew on macOS and keep it updated?', answer: 'brew install <tool> to install; brew upgrade <tool> to update a specific tool; brew update first to refresh the formula list.' },
      { question: 'How do you install a tool with Apt on Ubuntu, Kali, or Mint?', answer: 'sudo apt update first to refresh the package list, then sudo apt install <package> - use apt list --installed | grep <name> to verify.' },
      { question: 'What is WSL and why do Windows developers use it for this course?', answer: 'WSL (Windows Subsystem for Linux) runs a real Linux kernel inside Windows, giving access to Bash, Apt, and Linux-native tools so the dev environment matches macOS and Linux classmates.' },
      { question: 'Which VSCode extensions should every student install for this course?', answer: 'GitLens (git history and blame), Python (ms-python.python), Jupyter (ms-toolsai.jupyter) - install via the VSCode Marketplace or code --install-extension <id> in the terminal.' },
    ],
  },
  'The Archivist': {
    expertise: 'file and folder creation, correct naming conventions, cloning teacher reference repos, managing individual and team repositories, creating and activating a venv per project, running make or local dev commands only within an active venv, and when to use a fork versus a template repository',
    questions: [
      { question: 'What naming convention should you use for files and folders in a project?', answer: 'Use lowercase letters, hyphens or underscores instead of spaces, and descriptive names that reflect content - e.g. game-engine.js, not myFile2.' },
      { question: 'What command clones a remote repository to your local machine?', answer: 'git clone <url> - creates a local copy of the repo including all history and branches.' },
      { question: 'How do you clone a teacher reference repo without mixing it with your own work?', answer: 'Clone it into a clearly named read-only folder (e.g. opencs/), never commit to it, and pull updates with git pull when the teacher publishes changes.' },
      { question: 'What is the purpose of a virtual environment (venv) in a OpenCS project?', answer: 'A venv isolates project dependencies so each project has its own package versions that do not conflict with other projects or the system Python.' },
      { question: 'What is the correct sequence to create and activate a venv for a new project?', answer: 'python3 -m venv venv, then source venv/bin/activate (macOS/Linux), use ./scripts/venv.sh to get Python and Ruby dependencies' },
      { question: 'Why should you only run make or local dev commands inside an active venv?', answer: 'Without an active venv the command will fail on missing packages, produce failures, or pollute the global environment.' },
      { question: 'How do you tell whether a venv is currently active in your terminal?', answer: 'The shell prompt shows the venv name in parentheses, e.g. (venv).' },
      { question: 'What is the difference between a personal repo and a team (fork/org) repo, and how do you manage both?', answer: 'Your personal repo is the origin you push to; the team repo is upstream. Add it as a remote (git remote add upstream <url>), sync with git fetch upstream, and merge selectively.' },
      { question: 'When should you fork a repo instead of using a template?', answer: 'Fork when you intend to contribute changes back to the original owner via a pull request - the fork keeps a live link to the upstream repo.' },
      { question: 'When should you use a template repo instead of forking?', answer: 'Use a template when you want a clean starting point that is isolated from the original - you can still pull upstream updates manually but there is no automatic PR link.' },
      { question: 'How do you pull upstream updates into a repo created from a template?', answer: 'Add the template as a remote (git remote add upstream <url>), fetch with git fetch upstream, then merge or cherry-pick the changes you want into your branch.' },
    ],
  },
  'The SDLC Master': {
    expertise: 'individual and team practices across the software development lifecycle: creating issues, writing code, building, testing, committing, and integrating - all in small increments using continuous integration and agile iteration',
    questions: [
      { question: 'Why should you create an issue before writing code?', answer: 'Issues document intent, allow team discussion, and link commits to requirements so changes are always traceable.' },
      { question: 'What makes a good commit message?', answer: 'A short imperative summary line, a blank line, then a body explaining why - not what - the change was made.' },
      { question: 'What is the purpose of a build step in the SDLC?', answer: 'It compiles or bundles code, catches compile-time errors early, and produces a reproducible artifact before testing.' },
      { question: 'How small should an increment be in agile development?', answer: 'Small enough to complete, test, and integrate within a single sprint - ideally hours to a day, not weeks.' },
      { question: 'What is continuous integration (CI) and why does it matter?', answer: 'CI automatically builds and tests every commit so integration bugs are caught immediately rather than at release time.' },
      { question: 'What should you do before committing code to the main branch?', answer: 'Run local tests, review the diff, write a meaningful commit message, and confirm the build with Make and passes in CI after Sync.' },
      { question: 'What is the difference between unit testing and integration testing?', answer: 'Unit tests verify a single function or class in isolation; integration tests verify that multiple components work together correctly.' },
      { question: 'How does branching support small-increment development?', answer: 'Short-lived feature branches let each increment be developed independently, reviewed via pull request, and merged only when passing all checks.' },
    ],
  },
  'The Scrum Master': {
    expertise: 'agile manifesto, scrum board setup, issue tracking, sprint ceremonies such as standups retrospectives and planning, and team collaboration practices',
    questions: [
      { question: 'What are the four values of the Agile Manifesto?', answer: 'Individuals over processes, working software over documentation, customer collaboration over contracts, and responding to change over following a plan.' },
      { question: 'How do you set up a scrum board?', answer: 'Create columns for Backlog, In Progress, Review, and Done, then populate with user story cards prioritized by the product owner.' },
      { question: 'What is the purpose of a daily standup?', answer: 'A short sync (<=15 min) where each team member shares what they did yesterday, what they will do today, and any blockers.' },
      { question: 'How do you write a good user story?', answer: 'Use the format: As a [role], I want [feature], so that [benefit]. Include acceptance criteria.' },
      { question: 'What happens in a sprint retrospective?', answer: 'The team reflects on what went well, what to improve, and agrees on one or two actionable changes for the next sprint.' },
      { question: 'How do you track issues in a project?', answer: 'Create issues with a clear title, description, acceptance criteria, priority label, and assignee; link them to the relevant sprint or milestone.' },
      { question: 'What is the difference between a product backlog and a sprint backlog?', answer: 'The product backlog is the full prioritized wish list; the sprint backlog is the subset committed to for the current sprint.' },
      { question: 'What is the role of the scrum master?', answer: 'Facilitate ceremonies, remove blockers, protect the team from scope creep, and coach the team on agile practices.' },
    ],
  },
});

export const CS_PATHWAY_SPRINT_TASKS = Object.freeze([
  { id: 'goal', text: 'Build the entire project', type: 'too-big', label: 'Too Big' },
  { id: 'wireframe', text: 'Sketch the main screen layout', type: 'good', label: 'Good Task' },
  { id: 'login', text: 'Create login button', type: 'good', label: 'Good Task' },
  { id: 'semicolon', text: 'Add one semicolon', type: 'too-small', label: 'Too Small' },
  { id: 'test', text: 'Test the user flow', type: 'good', label: 'Good Task' },
  { id: 'deploy', text: 'Publish the final version', type: 'good', label: 'Good Task' },
]);

export const CS_PATHWAY_SPRINT_TIMELINE_TASKS = Object.freeze([
  'Understand the goal',
  'Break goal into tasks',
  'Build first version',
  'Test with a user',
  'Review and improve',
]);
