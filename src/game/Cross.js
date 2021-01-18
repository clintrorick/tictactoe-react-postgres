import React from 'react'
import PropTypes from 'prop-types'

export function Cross( props ) {
    const y = props.y
    const x = props.x

    Cross.propTypes = {
        x: PropTypes.number,
        y: PropTypes.number
    }

    return <g>
        <line x1={ x * 200 + 23 }
            y1={ y * 200 + 23 }
            x2={( x + 1 ) * 200 - 23}
            y2={( y + 1 ) * 200 - 23} ></line>
        <line x1={ x * 200 + 23 }
            y1={( y + 1 ) * 200 - 23}
            x2={( x + 1 ) * 200 - 23}
            y2={y * 200 + 23} ></line>
    </g>
}
