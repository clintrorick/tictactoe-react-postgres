import {useState} from 'react'

export function RectClickable(props){

    function toggleOpacity(opacityVal){
        setRectStyle({opacity:opacityVal})
    }

    const [rectStyle, setRectStyle] = useState({opacity:"0.0"});

    return  <rect x={props.x * 200 + 8} 
                    y={props.y * 200 + 8}
                    width={ 200 - 8 }
                    height={ 200 - 8 } 
                    style={rectStyle}
                    onClick={()=>props.rectClicked(props.x, props.y, props.markType)} //use context for cross or circle
                    onMouseEnter={()=>toggleOpacity("0.1")}
                    onMouseLeave={()=>toggleOpacity("0.0")}>

            </rect>;
}
