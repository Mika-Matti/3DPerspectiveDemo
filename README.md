# 3DPerspectiveDemo
This is a showcase demo of casting a simple 3D object to a 2D canvas. Made in p5.js.

You may test out the project at https://mika-matti.github.io/3DPerspectiveDemo/ 
Moving mouse horizontally moves the 3D object horizontally and
moving the mouse vertically moves the 3D object away or towards the viewer.

There might be updates to this showcase in the future, but for now it consists of
a simple 3D cube and a viewer.

There are three perspectives, upper left is from the right side and 
upper right is from top down. Below these two perspectives is the
viewer's perspective where the 3-dimensional enviroment is cast 
onto a 2-dimensional window between viewer and the object.

The 3D perspective is based on the idea of casting rays from
the 3D object's vertices to the viewer and calculating where
these rays cross the window between the object and viewer.

The object's lines are then drawn between these points in the window.

The two perspectives above the 3D perspective help visualize how
the rays are cast and catched between the viewer and object.
