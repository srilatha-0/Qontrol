what is react ? //changes to the real dom only 
what is spa? //specific changes ...issue : search engine optimisation sigle url no indeexing
waht is jsx? // html code into the jsx ,self closign tags,camel casing ,{}
functional components and class components?//class form teh react.Compoenents uses the render method before hooks this.state and this.setState
//statless and the class components are state after hooks use state and use effetc to handle the state and the life cycel changes 
state and stateless components?
//they do not manage or store the just recive the data from the props and disaplay it best when no logic and display
//state can manage their own state and manage the existign the state based on the user interaction statefull
what are props in react?                        
//way to pass data form the parent components to the child components .The child cannot modify these values they are read only both the props and state are used to control and manipulate how components behave and render.
waht is the difference between the state and the props in react?
//state is mutable object that stores the dynamic data and prop is an immubatale object
//state is private and fully controlled by the componenets it belongs to , prop are immuatable  controllec by teh parent not by the childdren
what are the controlled and the uncontrolled componenets ?
//controlled components are used when the control is required over the data being entered into a FormData.accesed throught the state attr
//uncontrolled componets are used whren there is no need to dynamically inspect the user inputs.access through ref
what are keyattributes?
//list = [appled,banna,mango] used to identify the elements uniquely .no rerender of the entire list
what are fragments the react?
//used to group the elements togethter <></> .. <frgaments></fragments> avoid unecessary wrapper elements 
what is virtual dom?
//a lightweight in memoory represetation of the oof the actaul dom save the time
what the react life cycle method why are they used?
//they are the special functions that provide the granular level control to the developers to hook into specific points in the components life cycle .
//mounting ------> updating -------> unmounting
//constructor ---> getderivedstatefromprops ---> render --->component did mount
//getderivedstatefromprops -- > should componet update --> render -- >get the snaps shot --> component diid mount
//components will unmount
explain the useState and the useeffect?
// import React,{useState ,useEffect} from "react";
// const timer = ()=>(
//     const [counter,setCounter] = useState(0);
//     const [seconds , setSeconds] = useState(0);
//     const increment = () =>{
//         setCounter(prev => prev+1);
//     }
//     const decrement = () =>{
//         setcouter(prev => prev-1);
//     }
//     useEffect(() => {
//         const interval = setInterval(()=>{
//             setSeconds(prev => prev+1);
//         },1000);
//         return ()=>clearInterval(interval);
//     },[]);
    
//     return (
//         <div>
//             <p>count:{counter}</p>
//             <button onClick={increment}>increment</button>
//             <button onClick={decrement}>decremrnt</button>
//             <p>{seconds}</p>
//         </div>
//     )
// )
what is props drilling ?
//parent
//child
//grand child
context api?
// solution for the props drillgin creates the global components..allows to manage and then share the data 
what are higher order componets?
//function that takes a compoennts as the input and then returns a new compoent with additionall or the modified functionaliy
what is reconcilation in react ?
// inital render(VD) --> state or props change(create a new VD light weight copy) --> diffing (compares the old vd with the new vd)-->update --> commit
how the react portals work and when shoufl they be used?

Login Page
    ↓
Enter Credentials
    ↓
POST /login
    ↓
Find User in MongoDB
    ↓
Verify Password
    ↓
Generate JWT Token
    ↓
Send Token to React
    ↓
Store Token
    ↓
Access Protected Routes



React Request
    ↓
Bearer Token Sent
    ↓
JWT Verify
    ↓
Extract User ID
    ↓
Fetch User Data
    ↓
Return Response