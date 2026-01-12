// import config for api urls and fetch options
import { pythonURI, fetchOptions } from '../../api/config.js';

// fetches all profile data and returns it as an array
export async function getUserData() {
    // api url for fetching data - USE FLASK BACKEND FOR READING
    const pythonURL = pythonURI + "/api/id";

    let name = null;
    let uid = null;
    let email = null;
    let sid = null;
    let kasmServerNeeded = null;
    let pfp = null;
    let school = null;

    // get the flask data (READ OPERATION)
    try {
        const response = await fetch(pythonURL, fetchOptions);
        if (response.ok) {
            const data = await response.json();

            // set the data from Flask backend
            name = data.name;
            uid = data.uid;
            email = data.email;
            sid = data.sid;
            kasmServerNeeded = data.kasm_server_needed;
            pfp = data.pfp;
            school = data.school;
        } else {
            console.error('error fetching data:', response.status);
        }
    } catch (error) {
        console.error('error fetching data:', error.message);
    }

    // return all data in an array
    return [name, uid, email, sid, kasmServerNeeded, pfp, school];
}