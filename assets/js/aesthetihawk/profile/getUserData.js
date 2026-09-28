// import config for api urls and fetch options
import { pythonURI, javaURI, fetchOptions } from '../../api/config.js';

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
    let businessEmail = null;

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

    // Mentor accounts exist only in Spring, so Flask has no row for them; read the
    // profile from Spring's session instead.
    if (!uid) {
        try {
            const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
            if (response.ok) {
                const person = await response.json();
                name = person.name;
                uid = person.uid;
                email = person.email;
                sid = person.sid;
                kasmServerNeeded = person.kasmServerNeeded;
                pfp = person.pfp;
                businessEmail = person.businessEmail;
            } else {
                console.error('error fetching Spring profile:', response.status);
            }
        } catch (error) {
            console.error('error fetching Spring profile:', error.message);
        }
    }

    // return all data in an array
    return [name, uid, email, sid, kasmServerNeeded, pfp, school, businessEmail];
}