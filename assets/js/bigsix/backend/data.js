// ============================================================
//  data.js — All lesson content
//  Path: assets/js/bigsix/backend/data.js
// ============================================================

export const CONFIG = {

    STORAGE_KEY: 'bigsix_backend_lesson',
  
    STEP_LABELS: ['Fundamentals','Databases & APIs','Frameworks','API Testing','Advanced','FRQ'],
  
    QUIZZES: {
      quiz1: [
        {
          q: 'In the backend request lifecycle, what happens FIRST?',
          opts: ['Write to the database','Run business logic in the Service layer','Authenticate and validate the incoming request','Return a JSON response'],
          a: 2,
          explanation: 'Authentication and validation always happen before any data is read or written.',
        },
        {
          q: 'Which layer is responsible for business logic in a layered backend?',
          opts: ['Controller','Repository','Service','Database'],
          a: 2,
          explanation: 'The Service layer owns business logic. Controllers handle routing, Repositories handle database access.',
        },
        {
          q: 'What is the correct order of layers in a Spring Boot request?',
          opts: ['Database → Service → Controller → Client','Client → Controller → Service → Repository → Database','Client → Service → Controller → Database','Controller → Client → Repository → Service'],
          a: 1,
          explanation: 'Request flows: Client → Controller → Service → Repository → Database.',
        },
      ],
      quiz3: [
        {
          q: 'Which framework is better suited for a machine learning model serving API?',
          opts: ['Spring Boot','Flask','Neither — use a database directly','Both are equally suited'],
          a: 1,
          explanation: 'Flask is lightweight and Python-native, making it the natural choice for serving ML models.',
        },
        {
          q: 'In Spring Boot, where should database queries live?',
          opts: ['In the Controller method','In the Service class','In the Repository interface','Inline in the HTML template'],
          a: 2,
          explanation: 'The Repository layer handles all database access via Spring Data JPA.',
        },
        {
          q: 'What does @RestController do in Spring Boot?',
          opts: ['Marks the class as a database entity','Combines @Controller and @ResponseBody — returns JSON automatically','Creates a new database table','Injects a dependency'],
          a: 1,
          explanation: '@RestController tells Spring that every method returns JSON data directly.',
        },
      ],
      quiz5: [
        {
          q: 'What is the main advantage of serverless functions over traditional servers?',
          opts: ['They are always faster','They scale to zero and you only pay for actual usage','They never have cold starts','They require no code'],
          a: 1,
          explanation: 'Serverless functions scale to zero when not in use — you pay nothing for idle time.',
        },
        {
          q: 'In JWT authentication, where is the user identity stored?',
          opts: ['In a server-side session database','In the token itself, signed by the server','In a cookie set by the browser','In the request URL'],
          a: 1,
          explanation: 'JWT encodes user identity in the token. The server signs it so the client cannot tamper with it.',
        },
        {
          q: 'What is Redis primarily used for in a backend stack?',
          opts: ['Storing permanent user records','Caching frequent queries in memory for fast retrieval','Running serverless functions','Managing JWT secrets'],
          a: 1,
          explanation: 'Redis caches expensive query results so subsequent requests respond in microseconds.',
        },
      ],
    },
  
    VOCAB: {
      vocab2: [
        { clue: 'HTTP method used to CREATE a new resource',      hint: '4 letters',       answer: 'POST'   },
        { clue: 'HTTP method used to READ / retrieve data',       hint: '3 letters',       answer: 'GET'    },
        { clue: 'HTTP method used to UPDATE an existing resource',hint: '3 letters',       answer: 'PUT'    },
        { clue: 'HTTP method used to REMOVE a resource',          hint: '6 letters',       answer: 'DELETE' },
        { clue: 'Status code range meaning success',              hint: 'e.g. 2XX',        answer: '2XX'    },
        { clue: 'Status code range meaning client error',         hint: 'e.g. 4XX',        answer: '4XX'    },
      ],
    },
  
    FRQS: [
      {
        id: 'frq1',
        question: 'Explain the difference between authentication and authorization. Give a real-world example of each in a web application.',
        rubric: ['authentication','authorization','example','difference'],
      },
      {
        id: 'frq2',
        question: 'Describe when you would choose Flask over Spring Boot for a backend project. What factors influence that decision?',
        rubric: ['flask','spring','microservice','scale','python','java'],
      },
    ],
  
    API_ENDPOINTS: [
      { value: 'GET:/api/users',      label: 'GET /api/users'              },
      { value: 'GET:/api/users/1',    label: 'GET /api/users/1'            },
      { value: 'POST:/api/users',     label: 'POST /api/users'             },
      { value: 'PUT:/api/users/1',    label: 'PUT /api/users/1'            },
      { value: 'DELETE:/api/users/1', label: 'DELETE /api/users/1'         },
      { value: 'GET:/api/invalid',    label: 'GET /api/invalid (404)'      },
      { value: 'POST:/api/users/bad', label: 'POST /api/users (invalid → 400)' },
    ],
  
    API_RESPONSES: {
      'GET:/api/users': {
        status: 200, time: 42,
        hint: '200 OK — returned a list of all users.',
        body: JSON.stringify([
          { id:1, name:'Alice Johnson', email:'alice@example.com', role:'admin' },
          { id:2, name:'Bob Smith',     email:'bob@example.com',   role:'user'  },
          { id:3, name:'Carol White',   email:'carol@example.com', role:'user'  },
        ], null, 2),
      },
      'GET:/api/users/1': {
        status: 200, time: 18,
        hint: '200 OK — returned a single user object by ID.',
        body: JSON.stringify({ id:1, name:'Alice Johnson', email:'alice@example.com', role:'admin', createdAt:'2024-01-15' }, null, 2),
      },
      'POST:/api/users': {
        status: 201, time: 67,
        hint: '201 Created — the server created a new resource and returned it.',
        body: JSON.stringify({ id:4, name:'Dave Lee', email:'dave@example.com', role:'user' }, null, 2),
      },
      'PUT:/api/users/1': {
        status: 200, time: 55,
        hint: '200 OK — the resource was updated.',
        body: JSON.stringify({ id:1, name:'Alice Johnson-Updated', email:'alice.new@example.com', role:'admin' }, null, 2),
      },
      'DELETE:/api/users/1': {
        status: 204, time: 31,
        hint: '204 No Content — deletion was successful. No body is returned.',
        body: '',
      },
      'GET:/api/invalid': {
        status: 404, time: 12,
        hint: '404 Not Found — the endpoint does not exist.',
        body: JSON.stringify({ error:'Not Found', status:404 }, null, 2),
      },
      'POST:/api/users/bad': {
        status: 400, time: 9,
        hint: '400 Bad Request — the request body was missing required fields.',
        body: JSON.stringify({ error:'Bad Request', details:['name is required','email must be valid'] }, null, 2),
      },
    },
  };