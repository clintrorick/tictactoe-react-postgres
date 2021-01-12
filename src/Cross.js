export function Cross(props){
    let y = props.y;
    let x = props.x;
   return  <g><line x1={x * 200 + 23} y1={y * 200 +23} x2={(x + 1) * 200 -23} y2={(y+1) * 200 - 23} ></line>
            <line x1={x * 200 + 23} y1={(y + 1) * 200 - 23} x2={(x + 1) * 200 - 23} y2={y * 200 + 23} ></line></g>
}