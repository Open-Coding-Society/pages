// import config for api urls and fetch options
import { javaURI, fetchOptions } from '../../api/config.js';

// fetches all profile data and returns it as an array
export async function getUserData() {
    // api url for fetching data
    const javaURL = javaURI + "/api/person/get";

    let name = null;
    let uid = null;
    let email = null;
    let sid = null;
    let kasmServerNeeded = null;
    let pfp = null;

    // get the java data (email & kasm)
    try {
        const javaResponse = await fetch(javaURL, fetchOptions);
        if (javaResponse.ok) {
            const javaData = await javaResponse.json();

            // set the data
            name = javaData.name;
            uid = javaData.uid;
            email = javaData.email;
            sid = javaData.sid;
            kasmServerNeeded = javaData.kasmServerNeeded;
            pfp = javaData.pfp;
        } else {
            console.error('error fetching data:', javaResponse.status);
        }
    } catch (error) {
        console.error('error fetching data:', error.message);
    }

    // return all data in an array
    return [name, uid, email, sid, kasmServerNeeded, pfp];
}