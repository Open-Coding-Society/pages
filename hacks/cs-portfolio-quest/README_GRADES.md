# CS Portfolio Quest - Grade Collection System

A robust JavaScript-based system for collecting student names and grades from all submodules across the CS Portfolio Quest learning platform.

## 🎯 Features

- ✅ **Automatic Grade Collection** - Visits all 30 submodules and collects student data
- 🎲 **Mock Data Generation** - Generates realistic test data when real data isn't available
- 🛡️ **Error Resilient** - Continues collection even if individual submodules fail
- 📊 **Multiple Export Formats** - Export to JSON or CSV
- 🎨 **Beautiful Dashboard** - Visual interface for grade collection and management
- 📈 **Real-time Progress** - Live updates during collection process

## 📁 Files

### Core Files
- **`grades.js`** - Main grade collection engine (447 lines)
- **`grade-collection-dashboard.html`** - Web-based dashboard UI (501 lines)
- **`GRADING_IMPLEMENTATION_GUIDE.md`** - Guide for implementing grading in submodules (416 lines)
- **`README_GRADES.md`** - This file

## 🚀 Quick Start

### Option 1: Use the Dashboard (Recommended)

1. Open `grade-collection-dashboard.html` in a web browser
2. Click **"Collect All Grades"** to start collection
3. Click **"Generate Mock Data"** to test with sample data
4. Export results as JSON or CSV

### Option 2: Use Browser Console

```javascript
// Collect all grades with automatic mock fallback
const grades = await CSPortfolioGrades.runGradeCollection();

// Force mock data generation
const mockGrades = await CSPortfolioGrades.runGradeCollection(true);

// Export to JSON
CSPortfolioGrades.exportGradesToJSON(grades);

// Export to CSV
CSPortfolioGrades.exportGradesToCSV(grades);
```

## 📊 Data Structure

### Output JSON Format

```json
{
  "metadata": {
    "collectionDate": "2025-10-30T12:00:00.000Z",
    "totalSubmodules": 30,
    "baseUrl": "http://localhost:4000",
    "mode": "live"
  },
  "summary": {
    "total": 30,
    "successful": 5,
    "mock": 25,
    "notImplemented": 0,
    "errors": 0,
    "uniqueStudents": ["Alex Smith", "Jordan Brown"],
    "usingMockData": false
  },
  "gradesByCategory": {
    "frontend": [...],
    "backend": [...],
    "data-viz": [...],
    "resume": [...],
    "ai": [...],
    "analytics": [...]
  },
  "allGrades": [
    {
      "category": "frontend",
      "submodule": 1,
      "permalink": "/cs-portfolio-quest/frontend/submodule_1/",
      "team": "Creators",
      "status": "success",
      "studentName": "Alex Smith",
      "grade": 95,
      "timestamp": "2025-10-30T12:00:00.000Z"
    }
  ]
}
```

## 🎓 Submodule Coverage

The system collects grades from **30 submodules** across **6 categories**:

| Category | Submodules | Team |
|----------|-----------|------|
| Frontend Development | 6 | Creators |
| Backend Development | 6 | Encrypters |
| Data Visualization | 3 | Applicators |
| Resume Building | 6 | Grinders |
| AI Usage | 6 | Thinkers |
| Analytics/Admin | 3 | Curators |

## 🔧 Implementation for Submodules

Each submodule should implement this function:

```javascript
function getStudentGrade() {
    return {
        name: "Student Name",    // or localStorage.getItem('studentName')
        grade: 85                 // Score between 0-100
    };
}

// Make it globally accessible
window.getStudentGrade = getStudentGrade;
```

See `GRADING_IMPLEMENTATION_GUIDE.md` for detailed examples and best practices.

## 🎲 Mock Data

The system automatically generates mock data in three scenarios:

1. **Forced Mock Mode** - When explicitly requested
2. **Fallback Mode** - When no real data is collected
3. **Emergency Mode** - When catastrophic errors occur

Mock data includes:
- 5 randomly generated student names
- Realistic grades (60-100)
- Proper data structure
- Clear labeling as "mock" data

## 📈 Dashboard Features

### Control Panel
- **Collect All Grades** - Attempt to collect from all submodules
- **Generate Mock Data** - Create test data instantly
- **Export JSON** - Download results as JSON file
- **Export CSV** - Download results as CSV file
- **Clear Results** - Reset the dashboard

### Status Display
- Total submodules processed
- Successful collections
- Not implemented count
- Error count
- Unique students found
- Mock data count

### Student Results
- Student name and average grade
- Submodules completed per category
- Category-wise performance breakdown
- Visual grade cards

## 🛠️ API Reference

### Core Functions

#### `runGradeCollection(forceMock)`
Main entry point for grade collection.
- **Parameters:** `forceMock` (boolean) - Force use of mock data
- **Returns:** Promise resolving to complete grade data object

#### `collectAllGrades(submodules, useMockData)`
Collects grades from specified submodules.
- **Parameters:** 
  - `submodules` (array) - Submodule configurations
  - `useMockData` (boolean) - Whether to use mock data
- **Returns:** Promise resolving to grade data

#### `getGradesByCategory(category)`
Get grades for a specific category.
- **Parameters:** `category` (string) - Category name
- **Returns:** Promise resolving to category-specific grades

#### `organizeGradesByStudent(gradeData)`
Reorganize grades by student name.
- **Parameters:** `gradeData` (object) - Grade data from collection
- **Returns:** Object with grades organized by student

#### `exportGradesToJSON(gradeData, filename)`
Export grades to JSON file.
- **Parameters:**
  - `gradeData` (object) - Grade data to export
  - `filename` (string) - Output filename (default: 'cs-portfolio-grades.json')

#### `exportGradesToCSV(gradeData, filename)`
Export grades to CSV file.
- **Parameters:**
  - `gradeData` (object) - Grade data to export
  - `filename` (string) - Output filename (default: 'cs-portfolio-grades.csv')

### Testing Functions

#### `testSingleSubmodule(category, submoduleNum)`
Test a single submodule.
- **Parameters:**
  - `category` (string) - Category name (e.g., 'frontend')
  - `submoduleNum` (number) - Submodule number (1-6)
- **Returns:** Promise resolving to test result

#### `generateMockStudents(count)`
Generate mock student names.
- **Parameters:** `count` (number) - Number of students to generate
- **Returns:** Array of student names

#### `generateMockGrade(submodule, studentName)`
Generate a mock grade for a submodule.
- **Parameters:**
  - `submodule` (object) - Submodule configuration
  - `studentName` (string) - Student name
- **Returns:** Mock grade object

## 🔍 Status Codes

Each grade entry has a status indicating the collection result:

- **`success`** - Real data successfully collected from submodule
- **`mock`** - Mock data generated for testing
- **`not_implemented`** - Submodule doesn't have grading function yet
- **`error`** - Error occurred during collection
- **`timeout`** - Page took too long to load

## 🎨 Collection Modes

### Live Mode
```javascript
const grades = await CSPortfolioGrades.runGradeCollection(false);
// Attempts to collect real data, falls back to mock if needed
```

### Mock Mode
```javascript
const grades = await CSPortfolioGrades.runGradeCollection(true);
// Generates mock data without attempting collection
```

### Category-Specific
```javascript
const frontendGrades = await CSPortfolioGrades.getGradesByCategory('frontend');
// Collects only from frontend submodules
```

## 📊 CSV Export Format

The CSV export includes these columns:
- Category
- Submodule
- Team
- Status
- Student Name
- Grade
- Permalink

Example:
```csv
Category,Submodule,Team,Status,Student Name,Grade,Permalink
frontend,1,Creators,success,"Alex Smith",95,"http://localhost:4000/cs-portfolio-quest/frontend/submodule_1/"
backend,2,Encrypters,mock,"Jordan Brown",87,"http://localhost:4000/cs-portfolio-quest/backend/submodule_2/"
```

## 🚨 Error Handling

The system is designed to be resilient:

1. **Individual Errors** - Continues collection if one submodule fails
2. **Timeout Protection** - 5-second timeout per submodule
3. **Automatic Fallback** - Uses mock data if collection fails
4. **Try-Catch Blocks** - Graceful error handling throughout
5. **Emergency Mock Data** - Always produces valid output

## 🔐 Security & Privacy

- All collection happens client-side
- No data sent to external servers
- Uses iframes for isolated submodule access
- localStorage for data persistence
- No sensitive data exposure

## 📝 localStorage Keys

Submodules should use consistent naming:
```javascript
// Global
localStorage.setItem('studentName', 'John Doe');

// Per Submodule
localStorage.setItem('frontend-submodule-1-score', '95');
localStorage.setItem('frontend-submodule-1-completed', 'true');
```

## 🧪 Testing

### Test the System
```javascript
// Test mock generation
const mockStudents = CSPortfolioGrades.generateMockStudents(10);
console.log(mockStudents);

// Test single submodule
await CSPortfolioGrades.testSingleSubmodule('frontend', 1);

// Test full collection with mock
const testData = await CSPortfolioGrades.runGradeCollection(true);
console.log(testData);
```

## 📚 Resources

- **Implementation Guide**: `GRADING_IMPLEMENTATION_GUIDE.md`
- **Dashboard**: `grade-collection-dashboard.html`
- **Source Code**: `grades.js`

## 🎯 Use Cases

1. **Teacher/Admin** - Collect all student grades for reporting
2. **Student** - Track progress across all modules
3. **Developer** - Test grading implementation
4. **Demo** - Show system with mock data
5. **Analytics** - Export data for analysis

## 🤝 Contributing

To add grading to a new submodule:

1. Read `GRADING_IMPLEMENTATION_GUIDE.md`
2. Implement `getStudentGrade()` function
3. Test with `testSingleSubmodule()`
4. Verify in dashboard

## 📞 Support

For issues or questions:
1. Check the Implementation Guide
2. Test with mock data first
3. Verify localStorage keys
4. Check browser console for errors

## 🎉 Example Workflows

### Workflow 1: Teacher Collecting Grades
```javascript
// Open dashboard
// Click "Collect All Grades"
// Review results
// Click "Export CSV"
// Open in Excel/Sheets
```

### Workflow 2: Developer Testing
```javascript
// Generate mock data
const test = await CSPortfolioGrades.runGradeCollection(true);

// Verify structure
console.log(test.summary);

// Export for inspection
CSPortfolioGrades.exportGradesToJSON(test);
```

### Workflow 3: Student Checking Progress
```javascript
// Open specific category
const myGrades = await CSPortfolioGrades.getGradesByCategory('frontend');

// Organize by student
const progress = CSPortfolioGrades.organizeGradesByStudent(myGrades);
console.log(progress);
```

## ⚡ Performance

- Processes 30 submodules in ~15 seconds (live mode)
- Instant generation in mock mode
- 100ms delay between submodules to avoid overload
- 5-second timeout per submodule
- Minimal memory footprint

## 🔮 Future Enhancements

Potential improvements:
- Real-time progress updates
- Grade history tracking
- Student authentication
- Backend API integration
- Email report generation
- Chart visualizations
- Grade comparison tools

---

**Version:** 1.0.0  
**Last Updated:** October 30, 2025  
**Author:** CS Portfolio Quest Development Team

