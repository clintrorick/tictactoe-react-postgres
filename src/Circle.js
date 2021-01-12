export function Circle(props){ 
    return <circle cx = { 200 * props.x + 100 } cy = { 200 * props.y + 100 } r={80}></circle>
}