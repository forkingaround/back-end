const express = require('express');
const knex = require('knex');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = 5000; // Choose any port number you prefer

// Create a Knex instance with PostgreSQL configuration
const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: '1234',
        database: 'volonter',
    },
});

// Serve static files from the "assets" folder
app.use('/images', express.static(path.join(__dirname, 'assets/images')));

/*
// Create a route that will return your data
app.get('/data', (req, res) => {
    // Replace this with your actual data retrieval logic
    const data = {
        message: 'Hello, world!',
    };

    // Return the data as JSON
    res.json(data);
});

app.get('/mountain', async (req, res) => {
    try {
        const result = await db('images').select('url').where('id', 1); // Modify the table name and query condition as per your setup
        const imageUrl = result[0].url;
        res.json({ imageUrl });

    } catch (error) {
        console.error('Error retrieving image URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});*/

app.post('/register', (req, res) => {
    try {
        const data = req.body;
        console.log('Received JSON:', data);
        res.status(200).json({ message: 'Received JSON successfully' });
        db('users')
            .insert(data)
            .then(() => {
                console.log('Row inserted successfully.');
                //db.destroy(); // Close the database connection
            })
            .catch((error) => {
                console.error('Error inserting row:', error);
                //db.destroy(); // Close the database connection
            });
    } catch (error) {
        console.error('Error handling JSON:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/newproject', (req, res) => {
    try {
        const data = req.body;
        console.log('Received JSON:', data);
        res.status(200).json({ message: 'Received JSON successfully' });
        db('projects')
            .insert(data)
            .then(() => {
                console.log('Row inserted successfully.');
                //db.destroy(); // Close the database connection
            })
            .catch((error) => {
                console.error('Error inserting row:', error);
                //db.destroy(); // Close the database connection
            });
    } catch (error) {
        console.error('Error handling JSON:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//retrieve data fro project page
app.get('/project', async (req, res) => {
    const projectId = req.query.id;
    // console.log(projectId);
    // Retrieve the project data based on the projectId
    try {
        const result = await db('projects').select('*').where('project_id', projectId);
        console.log('retrieved:', result);
        const projectTitle = result[0].title;
        const teaserText = result[0].teaser;
        res.json({ id: projectId, title: projectTitle, teaser: teaserText });

    } catch (error) {
        console.error('Error retrieving image URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    // Process the data as needed

    // Send the project data as the response to the client
    //res.json({ id: projectId, name: 'Project A' });
});

app.get('/deleteproject', async (req, res) => {
    const projectId = req.query.id;
    const result = await db('projects').where('project_id', '=', projectId)
        .del()
        .then((res) => {
            res.json();
            console.log('Row deleted successfully');
        })
        .catch((error) => {
            console.error(error);
        });
});

app.get('/dashboard-view-projects', async (req, res) => {

    await db.select('*').from('projects')
        .then((rows) => {
            //console.log(rows);
            res.json(rows);
        })
        .catch((error) => {
            console.error(error);
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
