import './App.css';
import { RectClickable } from './RectClickable'
import { Cross } from './Cross'
import {Circle} from './Circle'
import { useState } from 'react'

class SquareState {
  constructor(x,y,mark){
    this.x = x;
    this.y = y;
    this.mark = mark;
  }

}
function App() {


  let [activeMarkType, updateActiveMarkType] = useState("circle")

  let [allSquaresState, updateAllSquaresState] = useState(
    [ {x:0,y:0,mark:"empty"},
      {x:1,y:0,mark:"empty"},
      {x:2,y:0,mark:"empty"},
      {x:0,y:1,mark:"empty"},//cross and circle are other marks
      {x:1,y:1,mark:"empty"},
      {x:2,y:1,mark:"empty"},
      {x:0,y:2,mark:"empty"},
      {x:1,y:2,mark:"empty"},
      {x:2,y:2,mark:"empty"}
    ])

  function getStateForSquare(x,y){
    return allSquaresState.filter((square)=>square.x === x && square.y === y).mark
  }

  function squareClicked(x,y,mark){
    let allSquaresStateNew = allSquaresState.map( square => {
      if (square.x === x && square.y === y){
        square.mark = mark
      }
      return square
    });
    updateAllSquaresState(allSquaresStateNew)
  }

  return (
    <div className="App">
      <div className="row">

        <div className="col-side">
            <button className={activeMarkType === "circle" ? '' : 'button-outline' } onClick={()=> { if (activeMarkType==="cross"){ updateActiveMarkType("circle") } }}>Circle Player</button>
          
            <button className={activeMarkType === "cross" ? '' : 'button-outline' } onClick={()=>{ if (activeMarkType==="circle"){ updateActiveMarkType("cross") } }}>Cross Player</button>

        </div>
        <div className="col-middle">

      {/* NOTES: viewbox defines the coordinate system - for example this is 600 units wide 600 units high
          must set fill=black and opacity=some value to be able to click an svg */}
      <svg  viewBox="0 0 600 600">

        <line x1="200" y1="0" x2="200" y2="600" ></line>
        <line x1="400" y1="0" x2="400" y2="600" ></line>
        <line x1="0" y1="400" x2="600" y2="400" ></line>
        <line x1="0" y1="200" x2="600" y2="200" ></line>

        {/* draw crosses/circles on grid */}
        {allSquaresState.map((squareState)=>{
          if (squareState.mark==="cross"){
            return <Cross x={squareState.x} y={squareState.y}></Cross>
          }
          if (squareState.mark==="circle"){
            return <Circle x={squareState.x} y={squareState.y}></Circle>
          }
          return null

        })}

        {/*clickable invisible squares*/}
        {[0,1,2].map((x)=>{
            return [0,1,2].map((y)=>{
              return <RectClickable x={x} y={y} markType={activeMarkType} rectClicked={squareClicked}></RectClickable>
            })
        })}

      </svg>

        </div>
         <div className="col-side"></div>
    </div>
    </div>
  );
}
//        

export default App;
