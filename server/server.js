const express = require('express');
const session = require('express-session');
const SqliteStore = require('better-sqlite3-session-store')(session);
const db = require('./database');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config()

app.use(express.static('public'));
app.use(express.json());
app.use(session({
    store: new SqliteStore({client: db, expired: {clear: true, intervalMs: 15*60*1000 }}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

function requirelogin(req, res, next){
    if(!req.session.loggedIn){
        return res.status(401).json({success: false, message: 'Login is Required'});
    };
    next();
};

app.post('/signup', async (req, res) =>{
    const {username, password} = req.body;

    if (!username || !password){
        return res.status(400).json({success: false, message: 'Please Enter a Username and Password'});
    };

    const hashedPass = await bcrypt.hash(password, 10);

    try{
        const addUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPass);
        
        req.session.loggedIn = true;
        req.session.username = username;
        req.session.userId = addUser.lastInsertRowid;
        
        return res.status(201).json({ success: true, message: 'User Added Successfully'});


    } catch (err) {
        return res.status(400).json({success: false, message: 'Username Already Exists'});
    };
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if(!user){
        return res.status(401).json({success: false, message: "Invalid username or password"});
    }

    const comparePass = await bcrypt.compare(password, user.password);

    if(!comparePass){
        return res.status(401).json({success: false, message: 'Invalid username or password'});
    }

    req.session.loggedIn = true;
    req.session.username = username;
    req.session.userId = user.id;

    return res.status(200).json({success: true, message: 'Logged in Successfully'});
});

app.post('/logout', (req, res) => { 
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({success: false, message: 'Could not Log Out, Please try again'});
        }

        res.clearCookie('connect.sid');

        return res.status(200).json({success: true, message: 'logged out Successfully'});
    });
});

app.get('/api/categories', requirelogin, (req, res) => {
    try{
        const selectAll = db.prepare('SELECT * FROM categories WHERE user_id = ?').all(req.session.userId);
        return res.json({success: true, data: selectAll});
    }catch(err) {
        return res.status(500).json({success: false, message: 'Server Error, Please try again'});
    }
});

app.post('/api/categories', requirelogin, (req, res) => {
    const {title} = req.body;

    if (!title){
        return res.status(400).json({success: false, message: 'Title is required'});
    }

    try{
        const addCategory = db.prepare('INSERT INTO categories (title, user_id) VALUES (?, ?)');
        const info = addCategory.run(title, req.session.userId);

        const createdCategory = {
            id: info.lastInsertRowid,
            title: title,
            user_id: req.session.userId
        };

        return res.status(201).json({success: true, 
                                    message: 'Category added Successfully',
                                    data: createdCategory});
    } catch(err){
        return res.status(500).json({success: false, message: 'Server Error, Please try again'});
    }
});

app.delete('/api/categories/:id', requirelogin, (req, res) =>{
    try {
        const deleteCategory = db.prepare('DELETE FROM categories WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);

        if (deleteCategory.changes === 0){
            return res.status(404).json({success: false, message:'Category Not Found'});
        }

        return res.status(200).json({success: true, message: 'Category Deleted Successfully'});
    } catch (err) {
        return res.status(500).json({success: false, message:'Server Error, Please try again'});
    }
});

app.get('/api/notes', requirelogin, (req, res) => {
    try {
        let selectAll;
        if(req.query.category){
            selectAll = db.prepare('SELECT * FROM notes WHERE user_id = ? AND category_id = ?').all(req.session.userId, req.query.category);
        }else{
            selectAll = db.prepare('SELECT * FROM notes WHERE user_id = ?').all(req.session.userId);
        }
        return res.json({success: true, data: selectAll});
    } catch (error) {
        return res.status(500).json({success: false, message:'Server Error, Please try again'});
    }
});

app.post('/api/notes', requirelogin, (req, res) => {
    let {title, content, category} = req.body;

    if(!title){
        title = 'Untitled';
    }
    
    if(!category){
        category = NaN;
    }

    try {
        const addNote = db.prepare('INSERT INTO notes (title, content, user_id, category_id) VALUES (?, ?, ?, ?)');
        const info = addNote.run(title, content, req.session.userId, category);

        const addedNote = {
            id: info.lastInsertRowid,
            title: title,
            content: content,
            user_id: req.session.userId,
            category_id: category
        };

        return res.status(201).json({success: true, message: 'Note Added Successfully', data: addedNote});
    } catch (error) {
        return res.status(500).json({success: false, message:'Server Error, Please try again'});
    }
});

app.put('/api/notes/:id', requirelogin, (req, res) => {
    const { title, content } = req.body;
    
    try {
        if (title === undefined && content === undefined) {
            return res.status(400).json({ success: false, message: 'No update data provided' });
        }

        let info;
        if (title !== undefined && content !== undefined) {
            info = db.prepare('UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?')
                .run(title, content, req.params.id, req.session.userId);
        } else if (title !== undefined) {
            info = db.prepare('UPDATE notes SET title = ? WHERE id = ? AND user_id = ?')
                .run(title, req.params.id, req.session.userId);
        } else {
            info = db.prepare('UPDATE notes SET content = ? WHERE id = ? AND user_id = ?')
                .run(content, req.params.id, req.session.userId);
        }

        if (info.changes === 0) {
            return res.status(404).json({ success: false, message: 'Problem Occurred or Note Not Found' });
        }

        return res.status(200).json({ success: true, message: 'Updated Note Successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error, Please try again' });
    }
});

app.delete('/api/notes/:id', requirelogin, (req, res) => {
    try {
        const deleteNote = db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?')
            .run(req.params.id, req.session.userId);

        if(deleteNote.changes === 0){
            return res.status(404).json({ success: false, message: 'Problem Occurred or Note Not Found' });
        }

        return res.status(200).json({ success: true, message: 'Deleted Note Successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error, Please try again' });
    }
});

app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});