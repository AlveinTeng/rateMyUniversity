# team36

## Overview
This is a project of CSC309 at University of Toronto made by JiaKai Shi, Minxuan Teng, Meilin Yang and Jiayi Zeng. There's a deployed website https://afternoon-cove-20429.herokuapp.com/ on herokuapp.com which serves only for academic purposes. 

Our website provides a platform for rating universities all over the world. prospective students would be able to see rankings of schools they are deciding on. The ratings and comments students assign to their universities gives prospective students a more detailed and authentic view of the universities.

### Install Dependencies
Before running this app, you need Type these commands in command shell:
<pre><code> 
$(the path of folder containing our project)/testProject>
npm install
$(the path of folder containing our project)/testProject/client>
npm install @material-ui/core
npm install  @material-ui/icons
npm install @material-ui/lab
npm install react-router-dom
npm install
</code></pre>
Or you can just type "npm run setup" at the root path of the project(Where you can see "server.js").

### Run App
Open your command shell and locate to client folder
<pre><code>
$(the path of folder containing our project)/testProject/client>
npm run build
</code>
</pre>
Open a new command shell and locate to testProject folder
<pre><code>
$(the path of folder containing our project)/testProject>
node server.js	
</code>
</pre>
Or you can just type "npm run build-run" at the root path of the project(Where you can see "server.js").
then, you can access our page on http://localhost:5000/

## How to use
- If the user is new to the website, on the top right corner of each page, links for LOGIN/SIGNUP will be shown.
Users can login to access profile page, rate universites and comment others' comments.
- Without login, user can also search universities and check current rank of universities.

### SignUp Page
For users who do not have an account yet, they can create an account on this page. After sign up for an account, sign in page will be re-directed.

### SignIn Page
Users can sign in their existing account, and User page will be re-directed.

### Search Page
An end users logged in would be able to search for universities by name.

### University Page
Users would be able to post ratings for universities, post comments under universities, and reply to other comments.

### User Page
Users would be able to change their profile (their school and year of study), change their profile picture, view their past ratings and favorite universities, and change their password. Comparing to normal users, admin are able to block users, delete inappropriate comments and invalid ratings.

### User's Notification Page
Users would be able to view all comments replying to theirs.

### Rank Page
Users can see current Top 5 universities for general rating and each category ratings, which are Safety, Workload, Location, Facilities, Opportunity and Clubs. Cliking the name of one university will re-direct to this university's page.

### Rate Page
Users can access a university's Rate Page by clicking the rate buttom on University Page. On Rate Page, users may add stars for each category, which we described previously. 1-Star means poor, 5-Star means strong. After adding stars to all categories, users are asked to leave comments about why they rate like that.

---
## Overview of Routes
### USERS 
- POST 127.0.0.1:5000/api/users </br>
Route for adding regular user</br>
Request body expects </br>
{ </br>
   "name": String,</br>
   "password": String</br>
} </br>
Returned JSON is the database document added.

- POST 127.0.0.1:5000/users/login </br>
Route for login regular user</br>
Request body expects </br>
{ </br>
   "name": String,</br>
   "password": String</br>
} </br>

### RATINGS
- POST 127.0.0.1:5000/api/ratings </br>
Route for adding new ratings, notice that before adding new universities, the university's rating must be added first.</br>

### UNIVERSITY
- POST 127.0.0.1:5000/api/universities </br>
Route for adding new universities</br>
{ </br>
    "name": String, </br>
    "address": String, </br>
    "description": String, </br>
    "rating": String </br>
} </br>
Returned JSON is the database document added.


## Login Credentials
### Normal user  
username: user  
password: user  
### Admin  
username: admin  
password: admin 




