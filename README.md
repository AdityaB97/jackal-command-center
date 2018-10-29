# Remote Robot Monitor

## About

[Link to Webpage](https://jackal-command-center.herokuapp.com/)

This is a web interface that [we](http://rail.eecs.berkeley.edu/) are using to remotely monitor our robot while it is collecting data. It displays camera feed, GPS location, speed, and other relevant data from the onboard CPU of the robot.

The goal is for the robot to collect data in a fully autonomous manner, with minimal human supervision. We are using the collected data to train our deep reinforcement learning algorithm for navigation and collision avoidance. More details on the algorithm can be found [here](https://github.com/gkahn13/gcg).

The robot we are using is the [Jackal](https://www.clearpathrobotics.com/jackal-small-unmanned-ground-vehicle/), manufactured by Clearpath Robotics. The sensors on the robot include a 120 degree FOV camera, an infrared camera, and a microphone to capture audio. It also has a small LIDAR to automatically label the collected trajectory data with a collision/no collision label.

This webpage is built with a React.js frontend and a Flask backend. It is deployed on Heroku. Instructions on how to use it are below.
Here is a GIF of the webpage when receiving data:

![](jackal_command_center.gif)

## Local Setup Instructions

Clone this repository using

`git clone https://github.com/AdityaB97/remote-robot-monitor.git`

Run the webpack server in 'watch' mode using

```npm run build```

This will combine all the relevant Javascript files and packages into a single file that the website will use.

Run the Flask server using

```python3 app.py```

You should now be able to see the website at `localhost:5000`. If you would like to send some sample data to the website, run `python3 request_sender.py`. You should see the images changing and the pin on the map moving.

## Heroku Setup Instructions

This repo contains all the files necessary for deploying to Heroku (Aptfile, Pipfile, and Procfile). You can deploy it as a Heroku project by following the instructions [here](https://devcenter.heroku.com/articles/git).