# Caliban: Data Curation Tools for DeepCell.

Caliban is a segmentation and tracking tool used for human-in-the-loop data curation. It displays lineage data along with raw and annotated images. The output files prepare this information as training data for DeepCell.

## Instructions for Running Caliban Locally on Desktop
```bash
git clone https://github.com/vanvalenlab/caliban.git
cd caliban
python3 caliban.py [input file location]
```

## Tools Guide
Files can be edited using keyboard operations.

To navigate through frames:  
Back one frame = a or &larr;  
Forward one frame = d or &rarr;  

All edit operations are from &rarr; to  

r - replace  
c - create  
p - parent  
s - swap  
s - save  
x - delete cell mask in frame  
w - watershed  
esc - cancel operation  
space bar - enter  

z - switch between annotations and raw images  
scroll wheel - change image contrast

## Instructions for Running Caliban in a Docker Container

[EDITING IN PROGRESS] 

### Build a Docker Container

```bash
git clone https://github.com/vanvalenlab/caliban.git
cd Caliban
cd mcaliban
docker build -t mcaliban .
```
### Run the New Docker Image

```bash
docker run \
-p 5900:5900 \
-v $PWD/desktop:/usr/src/app/desktop  \
--privileged \
mcaliban:latest
```
This will launch a new Docker container and run Xvfb, Fluxbox, and a VNC server. To access the container’s display, point a VNC client to 127.0.0.1.

Inside the VNC client, one can access Caliban through the terminal emulator. Start the terminal by right-clicking the desktop and selecting

```bash
Applications > Terminal Emulators > XTerm
```
Next, enter the following into the terminal and Caliban will start:

```bash
cd desktop
python3 caliban.py [input file location]
```

