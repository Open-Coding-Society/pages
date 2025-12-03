// Module to add/remove the three allowed courses via the Python API
import { postUpdate, deleteData } from '{{site.baseurl}}/assets/js/api/profile.js';
import { pythonURI } from '{{site.baseurl}}/assets/js/api/config.js';

const ALLOWED = ['CSA', 'CSP', 'CSSE'];

export async function addCourse(name) {
    if (!name || !ALLOWED.includes(name)) {
        throw new Error('Invalid course name');
    }

    // Use existing helper to POST to Python API
    await postUpdate({
        URL: pythonURI + '/api/user/class',
        body: { classes: [name] }
    });

    return true;
}

export async function removeCourse(name) {
    if (!name || !ALLOWED.includes(name)) {
        throw new Error('Invalid course name');
    }

    await deleteData({
        URL: pythonURI + '/api/user/class',
        body: { classes: [name] }
    });

    return true;
}

export async function clearCourses() {
    // Call DELETE with no body to clear all classes (server treats missing classes as clear-all)
    await deleteData({
        URL: pythonURI + '/api/user/class'
    });
    return true;
}
