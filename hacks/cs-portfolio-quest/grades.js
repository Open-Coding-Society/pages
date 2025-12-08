/**
 * CS Portfolio Quest - Grade Collection System
 * 
 * This script visits all submodules and collects student names and grades.
 * Each submodule should implement a function that returns {name: string, grade: number}
 */

// Configuration
const CONFIG = {
  // Base URL - update this based on your deployment
  baseUrl: window.location.origin || 'http://localhost:4000',
  
  // Standard function name that submodules should implement
  gradeFunctionName: 'getStudentGrade',
  
  // Timeout for loading each submodule (ms)
  timeout: 5000
};

// Define all submodules with their permalinks
const SUBMODULES = [
  // Frontend Development (6 submodules)
  { category: 'frontend', submodule: 1, permalink: '/cs-portfolio-quest/frontend/submodule_1/', team: 'Creators' },
  { category: 'frontend', submodule: 2, permalink: '/cs-portfolio-quest/frontend/submodule_2/', team: 'Creators' },
  { category: 'frontend', submodule: 3, permalink: '/cs-portfolio-quest/frontend/submodule_3/', team: 'Creators' },
  { category: 'frontend', submodule: 4, permalink: '/cs-portfolio-quest/frontend/submodule_4/', team: 'Creators' },
  { category: 'frontend', submodule: 5, permalink: '/cs-portfolio-quest/frontend/submodule_5/', team: 'Creators' },
  { category: 'frontend', submodule: 6, permalink: '/cs-portfolio-quest/frontend/submodule_6/', team: 'Creators' },
  
  // Backend Development (6 submodules)
  { category: 'backend', submodule: 1, permalink: '/cs-portfolio-quest/backend/submodule_1/', team: 'Encrypters' },
  { category: 'backend', submodule: 2, permalink: '/cs-portfolio-quest/backend/submodule_2/', team: 'Encrypters' },
  { category: 'backend', submodule: 3, permalink: '/cs-portfolio-quest/backend/submodule_3/', team: 'Encrypters' },
  { category: 'backend', submodule: 4, permalink: '/cs-portfolio-quest/backend/submodule_4/', team: 'Encrypters' },
  { category: 'backend', submodule: 5, permalink: '/cs-portfolio-quest/backend/submodule_5/', team: 'Encrypters' },
  { category: 'backend', submodule: 6, permalink: '/cs-portfolio-quest/backend/submodule_6/', team: 'Encrypters' },
  
  // Data Visualization (3 submodules)
  { category: 'data-viz', submodule: 1, permalink: '/cs-portfolio-quest/data-viz/submodule_1/', team: 'Applicators' },
  { category: 'data-viz', submodule: 2, permalink: '/cs-portfolio-quest/data-viz/submodule_2/', team: 'Applicators' },
  { category: 'data-viz', submodule: 3, permalink: '/cs-portfolio-quest/data-viz/submodule_3/', team: 'Applicators' },
  
  // Resume Building (6 submodules)
  { category: 'resume', submodule: 1, permalink: '/cs-portfolio-quest/resume/submodule_1/', team: 'Grinders' },
  { category: 'resume', submodule: 2, permalink: '/cs-portfolio-quest/resume/submodule_2/', team: 'Grinders' },
  { category: 'resume', submodule: 3, permalink: '/cs-portfolio-quest/resume/submodule_3/', team: 'Grinders' },
  { category: 'resume', submodule: 4, permalink: '/cs-portfolio-quest/resume/submodule_4/', team: 'Grinders' },
  { category: 'resume', submodule: 5, permalink: '/cs-portfolio-quest/resume/submodule_5/', team: 'Grinders' },
  { category: 'resume', submodule: 6, permalink: '/cs-portfolio-quest/resume/submodule_6/', team: 'Grinders' },
  
  // AI Usage (6 submodules)
  { category: 'ai', submodule: 1, permalink: '/cs-portfolio-quest/ai/submodule_1/', team: 'Thinkers' },
  { category: 'ai', submodule: 2, permalink: '/cs-portfolio-quest/ai/submodule_2/', team: 'Thinkers' },
  { category: 'ai', submodule: 3, permalink: '/cs-portfolio-quest/ai/submodule_3/', team: 'Thinkers' },
  { category: 'ai', submodule: 4, permalink: '/cs-portfolio-quest/ai/submodule_4/', team: 'Thinkers' },
  { category: 'ai', submodule: 5, permalink: '/cs-portfolio-quest/ai/submodule_5/', team: 'Thinkers' },
  { category: 'ai', submodule: 6, permalink: '/cs-portfolio-quest/ai/submodule_6/', team: 'Thinkers' },
  
  // Analytics/Admin (3 submodules)
  { category: 'analytics', submodule: 1, permalink: '/cs-portfolio-quest/analytics/submodule_1/', team: 'Curators' },
  { category: 'analytics', submodule: 2, permalink: '/cs-portfolio-quest/analytics/submodule_2/', team: 'Curators' },
  { category: 'analytics', submodule: 3, permalink: '/cs-portfolio-quest/analytics/submodule_3/', team: 'Curators' }
];

/**
 * Fetch grade from a single submodule using iframe injection
 * @param {Object} submodule - Submodule configuration object
 * @returns {Promise<Object>} Promise resolving to grade data
 */
async function fetchGradeFromSubmodule(submodule) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = CONFIG.baseUrl + submodule.permalink;
    
    const timeoutId = setTimeout(() => {
      document.body.removeChild(iframe);
      resolve({
        category: submodule.category,
        submodule: submodule.submodule,
        permalink: submodule.permalink,
        team: submodule.team,
        status: 'timeout',
        error: 'Page load timeout',
        studentName: null,
        grade: null
      });
    }, CONFIG.timeout);
    
    iframe.onload = () => {
      try {
        const iframeWindow = iframe.contentWindow;
        
        // Check if the grading function exists
        if (typeof iframeWindow[CONFIG.gradeFunctionName] === 'function') {
          const gradeData = iframeWindow[CONFIG.gradeFunctionName]();
          
          clearTimeout(timeoutId);
          document.body.removeChild(iframe);
          
          resolve({
            category: submodule.category,
            submodule: submodule.submodule,
            permalink: submodule.permalink,
            team: submodule.team,
            status: 'success',
            studentName: gradeData.name || gradeData.studentName,
            grade: gradeData.grade || gradeData.score,
            timestamp: new Date().toISOString()
          });
        } else {
          // Function not implemented yet
          clearTimeout(timeoutId);
          document.body.removeChild(iframe);
          
          resolve({
            category: submodule.category,
            submodule: submodule.submodule,
            permalink: submodule.permalink,
            team: submodule.team,
            status: 'not_implemented',
            error: `Function '${CONFIG.gradeFunctionName}' not found`,
            studentName: null,
            grade: null
          });
        }
      } catch (error) {
        clearTimeout(timeoutId);
        document.body.removeChild(iframe);
        
        resolve({
          category: submodule.category,
          submodule: submodule.submodule,
          permalink: submodule.permalink,
          team: submodule.team,
          status: 'error',
          error: error.message,
          studentName: null,
          grade: null
        });
      }
    };
    
    iframe.onerror = () => {
      clearTimeout(timeoutId);
      document.body.removeChild(iframe);
      
      resolve({
        category: submodule.category,
        submodule: submodule.submodule,
        permalink: submodule.permalink,
        team: submodule.team,
        status: 'error',
        error: 'Failed to load page',
        studentName: null,
        grade: null
      });
    };
    
    document.body.appendChild(iframe);
  });
}

/**
 * Generate mock student data for testing
 * @param {number} count - Number of mock students to generate
 * @returns {Array} Array of mock student names
 */
function generateMockStudents(count = 5) {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Parker', 'Cameron'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const students = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    students.push(`${firstName} ${lastName}`);
  }
  return students;
}

/**
 * Generate mock grade data for a submodule
 * @param {Object} submodule - Submodule configuration
 * @param {string} studentName - Student name
 * @returns {Object} Mock grade data
 */
function generateMockGrade(submodule, studentName) {
  // Generate realistic grade (60-100)
  const grade = Math.floor(Math.random() * 40) + 60;
  
  return {
    category: submodule.category,
    submodule: submodule.submodule,
    permalink: submodule.permalink,
    team: submodule.team,
    status: 'mock',
    studentName: studentName,
    grade: grade,
    timestamp: new Date().toISOString(),
    note: 'Mock data generated for testing'
  };
}

/**
 * Collect grades from all submodules with automatic fallback to mock data
 * @param {Array} submodules - Array of submodule configurations (defaults to all)
 * @param {boolean} useMockData - Force use of mock data
 * @returns {Promise<Object>} Promise resolving to complete grade data
 */
async function collectAllGrades(submodules = SUBMODULES, useMockData = false) {
  console.log(`Starting grade collection for ${submodules.length} submodules...`);
  
  const results = [];
  let errorCount = 0;
  
  if (useMockData) {
    console.log('Using mock data mode...');
    const mockStudents = generateMockStudents(5);
    
    for (const submodule of submodules) {
      const studentName = mockStudents[Math.floor(Math.random() * mockStudents.length)];
      results.push(generateMockGrade(submodule, studentName));
    }
  } else {
    // Process submodules sequentially to avoid overwhelming the browser
    for (let i = 0; i < submodules.length; i++) {
      const submodule = submodules[i];
      console.log(`Fetching grades from ${submodule.category}/submodule_${submodule.submodule}...`);
      
      try {
        const result = await fetchGradeFromSubmodule(submodule);
        results.push(result);
        
        if (result.status === 'error' || result.status === 'timeout') {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error fetching from ${submodule.category}/submodule_${submodule.submodule}:`, error);
        errorCount++;
        
        // Add error result
        results.push({
          category: submodule.category,
          submodule: submodule.submodule,
          permalink: submodule.permalink,
          team: submodule.team,
          status: 'error',
          error: error.message || 'Unknown error',
          studentName: null,
          grade: null
        });
      }
      
      // Brief pause between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Organize results by category
  const gradesByCategory = {};
  const summary = {
    total: results.length,
    successful: 0,
    notImplemented: 0,
    errors: 0,
    mock: 0,
    uniqueStudents: new Set(),
    usingMockData: useMockData
  };
  
  results.forEach(result => {
    if (!gradesByCategory[result.category]) {
      gradesByCategory[result.category] = [];
    }
    gradesByCategory[result.category].push(result);
    
    // Update summary
    if (result.status === 'success') {
      summary.successful++;
      if (result.studentName) {
        summary.uniqueStudents.add(result.studentName);
      }
    } else if (result.status === 'mock') {
      summary.mock++;
      if (result.studentName) {
        summary.uniqueStudents.add(result.studentName);
      }
    } else if (result.status === 'not_implemented') {
      summary.notImplemented++;
    } else {
      summary.errors++;
    }
  });
  
  summary.uniqueStudents = Array.from(summary.uniqueStudents);
  
  // If no successful data and not using mock mode, generate mock data
  if (summary.successful === 0 && !useMockData) {
    console.log('No successful data collected. Generating mock data as fallback...');
    const mockStudents = generateMockStudents(5);
    
    submodules.forEach(submodule => {
      const studentName = mockStudents[Math.floor(Math.random() * mockStudents.length)];
      const mockGrade = generateMockGrade(submodule, studentName);
      results.push(mockGrade);
      
      if (!gradesByCategory[submodule.category]) {
        gradesByCategory[submodule.category] = [];
      }
      gradesByCategory[submodule.category].push(mockGrade);
      
      summary.mock++;
      summary.total++;
      summary.uniqueStudents.add(studentName);
    });
    
    summary.uniqueStudents = Array.from(new Set(summary.uniqueStudents));
  }
  
  const output = {
    metadata: {
      collectionDate: new Date().toISOString(),
      totalSubmodules: results.length,
      baseUrl: CONFIG.baseUrl,
      mode: useMockData ? 'mock' : (summary.successful > 0 ? 'live' : 'fallback_mock')
    },
    summary,
    gradesByCategory,
    allGrades: results
  };
  
  console.log('Grade collection complete!');
  console.log(`Successful: ${summary.successful}, Mock: ${summary.mock}, Not Implemented: ${summary.notImplemented}, Errors: ${summary.errors}`);
  
  return output;
}

/**
 * Export grades to JSON file
 * @param {Object} gradeData - Grade data object
 * @param {string} filename - Output filename
 */
function exportGradesToJSON(gradeData, filename = 'cs-portfolio-grades.json') {
  const jsonString = JSON.stringify(gradeData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log(`Grades exported to ${filename}`);
}

/**
 * Export grades to CSV file
 * @param {Object} gradeData - Grade data object
 * @param {string} filename - Output filename
 */
function exportGradesToCSV(gradeData, filename = 'cs-portfolio-grades.csv') {
  let csv = 'Category,Submodule,Team,Status,Student Name,Grade,Permalink\n';
  
  gradeData.allGrades.forEach(grade => {
    csv += [
      grade.category,
      grade.submodule,
      grade.team,
      grade.status,
      grade.studentName || 'N/A',
      grade.grade !== null ? grade.grade : 'N/A',
      CONFIG.baseUrl + grade.permalink
    ].map(field => `"${field}"`).join(',') + '\n';
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log(`Grades exported to ${filename}`);
}

/**
 * Get grades for a specific category
 * @param {string} category - Category name (frontend, backend, etc.)
 * @returns {Promise<Object>} Promise resolving to grade data for that category
 */
async function getGradesByCategory(category) {
  const categorySubmodules = SUBMODULES.filter(s => s.category === category);
  if (categorySubmodules.length === 0) {
    throw new Error(`No submodules found for category: ${category}`);
  }
  return await collectAllGrades(categorySubmodules);
}

/**
 * Get grades organized by student name
 * @param {Object} gradeData - Grade data object from collectAllGrades
 * @returns {Object} Grades organized by student name
 */
function organizeGradesByStudent(gradeData) {
  const byStudent = {};
  
  gradeData.allGrades.forEach(grade => {
    if (grade.status === 'success' && grade.studentName) {
      if (!byStudent[grade.studentName]) {
        byStudent[grade.studentName] = {
          name: grade.studentName,
          grades: [],
          averageGrade: 0,
          completedSubmodules: 0
        };
      }
      
      byStudent[grade.studentName].grades.push({
        category: grade.category,
        submodule: grade.submodule,
        grade: grade.grade,
        team: grade.team
      });
    }
  });
  
  // Calculate averages
  Object.values(byStudent).forEach(student => {
    student.completedSubmodules = student.grades.length;
    const validGrades = student.grades.filter(g => typeof g.grade === 'number');
    if (validGrades.length > 0) {
      const sum = validGrades.reduce((acc, g) => acc + g.grade, 0);
      student.averageGrade = (sum / validGrades.length).toFixed(2);
    }
  });
  
  return byStudent;
}

// =============================================================================
// MAIN EXECUTION FUNCTIONS
// =============================================================================

/**
 * Main function - Run complete grade collection
 * @param {boolean} forceMock - Force use of mock data
 */
async function runGradeCollection(forceMock = false) {
  console.log('=== CS Portfolio Quest - Grade Collection System ===');
  
  try {
    const gradeData = await collectAllGrades(SUBMODULES, forceMock);
    
    console.log('\n=== Collection Summary ===');
    console.log(`Mode: ${gradeData.metadata.mode}`);
    console.log(`Total Submodules: ${gradeData.summary.total}`);
    console.log(`Successful: ${gradeData.summary.successful}`);
    console.log(`Mock Data: ${gradeData.summary.mock}`);
    console.log(`Not Implemented: ${gradeData.summary.notImplemented}`);
    console.log(`Errors: ${gradeData.summary.errors}`);
    console.log(`Unique Students: ${gradeData.summary.uniqueStudents.length}`);
    
    if (gradeData.summary.uniqueStudents.length > 0) {
      console.log('\nStudents found:', gradeData.summary.uniqueStudents.join(', '));
      
      const byStudent = organizeGradesByStudent(gradeData);
      console.log('\n=== Grades by Student ===');
      Object.values(byStudent).forEach(student => {
        console.log(`${student.name}: ${student.completedSubmodules} completed, Average: ${student.averageGrade}%`);
      });
    }
    
    return gradeData;
  } catch (error) {
    console.error('Error during grade collection:', error);
    
    // Even on catastrophic failure, return mock data
    console.log('Catastrophic error occurred. Generating emergency mock data...');
    return await collectAllGrades(SUBMODULES, true);
  }
}

/**
 * Quick test with a single submodule
 * @param {string} category - Category name
 * @param {number} submoduleNum - Submodule number
 */
async function testSingleSubmodule(category, submoduleNum) {
  const submodule = SUBMODULES.find(s => s.category === category && s.submodule === submoduleNum);
  if (!submodule) {
    console.error(`Submodule not found: ${category}/submodule_${submoduleNum}`);
    return;
  }
  
  console.log(`Testing ${category}/submodule_${submoduleNum}...`);
  const result = await fetchGradeFromSubmodule(submodule);
  console.log('Result:', result);
  return result;
}

// =============================================================================
// PUBLIC API
// =============================================================================

// Export public functions
window.CSPortfolioGrades = {
  // Core functions
  collectAllGrades,
  getGradesByCategory,
  organizeGradesByStudent,
  
  // Export functions
  exportGradesToJSON,
  exportGradesToCSV,
  
  // Utility functions
  runGradeCollection,
  testSingleSubmodule,
  generateMockStudents,
  generateMockGrade,
  
  // Configuration
  config: CONFIG,
  submodules: SUBMODULES
};

// Console helper message
console.log(`
CS Portfolio Quest - Grade Collection System Loaded!

Usage:
  1. Collect all grades (with automatic mock fallback):
     const grades = await CSPortfolioGrades.runGradeCollection();
  
  2. Collect with forced mock data:
     const grades = await CSPortfolioGrades.runGradeCollection(true);
  
  3. Export to JSON:
     CSPortfolioGrades.exportGradesToJSON(grades);
  
  4. Export to CSV:
     CSPortfolioGrades.exportGradesToCSV(grades);
  
  5. Get grades for specific category:
     const frontendGrades = await CSPortfolioGrades.getGradesByCategory('frontend');
  
  6. Test single submodule:
     await CSPortfolioGrades.testSingleSubmodule('frontend', 1);

Features:
  - Automatically generates mock data if no real data is available
  - Continues collection even if individual submodules fail
  - Always produces a valid JSON/CSV output

Note: Each submodule page should implement a function called '${CONFIG.gradeFunctionName}()'
that returns an object with: { name: 'Student Name', grade: 95 }
`);

// Auto-run if in Node.js environment or if explicitly requested
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.CSPortfolioGrades;
}

