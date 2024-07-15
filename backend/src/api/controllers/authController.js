const userAuth = require('../../models/userAuth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const exists = await userAuth.findOne({ username: username });
        if (exists) {
            return res.status(409).json({ message: "Username already taken" });
        }
        const user = new userAuth({ username, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userAuth.findOne({ username: username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token });
    
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error });
    }
};
