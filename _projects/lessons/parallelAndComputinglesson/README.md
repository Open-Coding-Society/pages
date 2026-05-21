# Slackers Learning Parallel - Project Files

This is the source project folder for the interactive lesson "Slackers Learning Parallel: Why Working Together is Faster Than Working Alone".

## Project Structure

```
parallelAndComputinglesson/
├── Makefile                    # Build configuration
├── index.html                  # Main interactive lesson (26 KB)
├── notebook.src.ipynb          # Jupyter notebook version (9.9 KB)
├── docs/
│   └── lesson.md              # Documentation and lesson overview
└── images/
    ├── sequential-vs-parallel.svg    # Visual comparison diagram
    ├── parallel-timeline.svg         # Timeline illustration
    └── multicore-cpu.svg             # CPU cores concept diagram
```

## Files

### index.html
The main interactive lesson in a single, self-contained HTML file. Includes:
- Embedded CSS styling for responsive design
- Vanilla JavaScript for interactivity
- 5 interactive sections
- Knowledge check quiz
- Task simulator with real-time animations
- Responsive design for desktop, tablet, and mobile

**Size:** ~26 KB  
**Duration:** 2-2.5 minutes  
**Features:** Interactive buttons, progress bars, quiz with feedback

### notebook.src.ipynb
Jupyter notebook version of the lesson that includes:
- Markdown explanations
- Runnable Python code examples
- Threading demonstrations
- Data fetching simulations
- Challenge activities
- Performance comparisons

### docs/lesson.md
Complete documentation including:
- Learning objectives
- Lesson structure breakdown
- Key concepts explained
- Real-world applications
- Assessment criteria
- Customization options

### Images (SVG format)
Vector graphics that illustrate:
- Sequential vs parallel execution comparison
- Timeline of parallel task execution
- Multi-core CPU architecture

## Building

The project uses a Makefile to distribute files to the main site structure:

```bash
# Build the entire project
make -C _projects/parallelAndComputinglesson build

# Just copy images and assets
make -C _projects/parallelAndComputinglesson assets

# Publish documentation to _posts/
make -C _projects/parallelAndComputinglesson docs

# Clean distributed files
make -C _projects/parallelAndComputinglesson clean
```

### Build Output

After running `make build`, files are distributed to:

```
assets/js/projects/parallelAndComputinglesson/      (JavaScript files)
images/projects/parallelAndComputinglesson/         (SVG images)
_notebooks/projects/parallelAndComputinglesson/     (Jupyter notebook)
_posts/projects/parallelAndComputinglesson/         (Documentation)
```

## Deployment

### Web Access
The lesson will be accessible at:
- **URL:** `/lessons/slackers/parrallel/`
- **Type:** Interactive HTML lesson
- **Access:** Direct browser access (no plugins required)

### Jupyter Access
The notebook will be available in:
- `_notebooks/projects/parallelAndComputinglesson/2026-04-24-parallelAndComputinglesson.ipynb`

## Lesson Content

### Topics Covered

1. **Sequential Processing**
   - Tasks execute one after another
   - Total time = sum of all task times
   - Example: 120 minutes for 4 × 30-minute tasks

2. **Parallel Processing**
   - Tasks execute simultaneously
   - Total time = longest task time
   - Same example: 30 minutes (4x faster!)

3. **Real-World Applications**
   - Multi-core CPUs
   - Threading and concurrent execution
   - Web servers handling multiple requests
   - GPU computing for graphics

4. **Python Implementation**
   - `concurrent.futures.ThreadPoolExecutor`
   - Performance measurement and comparison
   - Data fetching simulations

5. **Quiz & Assessment**
   - Knowledge check questions
   - Immediate feedback
   - Concept reinforcement

## Interactive Features

- **Section Navigation** - Move through 5 sections with Previous/Next buttons
- **Task Simulator** - Click "Start" to watch sequential vs parallel execution in real-time
- **Interactive Quiz** - Answer questions with immediate feedback
- **Progress Indicator** - Shows current section (1 of 5)
- **Responsive Design** - Works on all screen sizes

## Customization

To customize the lesson:

1. **Colors** - Edit gradient values in `index.html` CSS section
2. **Tasks** - Modify task names and durations in Section 1
3. **Quiz Questions** - Update the `checkAnswer()` functions in JavaScript
4. **Real-world Examples** - Modify Section 4 content
5. **Timing** - Adjust the simulation speed in JavaScript

## Technical Specifications

- **Languages:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Internal CSS with gradients and animations
- **Interactivity:** Vanilla JavaScript (no frameworks)
- **Images:** SVG format (scalable, small file size)
- **Notebook:** Jupyter-compatible Python code
- **Browser Support:** All modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive:** Mobile-first design (320px+)
- **Performance:** Loads in <2 seconds, smooth animations at 60fps

## Learning Outcomes

Students will be able to:

✅ Explain the difference between sequential and parallel execution  
✅ Calculate speedup and performance improvements  
✅ Identify real-world parallel processing applications  
✅ Write Python code using threading and multiprocessing  
✅ Understand the limits of parallelism (Amdahl's Law)  

## Notes

- All files are self-contained within this project folder
- No external CDN resources required
- Works offline after initial load
- SVG images are resolution-independent
- Jupyter notebook requires Python 3.9+

## Maintenance

To update the lesson:
1. Edit files in `_projects/parallelAndComputinglesson/`
2. Run `make -C _projects/parallelAndComputinglesson build` to rebuild
3. Files are automatically distributed to the site

---

**Created:** April 24, 2026  
**Lesson Duration:** 2-2.5 minutes  
**Target Audience:** High school and introductory CS students  
**Difficulty:** Beginner-friendly
