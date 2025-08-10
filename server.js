const express = require('express');
const App = express();
const path = require('path');
const cors = require('cors');
const fs = require('fs');

App.use(cors({
  origin: 'http://localhost:3000'
}));

App.use(express.json());


App.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, 'users.json'));
});

App.post('/users', (req, res) => {
  const users = req.body;
  const filePath = path.join(__dirname, 'users.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    const userData = JSON.parse(data);
    userData.push(users);
    fs.writeFile(filePath, JSON.stringify(userData), (err) => {
      if (err) {
        return res.status(500).send('Error writing to file');
      }
      res.status(201).send(users);
    });
  });
});

App.put('/edit', (req, res) => {
  const users = req.body;
  const filePath = path.join(__dirname, 'users.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error has rasised in the server');
    }
    const userData = JSON.parse(data);
    userData.forEach((user, index) => {
      if (user.id === users.id) {
        userData[index] = users;
      }
    });
    fs.writeFile(filePath, JSON.stringify(userData), (err) => {
      if (err) {
        return res.status(500).send('Error writing to file');
      }
    });
  });
});

App.delete('/delete/:id', (req, res) => {
  const filePath = path.join(__dirname, 'users.json');
  const id = req.params.id;

  fs.readFile(filePath, 'utf8', (err, data) => {

    if (err) {
      console.log("Error in reading a file", err);
      return res.status(500).send('Error has rasised in the server');
    }
    const userData = JSON.parse(data);
    let updatedUserData = userData.filter(user => user.id != id);
    console.log(updatedUserData);

    if (updatedUserData != null) {
      fs.writeFile(filePath, JSON.stringify(updatedUserData), (err) => {
        if (err) {
          console.error("Error writing file", err);
          return res.status(500).send('Error saving updated data');
        }
        res.sendFile(path.join(__dirname, 'users.json'));
      });
    }

  });
});

const PORT = process.env.PORT || 3000;

App.listen(PORT , () => {
  console.log(`Server running on port ${PORT}`);
});