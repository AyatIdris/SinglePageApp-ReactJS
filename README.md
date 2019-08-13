Note: this project was bootstrapped with [Create React App][0], feel free to
reference that if needed.

To run the app, install dependencies `yarn install` then run `yarn start`.

Reference the supporting material shared with you to understand what's expected
in this work sample. The stub API discussed in the material is provided under
`src/api`. The entrypoint for your code is `src/App.js`.


Here’s how the app should work:
● The home page should show a list of controls, and their status
● Clicking through any of those controls should yield a detail page that shows the control,
its status, and buttons to update its state.

The API exposes a set of functions you can use to interact with the data:
● getControls(options: Options): Promise<Array<Control>>
● getStates(options: Options): Promise<Array<ControlState>>
● getControl(controlId: ControlId, options: Options): Promise<Control>
● getControlState(controlId: ControlId, options: Options): Promise<?ControlState>
● putControlState(controlId: ControlId, isImplemented: boolean, options:
Options): Promise<ControlState>

All of these calls accepts a special Options object as their last parameter. The Options object
contains a delay boolean flag and a fail boolean flag.

● If the delay flag is set, API calls will be slowed down (this is how we’ll assess your implementation). 
Otherwise, they’ll complete immediately. The calls that return an array have a long delay (5 seconds), 
whereas other calls have a short delay (1 second). Use this information to optimize your solution.
● If the fail flag is set, API calls will return an error. If not, 
they will only throw exceptions if you try to call getControl, 
getControlState, or putControlState with an invalid controlId