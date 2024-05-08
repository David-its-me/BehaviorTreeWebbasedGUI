# BehaviorTreeWebbasedGUI
This is a webbased GUI to select subbranches of in the behaviourtree application of Fraunhofer IPA. 
This simple Webserver can receives data blobs and which are then polled by the behaviourtree framework.
For more infomation on the behaviourtree framework go to:
https://gitlab.cc-asp.fraunhofer.de/ipa326/demonstrator/bt_based_application_framework



## Build the Container Image
The service is made as a Docker container. After that you can build an run the Docker container. Please be aware that Docker must already be installed on your operating system. Here you can find more information about docker: https://docs.docker.com/.

Open a terminal and go into the root directory of this reposiory. There you can build the project with the following command:
```
docker build -t <tag> .
```
Please invent your own name for the container image in the ```<tag>``` variable.

## Run the Container Image
After build was successful you can run your container image with the follwing command:
```
docker run -p 80:80 <tag>
```
The ```-p``` option opens a port between the operating system and the container, to be able to access the container on port 80.

Now you can open http://127.0.0.1/ or http://localhost/ and see if everything is working!
