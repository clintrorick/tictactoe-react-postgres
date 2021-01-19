import { useState, React } from 'react'
import PropTypes from 'prop-types'

export function RectClickable( props ) {
    function toggleOpacity( opacityVal ) {
        setRectStyle( { opacity: opacityVal } )
    }

    RectClickable.propTypes = {
        rectClicked: PropTypes.func,
        x: PropTypes.number,
        y: PropTypes.number,
        markType: PropTypes.string
    }

    const [ rectStyle, setRectStyle ] = useState( { opacity: '0.0' } )

    return <rect x={props.x * 200 + 8}
        y={props.y * 200 + 8}
        width={ 200 - 8 }
        height={ 200 - 8 }
        style={rectStyle}
        onClick={() => props.rectClicked( props.x, props.y, props.markType )} // use context for cross or naught
        onMouseEnter={() => toggleOpacity( '0.1' )}
        onMouseLeave={() => toggleOpacity( '0.0' )}>

    </rect>
}
