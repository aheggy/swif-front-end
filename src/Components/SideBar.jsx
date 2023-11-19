// Import the "SideBar.css" file for styling.
import "./SideBar.css";

// Import the React library..
import React from "react";

// Define a functional component named "Sidebar" that takes three props: width, height, and children.
export const Sidebar = ({ width, height, children }) => {
  // Initialize the xPosition state variable with a value of -width using React.useState.  

  //Inside useEffect we will update the sidebar’s position when the component first renders. To do this, we place an empty array as the second parameter inside useEffect.

  // “xPosition” will determine the sidebar’s x coordinate in the screen. Since we want the bar to slide from left to right, we want it to be hidden to the left side of the screen.


  const [xPosition, setX] = React.useState(-width);

  // Define a function named "toggleMenu" that will be used to toggle the sidebar.
  const toggleMenu = () => {
    // If the current xPosition is less than 0, set xPosition to 0 to show the sidebar.
    if (xPosition < 0) {
      setX(0);
    } else {
      // Otherwise, set xPosition to -width to hide the sidebar.

      //“xPosition” will determine the sidebar’s x coordinate in the screen. Since we want the bar to slide from left to right, we want it to be hidden to the left side of the screen.

      setX(-width);
    }
  };

//make a function that when clicked, will change xPosition from 0 to -width and vice versa.

//we check if xPosition is negative. If it is, it means the sidebar is currently hidden, so we set xPosition to 0. If it’s open, we set it to be -width

//In order to display the button where we want, we can use the translate property to modify its position on the screen.

  // Use the React useEffect hook to set the initial xPosition to 0 when the component is mounted.
  React.useEffect(() => {
    setX(0);
  }, []);

  // Return the JSX (React elements) that make up the sidebar component.
  return (
    <React.Fragment>
      <div
        className="side-bar"
        style={{
          // Apply a CSS transform to the sidebar to control its horizontal position based on xPosition.
          transform: `translateX(${xPosition}px)`,
          width: width,
          minHeight: height
        }}
      >
        <button
          // Attach a click event handler that calls the "toggleMenu" function when the button is clicked.
          onClick={() => toggleMenu()}
          className="toggle-menu"
          style={{
            // Apply a CSS transform to the button to control its horizontal position based on the width.
            transform: `translate(${width}px, 20vh)`
          }}
        ></button>
        <div className="content">
          {children} {/* Render the content passed as children within the sidebar. */}
        </div>
      </div>
    </React.Fragment>
  );
};
