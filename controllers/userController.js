const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../config/dbConnection');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const logger = require('../controllers/logger');

const randomstring = require('randomstring');
const sendMail = require('../helpers/sendMail');

const register = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    if (!req.body.email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    if (!req.body.password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Hashing error:", err);  
            return res.status(500).json({ error: 'Error hashing password', details: err.message });
        }

        const query = `INSERT INTO users (name, email, password) VALUES ('${req.body.name}', '${req.body.email}', '${hashedPassword}')`;
        

        db.query(query, (err, result) => {
            if (err) {
                console.error("Database error:", err);  // Log the error for debugging
                return res.status(500).json({ error: 'Database error', details: err.message });
            }
            
            let mailSubject = 'Mail Verification';
            const randomToken = randomstring.generate();
            const content = `
            <p>Hello ${req.body.name},</p>
            <p>Please <a href="http://localhost:3000/mail-verification?token=${randomToken}">verify</a> your email.</p>
            `;

               
            sendMail(req.body.email, mailSubject, content);
            db.query('UPDATE users set token=? where email=?', [randomToken, req.body.email], function(error, result){
                if (error) {
                      
                    return res.status(400).send({ msg:error });
                }

            });
            return res.status(200).json({ message: 'User registered successfully' });
            
        });
    });
};

const login = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    db.query(`SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`, (err, result) => {
        if(err)
        {
            return res.status(400).send({
                msg:err
            });
        }
        if(!result.length)
        {
            logger.userLogger.log('error', 'Email or Password is incorrect!');
            return res.status(401).send({
                msg:'Email or Password is incorrect!'
            });
            
        }

        bcrypt.compare(
            req.body.password,
            result[0]['password'],
            (bErr, bResult) => {
             if(bErr)
                {
                    return res.status(400).send({
                        msg:bErr
                    });
                }
              if(bResult)
                {
                   const token = jwt.sign({ id: result[0]['id'], is_admin:result[0]['is_admin']}, JWT_SECRET, { expiresIn: '1h' });
                   db.query(
                    `UPDATE users SET last_login = NOW(), token = '${token}' WHERE id = ${result[0]['id']}`
                    );

                    logger.userLogger.log('info', 'Logged in successfully!');
                   return res.status(200).send({
                    msg:"Logged in",
                    token,
                    user: result[0]
                   });

                
                }  
                logger.userLogger.log('error', 'Email or Password is incorrect!');
                return res.status(401).send({
                    msg:"Email or Password is incorrect!"
                });
            }
        );

    });

};

const verifyMail = (req, res) => {

    var token = req.query.token;
    db.query('SELECT * FROM users where token=? limit 1', token, function(error,result, fields){

       if(error)
        {
            console.log(error.message);
        } 
        if(result.length > 0)
        {
            db.query(
                `UPDATE users SET is_verified = 1, token = 'null' WHERE id = ${result[0]['id']}`
                );

               return res.render('mail-verification', { message: 'Mail verified successfully!' });
        }
        else
        {
            return res.render('404');
        }

    })

}
module.exports = {
    register,
    login,
    verifyMail
};
